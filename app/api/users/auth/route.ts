// app/api/users/auth/route.ts
import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';
import bcrypt from 'bcrypt';

export const runtime = 'nodejs';

type Body = {
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    const email = (body.email ?? '').trim().toLowerCase();
    const password = body.password ?? '';

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Falta email o contraseña.' }, { status: 400 });
    }

    // Consultamos al usuario con su correo
    const rows = await sql<any[]>`
      SELECT id, correo AS email, nombre_completo AS name, hash_password AS password, rol
      FROM public.usuarios
      WHERE correo = ${email}
      LIMIT 1
    `;

    if (!rows.length) {
      return NextResponse.json({ ok: false, error: 'Usuario no encontrado.' }, { status: 404 });
    }

    const user = rows[0];

    // VERIFICAR CONTRASEÑA con bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json({ ok: false, error: 'Contraseña incorrecta.' }, { status: 401 });
    }

    // Devolvemos el usuario (sin el password por seguridad)
    return NextResponse.json({
      ok: true,
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        rol: user.rol 
      },
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error en API auth:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || 'Error inesperado' 
    }, { status: 500 });
  }
}

// El método GET permanece igual
export async function GET(req: Request) {
  try {
    const rows = await sql<any[]>`
      SELECT id, correo AS email, nombre_completo AS name, rol, creado_en
      FROM public.usuarios
      ORDER BY creado_en DESC
    `;
    return NextResponse.json({ ok: true, usuarios: rows }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Error inesperado' }, { status: 500 });
  }
}