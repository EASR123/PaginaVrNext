import { auth } from '@/auth';
import { fetchAllUsers, fetchUserByEmail } from '@/app/lib/users';
import RoleForm from './RoleForm';
import ActiveForm from './ActiveForm';
import ProfileForm from './ProfileForm';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
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

  if (!isInstructor) {
    // Vista de perfil (capacitado)
    return (
      <main className="p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Mi perfil</h1>
          <p className="text-sm text-gray-500">Información personal</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="mb-2">
              <span className="font-medium">Nombre: </span>{me.nombre_completo}
            </div>
            <div className="mb-2">
              <span className="font-medium">Correo: </span>{me.correo}
            </div>
            <div className="mb-2">
              <span className="font-medium">Rol: </span>
              <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs capitalize">
                {me.rol}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-medium">Estado: </span>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                  me.activo ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {me.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>
        {/* Formulario edición */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Editar información</h2>
          <ProfileForm user={me} />
        </section>
      </main>
    );
  }

  // Vista administración (instructor)
  const users = await fetchAllUsers();

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Usuarios</h1>
          <p className="text-sm text-gray-500">Gestiona roles y estado de usuarios.</p>
        </div>
        <ProfileForm user={me} /> {/* Botón editar perfil para instructor */}
      </header>

      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold">Correo</th>
              <th className="px-4 py-3 text-left font-semibold">Rol</th>
              <th className="px-4 py-3 text-left font-semibold">Estado</th>
              <th className="px-4 py-3 text-right font-semibold">ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="align-middle">
                <td className="px-4 py-3">{u.nombre_completo}</td>
                <td className="px-4 py-3">{u.correo}</td>
                <td className="px-4 py-3">
                  <RoleForm userId={u.id} currentRole={u.rol} />
                </td>
                <td className="px-4 py-3">
                    <ActiveForm user={u} />
                </td>
                <td className="px-4 py-3 text-right text-[11px] text-gray-500">
                  {u.id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
