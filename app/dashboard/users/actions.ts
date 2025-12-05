'use server';

import sql from '@/app/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import bcrypt from 'bcrypt';

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

// Acción: actualizar perfil + contraseña
export async function updateProfileAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.email) {
    return { ok: false, message: 'No autenticado' };
  }

  const nombre_completo = formData.get('nombre_completo')?.toString().trim() || '';
  const correo = formData.get('correo')?.toString().trim() || '';
  const password_actual = formData.get('password_actual')?.toString();
  const password_nueva = formData.get('password_nueva')?.toString();
  const password_confirmacion = formData.get('password_confirmacion')?.toString();

  if (!nombre_completo || !correo) {
    return { ok: false, message: 'Datos inválidos' };
  }

  // Buscar usuario
  const user = await sql<{ id: string; hash_password: string }[]>`
    SELECT id, hash_password FROM public.usuarios WHERE correo = ${session.user.email} LIMIT 1
  `;
  if (!user[0]) return { ok: false, message: 'Usuario no encontrado' };
  const userId = user[0].id;

  // Actualizar nombre/correo
  await sql/*sql*/`
    UPDATE public.usuarios
    SET nombre_completo = ${nombre_completo},
        correo = ${correo},
        actualizado_en = now()
    WHERE id = ${userId}
  `;

  // Si quiere cambiar contraseña
  if (password_actual || password_nueva || password_confirmacion) {
    if (!password_actual || !password_nueva || !password_confirmacion) {
      return { ok: false, message: 'Debes completar todos los campos de contraseña' };
    }

    const valid = await bcrypt.compare(password_actual, user[0].hash_password);
    if (!valid) return { ok: false, message: 'Contraseña actual incorrecta' };

    if (password_nueva !== password_confirmacion) {
      return { ok: false, message: 'La nueva contraseña no coincide' };
    }

    if (password_nueva.length < 6) {
      return { ok: false, message: 'La nueva contraseña debe tener al menos 6 caracteres' };
    }

    const newHash = await bcrypt.hash(password_nueva, 10);
    await sql/*sql*/`
      UPDATE public.usuarios
      SET hash_password = ${newHash}, actualizado_en = now()
      WHERE id = ${userId}
    `;
  }

  revalidatePath('/dashboard/users');
  return { ok: true, message: 'Perfil actualizado correctamente' };
}
