// app/dashboard/modulos/page.tsx
import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { fetchUserByEmail } from '@/app/lib/users';
import { fetchModulosCatalogo, ModuloCatalogo } from '@/app/lib/modulos';
import Link from 'next/link';

export const { auth } = NextAuth(authConfig);
export const dynamic = 'force-dynamic';

type SPObj = Record<string, string | string[] | undefined>;
type SP = Promise<SPObj> | SPObj | undefined;

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize">
      {children}
    </span>
  );
}

function Minutes({ v }: { v: number | null }) {
  if (v == null) return <span className="text-gray-500">—</span>;
  return <span>{v} min</span>;
}

export default async function ModulosCatalogoPage({
  searchParams,
}: { searchParams?: SP }) {
  // Normaliza searchParams (Next 15 puede pasarlos como Promise)
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

  // Requiere sesión
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

  // (opcional) cargar usuario si necesitas rol
  const me = await fetchUserByEmail(session.user.email);
  const isInstructor = me?.rol === 'instructor';

  const rows = await fetchModulosCatalogo(q);

  return (
    <main className="p-6 space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Módulos</h1>
          <p className="text-sm text-gray-500">
            Explora los módulos disponibles. Haz clic para ver el detalle.
          </p>
        </div>

        {/* Buscador simple GET */}
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
      </header>

      {/* Grid de tarjetas */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((m: ModuloCatalogo) => (
          <Link
            key={m.id}
            href={`/dashboard/modulos/${m.id}`}  // Asegúrate de que la ruta incluye correctamente "overview"
            className="group rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-gray-600">{m.codigo}</span>
              <div className="flex items-center gap-2">
                <Chip>{m.estado ?? '—'}</Chip>
                {m.dificultad && <Chip>{m.dificultad}</Chip>}
              </div>
            </div>

            <h3 className="line-clamp-1 text-base font-semibold">{m.titulo}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {m.descripcion ?? 'Sin descripción.'}
            </p>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>{m.creado_por_nombre ?? m.creado_por_correo ?? '—'}</span>
              <Minutes v={m.tiempo_estimado_min} />
            </div>

            <div className="mt-3 text-right">
              <span className="text-blue-600 text-sm group-hover:underline">
                Ver detalle →
              </span>
            </div>
          </Link>
        ))}

        {rows.length === 0 && (
          <div className="col-span-full rounded-lg border bg-white p-8 text-center text-gray-500">
            No hay módulos para mostrar.
          </div>
        )}
      </section>

      {/* Zona para acciones rápidas solo para instructores */}
      {isInstructor && (
        <div className="rounded-lg border bg-white p-4 text-sm text-gray-600">
          Zona de acciones (futuro CRUD): aquí puedes agregar botones para crear/editar.
        </div>
      )}
    </main>
  );
}
