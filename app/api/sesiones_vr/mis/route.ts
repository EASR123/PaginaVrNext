import { NextResponse } from "next/server";
import sql from "@/app/lib/db";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "No autenticado" }, { status: 401 });
  }

  // Buscar usuario
  const [me] = await sql/*sql*/`
    SELECT id, rol FROM public.usuarios WHERE correo = ${session.user.email} LIMIT 1
  `;

  if (!me) return NextResponse.json({ ok: false, error: "Usuario no encontrado" }, { status: 404 });
  if (me.rol !== "capacitado") {
    return NextResponse.json({ ok: false, error: "Solo capacitados" }, { status: 403 });
  }

  const sesiones = await sql/*sql*/`
    SELECT 
      sv.id AS sesion_id,
      sv.inicio,
      sv.fin,
      sv.resultado,
      sv.tiempo_total_s,
      sv.errores_totales,
      m.titulo AS modulo_titulo,
      m.descripcion AS modulo_descripcion,
      m.dificultad,
      m.tiempo_estimado_min,
      ma.nombre AS marca,
      mo.nombre AS modelo,
      mo.anio_desde,
      mo.anio_hasta
    FROM public.sesiones_vr sv
    JOIN public.modulos m ON m.id = sv.modulo_id
    JOIN public.modelos_vehiculo mo ON mo.id = sv.modelo_vehiculo_id
    JOIN public.marcas ma ON ma.id = mo.marca_id
    WHERE sv.usuario_id = ${me.id}
    ORDER BY sv.inicio DESC
  `;

  return NextResponse.json({ ok: true, sesiones });
}
