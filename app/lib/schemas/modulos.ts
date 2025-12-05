// app/lib/schemas/modulos.ts
import { z } from 'zod';

export const estadoEnum = z.enum(['borrador', 'activo', 'inactivo']);
export const dificultadEnum = z.enum(['facil', 'medio', 'dificil']);

export const codigoSchema = z
  .string()
  .trim()
  .min(2, 'Código muy corto')
  .max(32, 'Código muy largo')
  .regex(/^[A-Z0-9._-]+$/, 'Solo A-Z, 0-9, . _ -');

export const tituloSchema = z
  .string()
  .trim()
  .min(2, 'Título muy corto')
  .max(180, 'Título muy largo');

export const tiempoSchema = z
  .union([z.coerce.number().int().min(0), z.literal(''), z.null()])
  .transform((v) => (v === '' ? null : (v as number | null)));

export const moduloCreateSchema = z.object({
  codigo: codigoSchema,
  titulo: tituloSchema,
  descripcion: z.string().trim().max(2000).nullable().optional(),
  estado: estadoEnum.default('borrador'),
  dificultad: dificultadEnum.nullable().optional(),
  tiempo_estimado_min: tiempoSchema,
});

export const moduloUpdateSchema = moduloCreateSchema.partial().extend({
  // Para PATCH, todo es opcional, pero permitimos actualizar cualquiera
  // Si quieres obligar ciertos campos, quita .partial()
});

export const moduloIdParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});
