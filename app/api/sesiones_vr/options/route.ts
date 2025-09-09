// app/api/sesiones_vr/options/route.ts
import { NextResponse } from "next/server";
import sql from "@/app/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Usuarios
    const usuarios = await sql<{ id: string; nombre: string }[]>`
      SELECT id, nombre_completo AS nombre
      FROM public.usuarios
      WHERE activo = true
      ORDER BY nombre_completo
    `;

    // Modulos
    const modulos = await sql<{ id: string; titulo: string }[]>`
      SELECT id, titulo
      FROM public.modulos
      WHERE estado = 'publicado'
      ORDER BY titulo
    `;

    // Modelos de vehículos
    const modelos = await sql<{ id: string; nombre: string; marca: string }[]>`
      SELECT m.id, m.nombre, ma.nombre AS marca
      FROM public.modelos_vehiculo m
      JOIN public.marcas ma ON ma.id = m.marca_id
      ORDER BY ma.nombre, m.nombre
    `;

    return NextResponse.json({ ok: true, usuarios, modulos, modelos });
  } catch (error: any) {
    console.error("Error OPTIONS sesiones_vr:", error);
    return NextResponse.json({ ok: false, error: error.message || "Error inesperado" }, { status: 500 });
  }
}
