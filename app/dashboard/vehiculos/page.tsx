// app/dashboard/vehiculos/page.tsx
import NextAuth from 'next-auth';
//import { auth } from '@/auth';
import { fetchUserByEmail } from '@/app/lib/users';
import { fetchMarcas, fetchModelosVehiculo } from '@/app/lib/vehiculos';
import {
  createMarca, updateMarca, deleteMarca,
  createModelo, updateModelo, deleteModelo
} from './actions';
import { authConfig } from '@/auth.config';

export const { auth } = NextAuth(authConfig);

export const dynamic = 'force-dynamic';

export default async function VehiculosPage({
  searchParams,
}: {
  searchParams?: { ok?: string; err?: string };
}) {
  const session = await auth();
  if (!session?.user?.email) {
    return <main className="p-6"><Denied /></main>;
  }
  const me = await fetchUserByEmail(session.user.email);
  if (!me || me.rol !== 'instructor') {
    return <main className="p-6"><Denied /></main>;
  }

  const [marcas, modelos] = await Promise.all([fetchMarcas(), fetchModelosVehiculo()]);
  const ok = searchParams?.ok;
  const err = searchParams?.err;

  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Administración de Vehículos</h1>
        <p className="text-sm text-gray-500">CRUD de Marcas y Modelos (solo instructores).</p>
      </header>

      {/* Mensajes de estado */}
      {(ok || err) && (
        <div className={`rounded-md border px-3 py-2 text-sm ${ok ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'}`}>
          {ok ?? err}
        </div>
      )}

      {/* ========== Marcas ========== */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Marcas</h2>

        {/* Crear Marca */}
        <form action={createMarca} className="flex flex-wrap items-end gap-2 rounded-md border bg-white p-3">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
            <input
              name="nombre"
              placeholder="Ej: Toyota"
              className="w-full rounded-md border px-3 py-2 text-sm"
              required
            />
          </div>
          <button className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">Crear marca</button>
        </form>

        {/* Tabla Marcas */}
        <div className="overflow-x-auto rounded-md border bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Nombre</th>
                <th className="px-3 py-2 text-left font-semibold">Creado</th>
                <th className="px-3 py-2 text-left font-semibold">Actualizado</th>
                <th className="px-3 py-2 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {marcas.map((m) => (
                <tr key={m.id}>
                  <td className="px-3 py-2">
                    <form action={updateMarca} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={m.id} />
                      <input
                        name="nombre"
                        defaultValue={m.nombre}
                        className="w-full rounded-md border px-2 py-1"
                        required
                      />
                      <button className="rounded-md border px-2 py-1 hover:bg-gray-50">Guardar</button>
                    </form>
                  </td>
                  <td className="px-3 py-2">{new Date(m.creado_en).toLocaleString()}</td>
                  <td className="px-3 py-2">{new Date(m.actualizado_en).toLocaleString()}</td>
                  <td className="px-3 py-2 text-right">
                    <form action={deleteMarca} className="inline">
                      <input type="hidden" name="id" value={m.id} />
                      <button className="rounded-md border px-2 py-1 text-red-600 hover:bg-red-50">
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {marcas.length === 0 && (
                <tr><td className="px-3 py-4 text-center text-gray-500" colSpan={4}>No hay marcas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========== Modelos ========== */}
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Modelos</h2>

        {/* Crear Modelo */}
        <form action={createModelo} className="flex flex-wrap items-end gap-2 rounded-md border bg-white p-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Marca</label>
            <select name="marca_id" className="rounded-md border px-3 py-2 text-sm" required>
              <option value="">Seleccione…</option>
              {marcas.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Modelo</label>
            <input name="nombre" placeholder="Ej: Corolla" className="w-full rounded-md border px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Año desde</label>
            <input type="number" name="anio_desde" min={1886} className="w-32 rounded-md border px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Año hasta (opcional)</label>
            <input type="number" name="anio_hasta" min={1886} className="w-32 rounded-md border px-3 py-2 text-sm" />
          </div>
          <button className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700">Crear modelo</button>
        </form>

        {/* Tabla Modelos (editable por fila) */}
        <div className="overflow-x-auto rounded-md border bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Marca</th>
                <th className="px-3 py-2 text-left font-semibold">Modelo</th>
                <th className="px-3 py-2 text-left font-semibold">Año desde</th>
                <th className="px-3 py-2 text-left font-semibold">Año hasta</th>
                <th className="px-3 py-2 text-right font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {modelos.map((mv) => (
                <tr key={mv.id} className="align-middle">
                  <td className="px-3 py-2">
                    <form action={updateModelo} className="grid grid-cols-1 gap-2 sm:grid-cols-5 sm:items-center">
                      <input type="hidden" name="id" value={mv.id} />
                      {/* Marca */}
                      <select name="marca_id" defaultValue={mv.marca_id} className="rounded-md border px-2 py-1 sm:col-span-1">
                        {marcas.map((m) => (
                          <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                      </select>
                      {/* Nombre */}
                      <input
                        name="nombre"
                        defaultValue={mv.nombre}
                        className="rounded-md border px-2 py-1 sm:col-span-2"
                        required
                      />
                      {/* Años */}
                      <input
                        type="number"
                        name="anio_desde"
                        min={1886}
                        defaultValue={mv.anio_desde}
                        className="w-28 rounded-md border px-2 py-1 sm:col-span-1"
                        required
                      />
                      <input
                        type="number"
                        name="anio_hasta"
                        min={1886}
                        defaultValue={mv.anio_hasta ?? ''}
                        className="w-28 rounded-md border px-2 py-1 sm:col-span-1"
                      />
                      <div className="sm:col-span-5 flex justify-end gap-2">
                        <button className="rounded-md border px-2 py-1 hover:bg-gray-50">Guardar</button>
                      </div>
                    </form>
                  </td>
                  <td className="px-3 py-2">{/* vacío: los inputs de arriba ocupan fila */}</td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2 text-right">
                    <form action={deleteModelo} className="inline">
                      <input type="hidden" name="id" value={mv.id} />
                      <button className="rounded-md border px-2 py-1 text-red-600 hover:bg-red-50">Eliminar</button>
                    </form>
                  </td>
                </tr>
              ))}
              {modelos.length === 0 && (
                <tr><td className="px-3 py-4 text-center text-gray-500" colSpan={5}>No hay modelos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Denied() {
  return (
    <div className="rounded-lg border bg-white p-6 text-sm text-red-600">
      No autorizado.
    </div>
  );
}
