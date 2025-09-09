// app/api/reports/route.ts
import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';

export async function GET() {
  const result = await sql`
    SELECT 
      u.id AS user_id,
      u.nombre_completo,
      u.correo,
      u.rol,
      u.activo,
      s.id AS session_id,
      s.proveedor,
      s.token,
      s.ip,
      s.user_agent,
      s.creado_en AS session_created_at,
      s.expira_en AS session_expires_at,
      sv.id AS vr_session_id,
      sv.inicio AS vr_start_time,
      sv.fin AS vr_end_time,
      sv.resultado AS vr_result,
      sv.tiempo_total_s AS vr_duration,
      sv.errores_totales AS vr_errors
    FROM 
      public.usuarios u
    JOIN 
      public.sesiones s ON s.usuario_id = u.id
    JOIN 
      public.sesiones_vr sv ON sv.usuario_id = u.id
    ORDER BY 
      sv.inicio DESC;
  `;

  return NextResponse.json(result);
}