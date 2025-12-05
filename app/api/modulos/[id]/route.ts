// app/api/modulos/[id]/route.ts
import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';

// GET detalle con relaciones
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  // Datos del módulo
  const modulo = await sql/*sql*/`
    SELECT m.*, u.nombre_completo AS creado_por_nombre, u.correo AS creado_por_correo
    FROM public.modulos m
    LEFT JOIN public.usuarios u ON u.id = m.creado_por
    WHERE m.id = ${id}
    LIMIT 1
  `;

  if (modulo.length === 0) {
    return NextResponse.json({ ok: false, error: 'Módulo no encontrado' }, { status: 404 });
  }

  // Pasos del módulo
  const pasos = await sql/*sql*/`
    SELECT mp.numero, p.titulo, p.instruccion, 
           COALESCE(mp.accion_esperada, p.accion_esperada) AS accion_esperada,
           mp.tiempo_esperado_s, mp.critico
    FROM public.modulos_pasos mp
    JOIN public.pasos p ON p.id = mp.paso_id
    WHERE mp.modulo_id = ${id}
    ORDER BY mp.numero
  `;

  // Piezas del módulo
  const piezas = await sql/*sql*/`
    SELECT mp.cantidad, mp.unidad, p.codigo, p.nombre, p.descripcion
    FROM public.modulos_piezas mp
    JOIN public.piezas p ON p.id = mp.pieza_id
    WHERE mp.modulo_id = ${id}
  `;

  // Modelos de vehículo del módulo
  const modelos = await sql/*sql*/`
    SELECT mo.nombre, mo.anio_desde, mo.anio_hasta, ma.nombre AS marca
    FROM public.modulos_modelos mm
    JOIN public.modelos_vehiculo mo ON mo.id = mm.modelo_id
    JOIN public.marcas ma ON ma.id = mo.marca_id
    WHERE mm.modulo_id = ${id}
  `;

  return NextResponse.json({ ok: true, modulo: modulo[0], pasos, piezas, modelos });
}

// PUT: actualizar
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    const { codigo, titulo, descripcion, estado, dificultad, tiempo_estimado_min } = body;

    await sql/*sql*/`
      UPDATE public.modulos
      SET codigo = ${codigo},
          titulo = ${titulo},
          descripcion = ${descripcion},
          estado = ${estado},
          dificultad = ${dificultad},
          tiempo_estimado_min = ${tiempo_estimado_min},
          actualizado_en = now()
      WHERE id = ${id}
    `;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    await sql/*sql*/`DELETE FROM public.modulos WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
