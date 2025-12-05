// app/lib/modulos.ts
import sql from '@/app/lib/db';

export type ModuloCatalogo = {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string | null;
  estado: 'borrador' | 'activo' | 'inactivo' | null;
  dificultad: 'facil' | 'medio' | 'dificil' | null;
  tiempo_estimado_min: number | null;
  creado_por: string | null;
  creado_por_nombre: string | null;
  creado_por_correo: string | null;
  creado_en: string;
  actualizado_en: string;
};

export async function fetchModulosCatalogoAll(q = ''): Promise<ModuloCatalogo[]> {
  const like = `%${q}%`.toLowerCase();
  const rows = await sql<ModuloCatalogo[]>/*sql*/`
    SELECT
      m.id, m.codigo, m.titulo, m.descripcion, m.estado, m.dificultad, m.tiempo_estimado_min,
      m.creado_por, u.nombre AS creado_por_nombre, u.correo AS creado_por_correo,
      m.creado_en, m.actualizado_en
    FROM public.modulos m
    LEFT JOIN public.usuarios u ON u.id = m.creado_por
    WHERE ${q === ''} OR (
      lower(m.codigo) LIKE ${like}
      OR lower(m.titulo) LIKE ${like}
      OR lower(coalesce(u.nombre, '')) LIKE ${like}
      OR lower(coalesce(u.correo, '')) LIKE ${like}
    )
    ORDER BY m.codigo ASC
  `;
  return rows;
}

export async function fetchModulosCatalogoForUser(userId: string, q = ''): Promise<ModuloCatalogo[]> {
  // Ajusta este JOIN si tu relación user↔sesiones↔módulos es distinta.
  const like = `%${q}%`.toLowerCase();
  const rows = await sql<ModuloCatalogo[]>/*sql*/`
    SELECT
      m.id, m.codigo, m.titulo, m.descripcion, m.estado, m.dificultad, m.tiempo_estimado_min,
      m.creado_por, u.nombre AS creado_por_nombre, u.correo AS creado_por_correo,
      m.creado_en, m.actualizado_en
    FROM public.modulos m
    LEFT JOIN public.usuarios u ON u.id = m.creado_por
    WHERE EXISTS (
      SELECT 1
      FROM public.sesiones s
      WHERE s.modulo_id = m.id AND s.usuario_id = ${userId}
    )
    AND (
      ${q === ''} OR
      lower(m.codigo) LIKE ${like}
      OR lower(m.titulo) LIKE ${like}
      OR lower(coalesce(u.nombre, '')) LIKE ${like}
      OR lower(coalesce(u.correo, '')) LIKE ${like}
    )
    ORDER BY m.codigo ASC
  `;
  return rows;
}
export async function fetchModuloById(id: string): Promise<ModuloCatalogo | null> {
  const rows = await sql<ModuloCatalogo[]>/*sql*/`
    SELECT
      m.id, m.codigo, m.titulo, m.descripcion, m.estado, m.dificultad, m.tiempo_estimado_min,
      m.creado_por, u.nombre AS creado_por_nombre, u.correo AS creado_por_correo,
      m.creado_en, m.actualizado_en
    FROM public.modulos m
    LEFT JOIN public.usuarios u ON u.id = m.creado_por
    WHERE m.id = ${id}
    LIMIT 1
  `;
  return rows[0] ?? null;
}
export async function fetchModulosCatalogo(q: string = ''): Promise<ModuloCatalogo[]> {
  const like = `%${q}%`.toLowerCase();
  const rows = await sql<ModuloCatalogo[]>/*sql*/`
    SELECT m.*,
           u.nombre AS creado_por_nombre,
           u.correo AS creado_por_correo
    FROM public.modulos m
    LEFT JOIN public.usuarios u ON u.id = m.creado_por
    WHERE ${q === ''} OR (
      lower(m.codigo) LIKE ${like}
      OR lower(m.titulo) LIKE ${like}
      OR lower(coalesce(u.nombre, '')) LIKE ${like}
      OR lower(coalesce(u.correo, '')) LIKE ${like}
    )
    ORDER BY m.codigo ASC
  `;
  return rows;
}

