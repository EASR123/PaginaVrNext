'use server';

import NextAuth from 'next-auth';
import sql from '@/app/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { authConfig } from '@/auth.config';

export const { auth } = NextAuth(authConfig);

/* ---------------- Helpers ---------------- */

function go(path: string, params: Record<string, string>) {
  const usp = new URLSearchParams(params);
  redirect(`${path}?${usp.toString()}`);
}

/** Garantiza email string (no undefined) y que el usuario sea instructor */
async function ensureInstructor(): Promise<string> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    go('/dashboard/vehiculos', { err: 'No+autenticado' });
  }
  const userEmail = email as string;

  const me = await sql<{ rol: 'instructor' | 'capacitado' }[]>`
    SELECT rol FROM public.usuarios WHERE correo = ${userEmail} LIMIT 1
  `;
  if (!me[0] || me[0].rol !== 'instructor') {
    go('/dashboard/vehiculos', { err: 'No+permitido' });
  }
  return userEmail;
}

/* ---------------- Schemas ---------------- */

const nombreSchema = z.string().trim().min(2, 'Nombre muy corto').max(100, 'Nombre muy largo');
const idSchema = z.object({ id: z.string().uuid('ID inválido') });

const marcaCreateSchema = z.object({ nombre: nombreSchema });
const marcaUpdateSchema = z.object({ id: z.string().uuid('ID inválido'), nombre: nombreSchema });

const modeloBase = z.object({
  marca_id: z.string().uuid('Marca inválida'),
  nombre: nombreSchema,
  anio_desde: z.coerce.number().int().min(1886, 'Año mínimo 1886'),
  anio_hasta: z
    .union([z.coerce.number().int().min(1886), z.literal(''), z.null()])
    .transform((v) => (v === '' ? null : (v as number | null))),
});

const modeloCreateSchema = modeloBase.refine(
  (d) => d.anio_hasta === null || d.anio_hasta >= d.anio_desde,
  { message: 'Rango de año inválido' },
);

const modeloUpdateSchema = modeloBase
  .extend({ id: z.string().uuid('ID inválido') })
  .refine((d) => d.anio_hasta === null || d.anio_hasta >= d.anio_desde, {
    message: 'Rango de año inválido',
  });

/* ---------------- Marcas ---------------- */

export async function createMarca(formData: FormData) {
  await ensureInstructor();

  // 👉 usa .parse() para evitar "possibly undefined"
  const { nombre } = marcaCreateSchema.parse({
    nombre: (formData.get('nombre') ?? '').toString(),
  });

  try {
    await sql/*sql*/`
      INSERT INTO public.marcas (nombre) VALUES (${nombre})
      ON CONFLICT (nombre) DO NOTHING
    `;
    revalidatePath('/dashboard/vehiculos');
    go('/dashboard/vehiculos', { ok: 'Marca+creada' });
  } catch (e: any) {
    if (e?.code === '23505') go('/dashboard/vehiculos', { err: 'La+marca+ya+existe' });
    go('/dashboard/vehiculos', { err: 'No+se+pudo+crear+marca' });
  }
}

export async function updateMarca(formData: FormData) {
  await ensureInstructor();

  const { id, nombre } = marcaUpdateSchema.parse({
    id: formData.get('id'),
    nombre: (formData.get('nombre') ?? '').toString(),
  });

  try {
    await sql/*sql*/`
      UPDATE public.marcas
      SET nombre = ${nombre}, actualizado_en = now()
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/vehiculos');
    go('/dashboard/vehiculos', { ok: 'Marca+actualizada' });
  } catch (e: any) {
    if (e?.code === '23505') go('/dashboard/vehiculos', { err: 'Nombre+de+marca+duplicado' });
    go('/dashboard/vehiculos', { err: 'No+se+pudo+actualizar+marca' });
  }
}

export async function deleteMarca(formData: FormData) {
  await ensureInstructor();

  const { id } = idSchema.parse({ id: formData.get('id') });

  try {
    await sql/*sql*/`DELETE FROM public.marcas WHERE id = ${id}`;
    revalidatePath('/dashboard/vehiculos');
    go('/dashboard/vehiculos', { ok: 'Marca+eliminada' });
  } catch (e: any) {
    if (e?.code === '23503') go('/dashboard/vehiculos', { err: 'Tiene+modelos+asociados' });
    go('/dashboard/vehiculos', { err: 'No+se+pudo+eliminar+marca' });
  }
}

/* ---------------- Modelos ---------------- */

export async function createModelo(formData: FormData) {
  await ensureInstructor();

  const { marca_id, nombre, anio_desde, anio_hasta } = modeloCreateSchema.parse({
    marca_id: formData.get('marca_id'),
    nombre: (formData.get('nombre') ?? '').toString(),
    anio_desde: formData.get('anio_desde'),
    anio_hasta: formData.get('anio_hasta'),
  });

  try {
    await sql/*sql*/`
      INSERT INTO public.modelos_vehiculo (marca_id, nombre, anio_desde, anio_hasta)
      VALUES (${marca_id}, ${nombre}, ${anio_desde}, ${anio_hasta})
      ON CONFLICT (marca_id, nombre, anio_desde, anio_hasta) DO NOTHING
    `;
    revalidatePath('/dashboard/vehiculos');
    go('/dashboard/vehiculos', { ok: 'Modelo+creado' });
  } catch (e: any) {
    if (e?.code === '23505') go('/dashboard/vehiculos', { err: 'Modelo+duplicado' });
    if (e?.code === '23503') go('/dashboard/vehiculos', { err: 'Marca+no+existe' });
    go('/dashboard/vehiculos', { err: 'No+se+pudo+crear+modelo' });
  }
}

export async function updateModelo(formData: FormData) {
  await ensureInstructor();

  const { id, marca_id, nombre, anio_desde, anio_hasta } = modeloUpdateSchema.parse({
    id: formData.get('id'),
    marca_id: formData.get('marca_id'),
    nombre: (formData.get('nombre') ?? '').toString(),
    anio_desde: formData.get('anio_desde'),
    anio_hasta: formData.get('anio_hasta'),
  });

  try {
    await sql/*sql*/`
      UPDATE public.modelos_vehiculo
      SET marca_id = ${marca_id},
          nombre = ${nombre},
          anio_desde = ${anio_desde},
          anio_hasta = ${anio_hasta},
          actualizado_en = now()
      WHERE id = ${id}
    `;
    revalidatePath('/dashboard/vehiculos');
    go('/dashboard/vehiculos', { ok: 'Modelo+actualizado' });
  } catch (e: any) {
    if (e?.code === '23505') go('/dashboard/vehiculos', { err: 'Conflicto:+existe+otro+igual' });
    if (e?.code === '23503') go('/dashboard/vehiculos', { err: 'Marca+inexistente' });
    go('/dashboard/vehiculos', { err: 'No+se+pudo+actualizar+modelo' });
  }
}

export async function deleteModelo(formData: FormData) {
  await ensureInstructor();

  const { id } = idSchema.parse({ id: formData.get('id') });

  try {
    await sql/*sql*/`DELETE FROM public.modelos_vehiculo WHERE id = ${id}`;
    revalidatePath('/dashboard/vehiculos');
    go('/dashboard/vehiculos', { ok: 'Modelo+eliminado' });
  } catch (e: any) {
    if (e?.code === '23503') go('/dashboard/vehiculos', { err: 'Tiene+referencias' });
    go('/dashboard/vehiculos', { err: 'No+se+pudo+eliminar+modelo' });
  }
}
