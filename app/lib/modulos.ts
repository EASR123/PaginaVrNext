// app/lib/modulos.ts
import sql from '@/app/lib/db';

export type ModuloCatalogo = {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string | null;
  estado: string | null;
  dificultad: string | null;
  tiempo_estimado_min: number | null;
  creado_en: string | null;
  actualizado_en: string | null;
  creado_por_nombre: string | null;
  creado_por_correo: string | null;
  sesiones_count: number;
};

// Helper pequeño para construir el WHERE opcional
function whereFilter(q?: string) {
  if (!q) return sql``;
  const like = `%${q}%`;
  return sql`WHERE (m.codigo ILIKE ${like} OR u.nombre_completo ILIKE ${like} OR u.correo ILIKE ${like})`;
}

export async function fetchModulosCatalogoAll(q?: string): Promise<ModuloCatalogo[]> {
  const rows = await sql<ModuloCatalogo[]>`
    SELECT
      m.id,
      m.codigo,
      m.titulo,
      m.descripcion,
      m.estado::text AS estado,
      m.dificultad::text AS dificultad,
      m.tiempo_estimado_min,
      m.creado_en,
      m.actualizado_en,
      u.nombre_completo AS creado_por_nombre,
      u.correo AS creado_por_correo,
      COALESCE((
        SELECT COUNT(*)::int FROM public.sesiones_vr s WHERE s.modulo_id = m.id
      ), 0) AS sesiones_count
    FROM public.modulos m
    LEFT JOIN public.usuarios u ON u.id = m.creado_por
    ${whereFilter(q)}
    ORDER BY m.codigo ASC
  `;
  return rows;
}

export async function fetchModulosCatalogoForUser(userId: string, q?: string): Promise<ModuloCatalogo[]> {
  const rows = await sql<ModuloCatalogo[]>`
    SELECT DISTINCT ON (m.id)
      m.id,
      m.codigo,
      m.titulo,
      m.descripcion,
      m.estado::text AS estado,
      m.dificultad::text AS dificultad,
      m.tiempo_estimado_min,
      m.creado_en,
      m.actualizado_en,
      u.nombre_completo AS creado_por_nombre,
      u.correo AS creado_por_correo,
      COALESCE((
        SELECT COUNT(*)::int FROM public.sesiones_vr s WHERE s.modulo_id = m.id AND s.usuario_id = ${userId}
      ), 0) AS sesiones_count
    FROM public.sesiones_vr sv
    JOIN public.modulos m ON m.id = sv.modulo_id
    LEFT JOIN public.usuarios u ON u.id = m.creado_por
    WHERE sv.usuario_id = ${userId}
    ${q ? sql`AND (m.codigo ILIKE ${'%' + q + '%'} OR u.nombre_completo ILIKE ${'%' + q + '%'} OR u.correo ILIKE ${'%' + q + '%'})` : sql``}
    ORDER BY m.id, m.codigo ASC
  `;
  return rows;
}
