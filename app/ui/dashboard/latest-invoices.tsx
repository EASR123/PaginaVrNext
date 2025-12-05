import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { lusitana } from '@/app/ui/fonts';
import sql from '@/app/lib/db';

export default async function LatestUsers() {
  const users = await sql<{ id: string; name: string; email: string; rol: string }[]>`
    SELECT id, nombre_completo AS name, correo AS email, rol
    FROM public.usuarios
    ORDER BY creado_en DESC
    LIMIT 5
  `;

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Últimos Usuarios
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {users.map((u, i) => (
            <div
              key={u.id}
              className={clsx(
                'flex flex-row items-center justify-between py-4',
                { 'border-t': i !== 0 },
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold md:text-base">{u.name}</p>
                <p className="hidden text-sm text-gray-500 sm:block">{u.email}</p>
              </div>
              <p className="truncate text-sm text-gray-600 md:text-base">{u.rol}</p>
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
