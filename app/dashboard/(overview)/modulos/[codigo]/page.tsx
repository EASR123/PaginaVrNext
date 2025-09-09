// app/dashboard/(overview)/modulos/[codigo]/page.tsx
import { fetchModuloDetalle } from '@/app/lib/imcruz';
import { notFound } from 'next/navigation';
export const dynamic = 'force-dynamic';

export default async function ModuloDetallePage({ params }: { params: { codigo: string } }) {
  const data = await fetchModuloDetalle(params.codigo);
  if (!data) return notFound();

  const { modulo, pasos } = data;

  return (
    <main className="p-6 space-y-6">
      <div>
        <a href="/dashboard/(overview)/modulos" className="text-sm underline opacity-70">
          ← Volver a módulos
        </a>
      </div>

      <section className="space-y-1">
        <h1 className="text-2xl font-bold">{modulo.codigo} — {modulo.titulo}</h1>
        <p className="opacity-80">{modulo.descripcion ?? 'Sin descripción'}</p>
        <div className="text-sm opacity-70">
          Estado: {modulo.estado ?? '-'} | Dificultad: {modulo.dificultad ?? '-'}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Pasos</h2>
        <ol className="space-y-2">
          {pasos.map((p) => (
            <li key={p.paso_id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">#{p.numero} — {p.paso_titulo}</span>
                {p.critico && <span className="text-xs rounded px-2 py-0.5 border">CRÍTICO</span>}
              </div>
              <p className="text-sm">{p.instruccion}</p>
              <div className="text-xs opacity-70 mt-2">
                Tiempo esperado: {p.tiempo_esperado_s ?? '—'} s
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
