// app/dashboard/(overview)/modulos/page.tsx
import { fetchModulos } from '@/app/lib/imcruz';
export const dynamic = 'force-dynamic';

export default async function ModulosPage() {
  const mods = await fetchModulos();

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Módulos</h1>
      <div className="grid gap-3">
        {mods.map((m) => (
          <a
            key={m.id}
            href={`/dashboard/(overview)/modulos/${m.codigo}`}
            className="block rounded-xl border p-4 hover:shadow"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{m.codigo}</span>
              <span className="text-sm opacity-70">{m.estado ?? '-'}</span>
            </div>
            <div className="mt-1">{m.titulo}</div>
            <div className="text-sm opacity-70">Dificultad: {m.dificultad ?? '-'}</div>
          </a>
        ))}
      </div>
    </main>
  );
}
