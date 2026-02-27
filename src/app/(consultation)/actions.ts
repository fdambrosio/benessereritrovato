'use server';

import { prisma } from '@/lib/db';
import { calculateRawScore, normalizeScore, getInterpretation, calculateSelfAssessmentAverage } from '@/lib/scoring/engine';
import { locusOfControlTest } from '@/data/tests/locus-of-control';
import { eventiSaluteTest } from '@/data/tests/eventi-salute';
import { medicineAlternativeTest } from '@/data/tests/medicine-alternative';
import { leadershipTest } from '@/data/tests/leadership';
import { selfAssessmentItems } from '@/data/self-assessment';
import { liteSelfAssessmentItems } from '@/data/lite-questions';
import { sendAdminNotification } from '@/lib/email/send';
import type { AnswerValue } from '@/types/test';
import type { PersonalData, LifestyleData } from '@/types/wizard';

interface SubmitData {
  personalData: PersonalData;
  locusAnswers: Record<number, AnswerValue>;
  eventiSaluteAnswers: Record<number, AnswerValue>;
  medicineAlternativeAnswers: Record<number, AnswerValue>;
  leadershipAnswers: Record<number, AnswerValue>;
  selfAssessmentAnswers: Record<string, number>;
  lifestyleData?: LifestyleData;
  isLite?: boolean;
}

export async function submitConsultation(data: SubmitData) {
  const isLite = data.isLite ?? true;

  // Calculate scores for each test
  // Use the actual number of answered questions for normalization
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

  const saItems = isLite ? liteSelfAssessmentItems : selfAssessmentItems;
  const selfAssessmentAvg = calculateSelfAssessmentAverage(data.selfAssessmentAnswers, saItems);

  // Save to database
  const submission = await prisma.submission.create({
    data: {
      nome: data.personalData.nome,
      cognome: data.personalData.cognome,
      email: data.personalData.email,
      telefono: data.personalData.telefono || null,
      eta: data.personalData.eta ? parseInt(data.personalData.eta) : null,
      peso: data.personalData.peso ? parseFloat(data.personalData.peso) : null,
      altezza: data.personalData.altezza ? parseFloat(data.personalData.altezza) : null,
      citta: data.personalData.citta || null,

      locusAnswers: JSON.stringify(data.locusAnswers),
      eventiSaluteAnswers: JSON.stringify(data.eventiSaluteAnswers),
      medicineAlternativeAnswers: JSON.stringify(data.medicineAlternativeAnswers),
      leadershipAnswers: JSON.stringify(data.leadershipAnswers),
      selfAssessmentAnswers: JSON.stringify(data.selfAssessmentAnswers),
      lifestyleAnswers: JSON.stringify(data.lifestyleData ?? {}),

      isLite: data.isLite ?? true,

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
    },
  });

  // Send email (non-blocking - don't fail the submission if email fails)
  let emailSent = false;
  try {
    await sendAdminNotification({
      submission,
      locusInterp,
      eventiInterp,
      medicineInterp,
      leadershipInterp,
      selfAssessmentAvg,
      lifestyleData: data.lifestyleData ?? ({} as LifestyleData),
    });
    emailSent = true;
    await prisma.submission.update({
      where: { id: submission.id },
      data: { emailSent: true },
    });
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }

  return {
    submissionId: submission.id,
    scores: {
      locus: { raw: locusRaw, normalized: locusNorm, interpretation: locusInterp },
      eventiSalute: { raw: eventiRaw, normalized: eventiNorm, interpretation: eventiInterp },
      medicineAlternative: { raw: medicineRaw, normalized: medicineNorm, interpretation: medicineInterp },
      leadership: { raw: leadershipRaw, normalized: leadershipNorm, interpretation: leadershipInterp },
      selfAssessmentAverage: selfAssessmentAvg,
      selfAssessmentAnswers: data.selfAssessmentAnswers,
    },
    emailSent,
  };
}
