// app/api/sesiones/[id]/route.ts
import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
  usuario_id?: string;
  proveedor?: string;
  token?: string;
  ip?: string;
  user_agent?: string;
  expira_en?: string; // ISO string o null
};

// CREAR SESIÓN
export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const { usuario_id, proveedor, token, ip, user_agent, expira_en } = body;

    if (!usuario_id || !proveedor || !token) {
      return NextResponse.json({ ok: false, error: 'Faltan datos obligatorios (usuario_id, proveedor o token).' }, { status: 400 });
    }

    const rows = await sql<any[]>`
      INSERT INTO public.sesiones
        (usuario_id, proveedor, token, ip, user_agent, expira_en)
      VALUES
        (${usuario_id}, ${proveedor}, ${token}, ${ip ?? null}, ${user_agent ?? null}, ${expira_en ?? null})
      RETURNING *
    `;

    return NextResponse.json({ ok: true, sesion: rows[0] }, { status: 201 });
  } catch (e: any) {
    console.error('Error POST sesiones:', e);
    return NextResponse.json({ ok: false, error: e.message || 'Error inesperado' }, { status: 500 });
  }
}

// OBTENER SESIÓN(s)
export async function GET(req: Request, { params }: { params?: { id?: string } }) {
  try {
    const { id } = params || {};

    if (id) {
      // GET por ID
      const rows = await sql<any[]>`
        SELECT *
        FROM public.sesiones
        WHERE id = ${id}
        LIMIT 1
      `;
      if (!rows.length) {
        return NextResponse.json({ ok: false, error: 'Sesión no encontrada.' }, { status: 404 });
      }
      return NextResponse.json({ ok: true, sesion: rows[0] }, { status: 200 });
    } else {
      // GET todas las sesiones
      const rows = await sql<any[]>`
        SELECT *
        FROM public.sesiones
        ORDER BY creado_en DESC
      `;
      return NextResponse.json({ ok: true, sesiones: rows }, { status: 200 });
    }
  } catch (e: any) {
    console.error('Error GET sesiones:', e);
    return NextResponse.json({ ok: false, error: e.message || 'Error inesperado' }, { status: 500 });
  }
}
