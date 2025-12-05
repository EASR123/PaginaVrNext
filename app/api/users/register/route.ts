  import { NextResponse } from 'next/server';
  import bcrypt from 'bcrypt';
  import sql from '@/app/lib/db';

  export const runtime = 'nodejs';
  export const dynamic = 'force-dynamic';

  type Body = {
    email?: string;
    password?: string;
    nombreCompleto?: string;
  };  

  export async function POST(req: Request) {
    try {
      const body: Body = await req.json();
      const email = (body.email ?? '').trim().toLowerCase();
      const password = body.password ?? '';
      const nombre = (body.nombreCompleto ?? '').trim();

      if (!email || !password || !nombre) {
        return NextResponse.json({ ok: false, error: 'Falta nombre, email o contraseña.' }, { status: 400 });
      }
      if (password.length < 6) {
        return NextResponse.json({ ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
      }

      // ¿Ya existe?
      const exists = await sql/*sql*/`select 1 from usuarios where correo = ${email} limit 1`;
      if (exists.length) {
        return NextResponse.json({ ok: false, error: 'El email ya está registrado.' }, { status: 409 });
      }

      const hash = await bcrypt.hash(password, 12);

      // rol: 'capacitado' = Técnico (sin tocar el enum)
      const rows = await sql/*sql*/`
      insert into usuarios (correo, nombre_completo, hash_password, rol, activo)
      values (${email}, ${nombre}, ${hash}, 'capacitado', false)
      returning id, correo, nombre_completo, rol, activo, creado_en
    `;

      return NextResponse.json({ ok: true, user: rows[0] }, { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ ok: false, error: e?.message ?? 'Error inesperado' }, { status: 500 });
    }
  }
