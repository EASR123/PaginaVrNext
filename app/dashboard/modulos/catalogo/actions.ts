'use server';

import NextAuth from 'next-auth';
import sql from '@/app/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { authConfig } from '@/auth.config';
import { fetchUserByEmail } from '@/app/lib/users';

export const { auth } = NextAuth(authConfig);

function go(params: Record<string, string>) {
  const usp = new URLSearchParams(params);
  redirect(`/dashboard/modulos/catalogo?${usp.toString()}`);
}

async function ensureInstructorAndGetUserId(): Promise<string> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) go({ err: 'No+autenticado' });

  const me = await fetchUserByEmail(email as string);
  if (!me) throw new Error('Usuario no encontrado');
  if (me.rol !== 'instructor') throw new Error('No permitido');
  return me.id;
}

const codigoSchema = z
  .string()
  .trim()
  .min(2, 'Código muy corto')
  .max(32, 'Código muy largo')
  .regex(/^[A-Z0-9._-]+$/, 'Solo A-Z, 0-9, . _ -');

const tituloSchema = z.string().trim().min(2, 'Título muy corto').max(180, 'Título muy largo');

const estadoEnum = z.enum(['borrador', 'activo', 'inactivo'], {
  required_error: 'Estado requerido',
});

const dificultadEnum = z.enum(['facil', 'medio', 'dificil']).nullable().optional();

const tiempoSchema = z
  .union([z.coerce.number().int().min(0), z.literal(''), z.null()])
  .transform((v) => (v === '' ? null : (v as number | null)));

const moduloCreateSchema = z.object({
  codigo: codigoSchema,
  titulo: tituloSchema,
  descripcion: z.string().trim().max(2000).nullable().optional(),
  estado: estadoEnum.default('borrador'),
  dificultad: dificultadEnum,
  tiempo_estimado_min: tiempoSchema,
});

const moduloUpdateSchema = moduloCreateSchema.extend({
  id: z.string().uuid('ID inválido'),
});

const idSchema = z.object({ id: z.string().uuid('ID inválido') });

/* ---------- Create ---------- */
export async function createModulo(formData: FormData) {
  const userId = await ensureInstructorAndGetUserId();

  const { codigo, titulo, descripcion, estado, dificultad, tiempo_estimado_min } =
    moduloCreateSchema.parse({
      codigo: (formData.get('codigo') ?? '').toString().toUpperCase(),
      titulo: (formData.get('titulo') ?? '').toString(),
      descripcion: (formData.get('descripcion') ?? '').toString(),
      estado: (formData.get('estado') ?? 'borrador').toString(),
      dificultad: formData.get('dificultad') ? (formData.get('dificultad') as string) : null,
      tiempo_estimado_min: formData.get('tiempo_estimado_min'),
    });

  try {
    await sql/*sql*/`
      INSERT INTO public.modulos
        (codigo, titulo, descripcion, estado, dificultad, tiempo_estimado_min, creado_por)
      VALUES
        (${codigo}, ${titulo}, ${descripcion || null}, ${estado}, ${dificultad ?? null}, ${tiempo_estimado_min}, ${userId})
    `;
    revalidatePath('/dashboard/modulos/catalogo');
    go({ ok: 'Módulo+creado' });
  } catch (e: any) {
    if (e?.code === '23505') go({ err: 'Código+de+módulo+ya+existe' });
    go({ err: 'No+se+pudo+crear+módulo' });
  }
}

/* ---------- Update ---------- */
export async function updateModulo(formData: FormData) {
  await ensureInstructorAndGetUserId();

  const { id, codigo, titulo, descripcion, estado, dificultad, tiempo_estimado_min } =
    moduloUpdateSchema.parse({
      id: formData.get('id'),
      codigo: (formData.get('codigo') ?? '').toString().toUpperCase(),
      titulo: (formData.get('titulo') ?? '').toString(),
      descripcion: (formData.get('descripcion') ?? '').toString(),
      estado: (formData.get('estado') ?? 'borrador').toString(),
      dificultad: formData.get('dificultad') ? (formData.get('dificultad') as string) : null,
      tiempo_estimado_min: formData.get('tiempo_estimado_min'),
    });

  try {
    await sql/*sql*/`
      UPDATE public.modulos
      SET codigo = ${codigo},
          titulo = ${titulo},
          descripcion = ${descripcion || null},
          estado = ${estado},
          dificultad = ${dificultad ?? null},
          tiempo_estimado_min = ${tiempo_estimado_min},
          actualizado_en = now()
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/modulos/catalogo');
    go({ ok: 'Módulo+actualizado' });
  } catch (e: any) {
    if (e?.code === '23505') go({ err: 'Código+duplicado' });       // unique (codigo)
    if (e?.code === '23514') go({ err: 'Tiempo+estimado+inválido' }); // check constraint
    go({ err: 'No+se+pudo+actualizar+módulo' });
  }
}

/* ---------- Delete ---------- */
export async function deleteModulo(formData: FormData) {
  await ensureInstructorAndGetUserId();

  const { id } = idSchema.parse({ id: formData.get('id') });

  try {
    await sql/*sql*/`DELETE FROM public.modulos WHERE id = ${id}`;
    revalidatePath('/dashboard/modulos/catalogo');
    go({ ok: 'Módulo+eliminado' });
  } catch (e: any) {
    if (e?.code === '23503') {
      // FK violation: el módulo está referenciado (sesiones, etc.)
      go({ err: 'No+puede+eliminarse:+tiene+referencias' });
    }
    go({ err: 'No+se+pudo+eliminar+módulo' });
  }
}
