import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

// Conexión a tu base de datos PostgreSQL
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: 'Faltan credenciales.' },
        { status: 400 }
      );
    }

    console.log('🎮 [Unity] Autenticando usuario:', email);

    const result = await sql`
      SELECT 
        id,
        correo,
        nombre_completo,
        hash_password,
        rol,
        activo
      FROM usuarios
      WHERE correo = ${email}
      LIMIT 1
    `;

    const user = result[0];

    if (!user) {
      return NextResponse.json({ ok: false, message: 'Usuario no encontrado.' }, { status: 404 });
    }

    if (!user.activo) {
      return NextResponse.json({ ok: false, message: 'Usuario inactivo.' }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, user.hash_password);
    if (!valid) {
      return NextResponse.json({ ok: false, message: 'Contraseña incorrecta.' }, { status: 401 });
    }

    // Éxito
    console.log('✅ [Unity] Login correcto:', user.correo);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.correo,
        nombre_completo: user.nombre_completo,
        rol: user.rol,
        activo: user.activo
      }
    });
  } catch (error) {
    console.error('💥 Error en /api/unity/login:', error);
    return NextResponse.json({ ok: false, message: 'Error interno.' }, { status: 500 });
  }
}
