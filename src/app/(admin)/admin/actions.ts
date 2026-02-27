'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifyPassword, createToken, COOKIE_NAME } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { calculateRawScore, normalizeScore, getInterpretation, calculateSelfAssessmentAverage } from '@/lib/scoring/engine';
import { locusOfControlTest } from '@/data/tests/locus-of-control';
import { eventiSaluteTest } from '@/data/tests/eventi-salute';
import { medicineAlternativeTest } from '@/data/tests/medicine-alternative';
import { leadershipTest } from '@/data/tests/leadership';
import { selfAssessmentItems } from '@/data/self-assessment';
import type { AnswerValue } from '@/types/test';
import type { LifestyleData } from '@/types/wizard';

export async function loginAction(_prevState: { error: string } | null, formData: FormData): Promise<{ error: string }> {
  const password = formData.get('password') as string;
  if (!password) return { error: 'Password richiesta' };

  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (!envHash) {
    return { error: `ERRORE: ADMIN_PASSWORD_HASH non configurato nel .env.local` };
  }

  const valid = await verifyPassword(password);
  if (!valid) return { error: 'Password non valida' };

  const token = await createToken();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  redirect('/admin/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect('/admin/login');
}

export async function updateNotesAction(id: string, notes: string) {
  await prisma.submission.update({
    where: { id },
    data: { notes },
  });
  revalidatePath(`/admin/submission/${id}`);
}

export async function toggleViewedAction(id: string) {
  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) return;
  await prisma.submission.update({
    where: { id },
    data: { adminViewed: !submission.adminViewed },
  });
  revalidatePath(`/admin/submission/${id}`);
  revalidatePath('/admin/dashboard');
}

export async function getSubmissionForCompletion(id: string) {
  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) return null;
  return {
    id: submission.id,
    nome: submission.nome,
    cognome: submission.cognome,
    email: submission.email,
    telefono: submission.telefono,
    eta: submission.eta,
    peso: submission.peso,
    altezza: submission.altezza,
    citta: submission.citta,
    isLite: submission.isLite,
    locusAnswers: JSON.parse(submission.locusAnswers || '{}') as Record<string, AnswerValue>,
    eventiSaluteAnswers: JSON.parse(submission.eventiSaluteAnswers || '{}') as Record<string, AnswerValue>,
    medicineAlternativeAnswers: JSON.parse(submission.medicineAlternativeAnswers || '{}') as Record<string, AnswerValue>,
    leadershipAnswers: JSON.parse(submission.leadershipAnswers || '{}') as Record<string, AnswerValue>,
    selfAssessmentAnswers: JSON.parse(submission.selfAssessmentAnswers || '{}') as Record<string, number>,
    lifestyleAnswers: JSON.parse(submission.lifestyleAnswers || '{}') as LifestyleData,
  };
}

interface CompleteConsultationData {
  locusAnswers: Record<number, AnswerValue>;
  eventiSaluteAnswers: Record<number, AnswerValue>;
  medicineAlternativeAnswers: Record<number, AnswerValue>;
  leadershipAnswers: Record<number, AnswerValue>;
  selfAssessmentAnswers: Record<string, number>;
  lifestyleData: LifestyleData;
  eta?: number | null;
  peso?: number | null;
  altezza?: number | null;
  citta?: string | null;
}

export async function completeConsultation(id: string, data: CompleteConsultationData) {
  // Recalculate all scores with the full set of answers
  const locusAnsweredCount = Object.keys(data.locusAnswers).length;
  const locusRaw = calculateRawScore(data.locusAnswers, locusOfControlTest.questions);
  const locusNorm = normalizeScore(locusRaw, locusAnsweredCount, locusOfControlTest.fullScoreRange);
  const locusInterp = getInterpretation(locusNorm, locusOfControlTest.interpretations);

  const eventiAnsweredCount = Object.keys(data.eventiSaluteAnswers).length;
  const eventiRaw = calculateRawScore(data.eventiSaluteAnswers, eventiSaluteTest.questions);
  const eventiNorm = normalizeScore(eventiRaw, eventiAnsweredCount, eventiSaluteTest.fullScoreRange);
  const eventiInterp = getInterpretation(eventiNorm, eventiSaluteTest.interpretations);

  const medicineAnsweredCount = Object.keys(data.medicineAlternativeAnswers).length;
  const medicineRaw = calculateRawScore(data.medicineAlternativeAnswers, medicineAlternativeTest.questions);
  const medicineNorm = normalizeScore(medicineRaw, medicineAnsweredCount, medicineAlternativeTest.fullScoreRange);
  const medicineInterp = getInterpretation(medicineNorm, medicineAlternativeTest.interpretations);

  const leadershipAnsweredCount = Object.keys(data.leadershipAnswers).length;
  const leadershipRaw = calculateRawScore(data.leadershipAnswers, leadershipTest.questions);
  const leadershipNorm = normalizeScore(leadershipRaw, leadershipAnsweredCount, leadershipTest.fullScoreRange);
  const leadershipInterp = getInterpretation(leadershipNorm, leadershipTest.interpretations);

  const selfAssessmentAvg = calculateSelfAssessmentAverage(data.selfAssessmentAnswers, selfAssessmentItems);

  await prisma.submission.update({
    where: { id },
    data: {
      eta: data.eta ?? null,
      peso: data.peso ?? null,
      altezza: data.altezza ?? null,
      citta: data.citta || null,

      locusAnswers: JSON.stringify(data.locusAnswers),
      eventiSaluteAnswers: JSON.stringify(data.eventiSaluteAnswers),
      medicineAlternativeAnswers: JSON.stringify(data.medicineAlternativeAnswers),
      leadershipAnswers: JSON.stringify(data.leadershipAnswers),
      selfAssessmentAnswers: JSON.stringify(data.selfAssessmentAnswers),
      lifestyleAnswers: JSON.stringify(data.lifestyleData),

      locusScore: locusRaw,
      locusNormalized: locusNorm,
      eventiSaluteScore: eventiRaw,
      eventiSaluteNormalized: eventiNorm,
      medicineAlternativeScore: medicineRaw,
      medicineAlternativeNormalized: medicineNorm,
      leadershipScore: leadershipRaw,
      leadershipNormalized: leadershipNorm,
      selfAssessmentAverage: selfAssessmentAvg,

      locusInterpretation: locusInterp.key,
      eventiInterpretation: eventiInterp.key,
      medicineInterpretation: medicineInterp.key,
      leadershipInterpretation: leadershipInterp.key,

      isLite: false,
    },
  });

  revalidatePath(`/admin/submission/${id}`);
  revalidatePath('/admin/dashboard');

  return { success: true };
}
