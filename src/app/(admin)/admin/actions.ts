'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { verifyPassword, createToken, COOKIE_NAME } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function loginAction(_prevState: { error: string } | null, formData: FormData): Promise<{ error: string }> {
  const password = formData.get('password') as string;
  if (!password) return { error: 'Password richiesta' };

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
