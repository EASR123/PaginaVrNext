// app/api/sesiones_vr/route.ts
import { NextResponse } from "next/server";
import sql from "@/app/lib/db";

export const runtime = "nodejs";

type Body = {
  usuario_id: string;
  modulo_id: string;
  modelo_vehiculo_id: string;
  inicio?: string;       // opcional, si no se envía se usa now()
  fin?: string;
  resultado?: string;
  tiempo_total_s?: number;
  errores_totales?: number;
  notas?: string;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const { usuario_id, modulo_id, modelo_vehiculo_id, inicio, fin, resultado, tiempo_total_s, errores_totales, notas } = body;

    if (!usuario_id || !modulo_id || !modelo_vehiculo_id) {
      return NextResponse.json({ ok: false, error: "Faltan IDs requeridos" }, { status: 400 });
    }

    const nuevaSesion = await sql<{ id: string }[]>`
      INSERT INTO public.sesiones_vr
        (usuario_id, modulo_id, modelo_vehiculo_id, inicio, fin, resultado, tiempo_total_s, errores_totales, notas)
      VALUES
        (${usuario_id}, ${modulo_id}, ${modelo_vehiculo_id}, ${inicio ?? new Date().toISOString()}, ${fin ?? null}, ${resultado ?? null}, ${tiempo_total_s ?? null}, ${errores_totales ?? null}, ${notas ?? null})
      RETURNING id
    `;

    return NextResponse.json({ ok: true, id: nuevaSesion[0].id });
  } catch (error: any) {
    console.error("Error POST sesiones_vr:", error);
    return NextResponse.json({ ok: false, error: error.message || "Error inesperado" }, { status: 500 });
  }
}
export async function GET() {
  try {
    const sesiones = await sql`
      SELECT s.id, s.usuario_id, u.nombre_completo AS usuario,
             s.modulo_id, m.titulo AS modulo,
             s.modelo_vehiculo_id, mv.nombre AS modelo,
             s.inicio, s.fin, s.resultado,
             s.tiempo_total_s, s.errores_totales, s.notas
      FROM public.sesiones_vr s
      JOIN public.usuarios u ON u.id = s.usuario_id
      JOIN public.modulos m ON m.id = s.modulo_id
      JOIN public.modelos_vehiculo mv ON mv.id = s.modelo_vehiculo_id
      ORDER BY s.inicio DESC
    `;

    return NextResponse.json({ ok: true, sesiones });
  } catch (error: any) {
    console.error("Error GET sesiones_vr:", error);
    return NextResponse.json({ ok: false, error: error.message || "Error inesperado" }, { status: 500 });
  }
}
