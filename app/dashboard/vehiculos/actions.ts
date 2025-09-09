// app/dashboard/vehiculos/actions.ts
'use server';
import NextAuth from 'next-auth';
import sql from '@/app/lib/db';
//import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { authConfig } from '@/auth.config';

export const { auth } = NextAuth(authConfig);



async function ensureInstructor() {
  const session = await auth();
  if (!session?.user?.email) throw new Error('No autenticado');
  const me = await sql<{ rol: 'instructor' | 'capacitado' }[]>`
    SELECT rol FROM public.usuarios WHERE correo = ${session.user.email} LIMIT 1
  `;
  if (!me[0] || me[0].rol !== 'instructor') throw new Error('No permitido');
}

/* ============ MARCAS ============ */
export async function createMarca(formData: FormData) {
  await ensureInstructor();
  const schema = z.object({ nombre: z.string().min(2).max(100) });
  const parsed = schema.safeParse({ nombre: (formData.get('nombre') ?? '').toString().trim() });
  if (!parsed.success) redirect('/dashboard/vehiculos?err=Nombre+inválido');

  try {
    await sql/*sql*/`
      INSERT INTO public.marcas (nombre) VALUES (${parsed.data.nombre})
      ON CONFLICT (nombre) DO NOTHING
    `;
    revalidatePath('/dashboard/vehiculos');
    redirect('/dashboard/vehiculos?ok=Marca+creada');
  } catch (e) {
    redirect('/dashboard/vehiculos?err=No+se+pudo+crear+marca');
  }
}

export async function updateMarca(formData: FormData) {
  await ensureInstructor();
  const schema = z.object({
    id: z.string().uuid(),
    nombre: z.string().min(2).max(100),
  });
  const parsed = schema.safeParse({
    id: formData.get('id'),
    nombre: (formData.get('nombre') ?? '').toString().trim(),
  });
  if (!parsed.success) redirect('/dashboard/vehiculos?err=Datos+inválidos');

  try {
    await sql/*sql*/`
      UPDATE public.marcas
      SET nombre = ${parsed.data.nombre}, actualizado_en = now()
      WHERE id = ${parsed.data.id}
    `;
    revalidatePath('/dashboard/vehiculos');
    redirect('/dashboard/vehiculos?ok=Marca+actualizada');
  } catch {
    redirect('/dashboard/vehiculos?err=No+se+pudo+actualizar+marca');
  }
}

export async function deleteMarca(formData: FormData) {
  await ensureInstructor();
  const id = formData.get('id')?.toString();
  if (!id) redirect('/dashboard/vehiculos?err=ID+inválido');

  try {
    await sql/*sql*/`DELETE FROM public.marcas WHERE id = ${id}`;
    revalidatePath('/dashboard/vehiculos');
    redirect('/dashboard/vehiculos?ok=Marca+eliminada');
  } catch {
    // Normalmente falla por FK si hay modelos asociados
    redirect('/dashboard/vehiculos?err=No+puede+eliminarse:+tiene+modelos+asociados');
  }
}

/* ============ MODELOS ============ */
const modelSchema = z.object({
  id: z.string().uuid().optional(),
  marca_id: z.string().uuid(),
  nombre: z.string().min(1).max(100),
  anio_desde: z.coerce.number().int().min(1886),
  anio_hasta: z
    .union([z.coerce.number().int().min(1886), z.literal(''), z.null()])
    .transform((v) => (v === '' ? null : (v as number | null))),
});

export async function createModelo(formData: FormData) {
  await ensureInstructor();
  const parsed = modelSchema.safeParse({
    marca_id: formData.get('marca_id'),
    nombre: (formData.get('nombre') ?? '').toString().trim(),
    anio_desde: formData.get('anio_desde'),
    anio_hasta: formData.get('anio_hasta'),
  });
  if (!parsed.success) redirect('/dashboard/vehiculos?err=Datos+inválidos');

  const { marca_id, nombre, anio_desde, anio_hasta } = parsed.data;
  if (anio_hasta !== null && anio_hasta < anio_desde) {
    redirect('/dashboard/vehiculos?err=Rango+de+año+inválido');
  }

  try {
    await sql/*sql*/`
      INSERT INTO public.modelos_vehiculo
        (marca_id, nombre, anio_desde, anio_hasta)
      VALUES
        (${marca_id}, ${nombre}, ${anio_desde}, ${anio_hasta})
      ON CONFLICT (marca_id, nombre, anio_desde, anio_hasta) DO NOTHING
    `;
    revalidatePath('/dashboard/vehiculos');
    redirect('/dashboard/vehiculos?ok=Modelo+creado');
  } catch {
    redirect('/dashboard/vehiculos?err=No+se+pudo+crear+modelo');
  }
}

export async function updateModelo(formData: FormData) {
  await ensureInstructor();
  const parsed = modelSchema.extend({ id: z.string().uuid() }).safeParse({
    id: formData.get('id'),
    marca_id: formData.get('marca_id'),
    nombre: (formData.get('nombre') ?? '').toString().trim(),
    anio_desde: formData.get('anio_desde'),
    anio_hasta: formData.get('anio_hasta'),
  });
  if (!parsed.success) redirect('/dashboard/vehiculos?err=Datos+inválidos');

  const { id, marca_id, nombre, anio_desde, anio_hasta } = parsed.data as Required<z.infer<typeof modelSchema>> & { id: string };
  if (anio_hasta !== null && anio_hasta < anio_desde) {
    redirect('/dashboard/vehiculos?err=Rango+de+año+inválido');
  }

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
    redirect('/dashboard/vehiculos?ok=Modelo+actualizado');
  } catch {
    redirect('/dashboard/vehiculos?err=No+se+pudo+actualizar+modelo');
  }
}

export async function deleteModelo(formData: FormData) {
  await ensureInstructor();
  const id = formData.get('id')?.toString();
  if (!id) redirect('/dashboard/vehiculos?err=ID+inválido');

  try {
    await sql/*sql*/`DELETE FROM public.modelos_vehiculo WHERE id = ${id}`;
    revalidatePath('/dashboard/vehiculos');
    redirect('/dashboard/vehiculos?ok=Modelo+eliminado');
  } catch {
    // Fallará si hay sesiones_vr o modulos_modelos apuntando a este modelo
    redirect('/dashboard/vehiculos?err=No+puede+eliminarse:+tiene+referencias');
  }
}
