// app/dashboard/modulos/catalogo/page.tsx
import { auth } from '@/auth';
import { fetchUserByEmail } from '@/app/lib/users';
import {
  fetchModulosCatalogoAll,
  fetchModulosCatalogoForUser,
  ModuloCatalogo,
} from '@/app/lib/modulos';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function fmtDate(d?: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleString();
}

function CreatedByCell({ creado_por_nombre, creado_por_correo }: ModuloCatalogo) {
  if (!creado_por_nombre && !creado_por_correo) {
    return <span className="text-gray-500">—</span>;
  }
  return (
    <div className="leading-tight">
      <div className="font-medium">{creado_por_nombre ?? '—'}</div>
      <div className="text-xs text-gray-500">{creado_por_correo ?? '—'}</div>
    </div>
  );
}

/**
 * NOTA Next 15:
 * `searchParams` puede venir como Promise. Hay que await antes de leer .q
 */
type SPObj = Record<string, string | string[] | undefined>;
type SP = Promise<SPObj> | SPObj | undefined;

export default async function CatalogoModulosPage({
  searchParams,
}: {
  searchParams?: SP;
}) {
  // --- Normaliza searchParams (await si es promesa) y extrae `q` de forma segura
  let q = '';
  if (searchParams) {
    const sp: SPObj =
      typeof (searchParams as any)?.then === 'function'
        ? await (searchParams as Promise<SPObj>)
        : ((searchParams as SPObj) ?? {});

    const raw = sp.q;
    if (typeof raw === 'string') q = raw.trim();
    else if (Array.isArray(raw)) q = (raw[0] ?? '').trim();
  }

  const session = await auth();
  if (!session?.user?.email) {
    return (
      <main className="p-6">
        <div className="rounded-lg border bg-white p-6 text-sm text-red-600">
          No autorizado.
        </div>
      </main>
    );
  }

  const me = await fetchUserByEmail(session.user.email);
  if (!me) {
    return (
      <main className="p-6">
        <div className="rounded-lg border bg-white p-6 text-sm text-red-600">
          Usuario no encontrado.
        </div>
      </main>
    );
  }

  const isInstructor = me.rol === 'instructor';
  const rows = isInstructor
    ? await fetchModulosCatalogoAll(q)
    : await fetchModulosCatalogoForUser(me.id, q);

  return (
    <main className="p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Catálogo de Módulos</h1>
          <p className="text-sm text-gray-500">
            {isInstructor
              ? 'Listado completo de módulos.'
              : 'Módulos en los que tienes sesiones.'}
          </p>
        </div>

        {/* Buscador simple por código/título/creador */}
        <form className="flex items-center gap-2" action="/dashboard/modulos/catalogo" method="GET">
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por código, título o creador…"
            className="w-64 rounded-md border px-3 py-2 text-sm"
          />
          <button className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
            Buscar
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Código</th>
              <th className="px-4 py-3 text-left font-semibold">Título</th>
              <th className="px-4 py-3 text-left font-semibold">Descripción</th>
              <th className="px-4 py-3 text-left font-semibold">Estado</th>
              <th className="px-4 py-3 text-left font-semibold">Dificultad</th>
              <th className="px-4 py-3 text-left font-semibold">Tiempo (min)</th>
              <th className="px-4 py-3 text-left font-semibold">Creado por</th>
              <th className="px-4 py-3 text-left font-semibold">Creado en</th>
              <th className="px-4 py-3 text-left font-semibold">Actualizado</th>
              <th className="px-4 py-3 text-right font-semibold">Sesiones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3 font-mono text-xs">{m.codigo}</td>
                <td className="px-4 py-3">{m.titulo}</td>
                <td className="max-w-[360px] truncate px-4 py-3" title={m.descripcion ?? ''}>
                  {m.descripcion ?? '—'}
                </td>
                <td className="px-4 py-3 capitalize">
                  <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                    {m.estado ?? '—'}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize">{m.dificultad ?? '—'}</td>
                <td className="px-4 py-3">{m.tiempo_estimado_min ?? '—'}</td>
                <td className="px-4 py-3">
                  <CreatedByCell {...m} />
                </td>
                <td className="whitespace-nowrap px-4 py-3">{fmtDate(m.creado_en)}</td>
                <td className="whitespace-nowrap px-4 py-3">{fmtDate(m.actualizado_en)}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/dashboard/sesiones?modulo_id=${m.id}`}
                    className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    Ver sesiones
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-gray-500">
                  Sin módulos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
