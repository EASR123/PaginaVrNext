import { NextResponse } from "next/server";
import sql from "@/app/lib/db";

export const runtime = "nodejs";

// Tipos
type Feedback = {
  id: string;
  sesion_id: string;
  usuario_id: string;
  calificacion: number;
  comentarios: string | null;
  creado_en: string;
  usuario: string; // nombre completo del usuario
  modulo: string;  // título del módulo de la sesión
};

// POST: crear retroalimentación
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sesion_id, usuario_id, calificacion, comentarios } = body;

    if (!sesion_id || !usuario_id || !calificacion) {
      return NextResponse.json({ ok: false, error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const nuevaRetro = await sql<{ id: string }[]>`
      INSERT INTO public.retroalimentacion
        (sesion_id, usuario_id, calificacion, comentarios)
      VALUES
        (${sesion_id}, ${usuario_id}, ${calificacion}, ${comentarios ?? null})
      RETURNING id
    `;

    return NextResponse.json({ ok: true, id: nuevaRetro[0].id });
  } catch (error: any) {
    console.error("Error POST retroalimentacion:", error);
    return NextResponse.json({ ok: false, error: error.message || "Error inesperado" }, { status: 500 });
  }
}

// PUT: actualizar retroalimentación
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, calificacion, comentarios } = body;

    if (!id || !calificacion) {
      return NextResponse.json({ ok: false, error: "Faltan datos obligatorios" }, { status: 400 });
    }

    await sql`
      UPDATE public.retroalimentacion
      SET calificacion = ${calificacion},
          comentarios = ${comentarios ?? null}
      WHERE id = ${id}
    `;

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error PUT retroalimentacion:", error);
    return NextResponse.json({ ok: false, error: error.message || "Error inesperado" }, { status: 500 });
  }
}

// GET: obtener retroalimentación con búsqueda y paginación
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const perPage = 10;
    const offset = (page - 1) * perPage;

    const feedbacks = await sql<Feedback[]>`
      SELECT r.id, r.sesion_id, r.usuario_id, r.calificacion, r.comentarios, r.creado_en,
             u.nombre_completo AS usuario,
             m.titulo AS modulo
      FROM public.retroalimentacion r
      JOIN public.usuarios u ON u.id = r.usuario_id
      JOIN public.sesiones_vr s ON s.id = r.sesion_id
      JOIN public.modulos m ON m.id = s.modulo_id
      WHERE u.nombre_completo ILIKE ${'%' + query + '%'} OR m.titulo ILIKE ${'%' + query + '%'}
      ORDER BY r.creado_en DESC
      LIMIT ${perPage} OFFSET ${offset}
    `;

    // Total para paginación
    const totalCountResult = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM public.retroalimentacion r
      JOIN public.usuarios u ON u.id = r.usuario_id
      JOIN public.sesiones_vr s ON s.id = r.sesion_id
      JOIN public.modulos m ON m.id = s.modulo_id
      WHERE u.nombre_completo ILIKE ${'%' + query + '%'} OR m.titulo ILIKE ${'%' + query + '%'}
    `;
    const totalPages = Math.ceil(totalCountResult[0].count / perPage);

    return NextResponse.json({ ok: true, feedbacks, totalPages });
  } catch (error: any) {
    console.error("Error GET retroalimentacion:", error);
    return NextResponse.json({ ok: false, error: error.message || "Error inesperado" }, { status: 500 });
  }
}
