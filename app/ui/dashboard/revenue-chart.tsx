import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import sql from '@/app/lib/db';

export default async function LatestSessions() {
  const sesiones = await sql<{
    id: string;
    usuario: string;
    modulo: string;
    inicio: string;
    resultado: string | null;
  }[]>`
    SELECT s.id, u.nombre_completo AS usuario, m.titulo AS modulo, s.inicio, s.resultado
    FROM public.sesiones_vr s
    JOIN public.usuarios u ON u.id = s.usuario_id
    JOIN public.modulos m ON m.id = s.modulo_id
    ORDER BY s.inicio DESC
    LIMIT 5
  `;

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Últimas Sesiones VR
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {sesiones.map((s, i) => (
            <div
              key={s.id}
              className={clsx(
                'flex flex-row items-center justify-between py-4',
                { 'border-t': i !== 0 },
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold md:text-base">{s.usuario}</p>
                <p className="hidden text-sm text-gray-500 sm:block">{s.modulo}</p>
              </div>
              <p className="truncate text-sm text-gray-600 md:text-base">
                {s.resultado ?? 'Pendiente'}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Actualizado ahora mismo</h3>
        </div>
      </div>
    </div>
  );
}
