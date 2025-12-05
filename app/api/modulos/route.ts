// app/api/modulos/route.ts
import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';

// GET: lista de módulos con búsqueda
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') ?? '';

  const rows = await sql/*sql*/`
    SELECT m.id, m.codigo, m.titulo, m.descripcion,
           m.estado, m.dificultad, m.tiempo_estimado_min,
           m.creado_en, m.actualizado_en,
           u.nombre_completo AS creado_por_nombre, u.correo AS creado_por_correo
    FROM public.modulos m
    LEFT JOIN public.usuarios u ON u.id = m.creado_por
    WHERE m.codigo ILIKE ${'%' + q + '%'} 
       OR m.titulo ILIKE ${'%' + q + '%'} 
       OR u.nombre_completo ILIKE ${'%' + q + '%'}
    ORDER BY m.creado_en DESC
  `;

  return NextResponse.json({ ok: true, modulos: rows });
}

// POST: crear nuevo módulo
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { codigo, titulo, descripcion, estado, dificultad, tiempo_estimado_min, creado_por } = body;

    const nuevo = await sql/*sql*/`
      INSERT INTO public.modulos (codigo, titulo, descripcion, estado, dificultad, tiempo_estimado_min, creado_por)
      VALUES (${codigo}, ${titulo}, ${descripcion}, ${estado}, ${dificultad}, ${tiempo_estimado_min}, ${creado_por})
      RETURNING id
    `;

    return NextResponse.json({ ok: true, id: nuevo[0].id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
