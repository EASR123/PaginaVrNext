// app/lib/users.ts
import sql from '@/app/lib/db';

export type DbUser = {
  id: string;
  correo: string;
  nombre_completo: string;
  hash_password: string;
  rol: 'instructor' | 'capacitado';
  activo: boolean;
  creado_en: string;
};

export async function fetchUserByEmail(email: string): Promise<DbUser | null> {
  const rows = await sql<DbUser[]>`
    SELECT id, correo, nombre_completo, rol, activo, creado_en
    FROM public.usuarios
    WHERE correo = ${email}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function fetchAllUsers(): Promise<DbUser[]> {
  return sql<DbUser[]>`
    SELECT id, correo, nombre_completo, rol, activo, creado_en
    FROM public.usuarios
    ORDER BY creado_en DESC
  `;
}
