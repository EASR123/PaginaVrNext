'use server';

import sql from '@/app/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type ActionResult = { ok: boolean; message: string };

// Seguridad: solo instructores
async function ensureInstructor() {
  const session = await auth();
  if (!session?.user?.email) return { ok: false, message: 'No autenticado' as const };

  const me = await sql<{ rol: 'instructor' | 'capacitado' }[]>`
    SELECT rol FROM public.usuarios WHERE correo = ${session.user.email} LIMIT 1
  `;
  if (!me[0] || me[0].rol !== 'instructor') {
    return { ok: false, message: 'No permitido' as const };
  }
  return { ok: true, message: 'OK' as const };
}

// Acción: actualizar rol
export async function updateUserRoleAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const authz = await ensureInstructor();
  if (!authz.ok) return authz;

  const schema = z.object({
    userId: z.string().uuid(),
    role: z.enum(['instructor', 'capacitado']),
  });

  const parsed = schema.safeParse({
    userId: formData.get('userId'),
    role: formData.get('role'),
  });

  if (!parsed.success) {
    return { ok: false, message: 'Datos inválidos' };
  }

  await sql/*sql*/`
    UPDATE public.usuarios
    SET rol = ${parsed.data.role}::public.rol_usuario, actualizado_en = now()
    WHERE id = ${parsed.data.userId}
  `;

  revalidatePath('/dashboard/users');
  return { ok: true, message: 'Rol actualizado' };
}

// Acción: activar / desactivar
export async function toggleActiveAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const authz = await ensureInstructor();
  if (!authz.ok) return authz;

  const schema = z.object({
    userId: z.string().uuid(),
    active: z.enum(['true', 'false']),
  });

  const parsed = schema.safeParse({
    userId: formData.get('userId'),
    active: formData.get('active'),
  });

  if (!parsed.success) {
    return { ok: false, message: 'Datos inválidos' };
  }

  const next = parsed.data.active === 'true';

  await sql/*sql*/`
    UPDATE public.usuarios
    SET activo = ${next}, actualizado_en = now()
    WHERE id = ${parsed.data.userId}
  `;

  revalidatePath('/dashboard/users');
  return { ok: true, message: next ? 'Usuario activado' : 'Usuario desactivado' };
}
