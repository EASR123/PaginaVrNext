// app/api/health/route.ts
import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [{ now }] = await sql`select now()`;
    const [{ version }] = await sql`select version()`;
    const [{ db }] = await sql`select current_database() as db`;
    const [{ usr }] = await sql`select current_user as usr`;
    const [{ sch }] = await sql`select current_schema as sch`;
    const [{ usuarios_exists }] = await sql`
      select (to_regclass('public.usuarios') is not null) as usuarios_exists
    `;

    return NextResponse.json({
      ok: true,
      now,
      version,
      db,
      user: usr,
      schema: sch,
      usuarios_exists,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
