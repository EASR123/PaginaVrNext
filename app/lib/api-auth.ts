// app/lib/api-auth.ts
import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { fetchUserByEmail } from '@/app/lib/users';

export const { auth } = NextAuth(authConfig);

export async function requireUser() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return { ok: false as const, status: 401, error: 'No autenticado' };
  }
  const me = await fetchUserByEmail(email);
  if (!me) {
    return { ok: false as const, status: 401, error: 'Usuario no encontrado' };
  }
  return { ok: true as const, user: me };
}

export async function requireInstructor() {
  const r = await requireUser();
  if (!r.ok) return r;
  if (r.user.rol !== 'instructor') {
    return { ok: false as const, status: 403, error: 'No permitido' };
  }
  return { ok: true as const, user: r.user };
}
