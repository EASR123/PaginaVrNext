// app/dashboard/sesiones/page.tsx
import { auth } from '@/auth';
import { fetchUserByEmail } from '@/app/lib/users';
import SesionesVRList from './components/SesionesVRList';
import SesionesVRForm from './components/SesionesVRForm';
import MisSesiones from './table';

export const dynamic = 'force-dynamic';

export default async function SesionesPage() {
  const session = await auth();
  if (!session?.user?.email) {
    return (
      <main className="p-6">
        <Denied />
      </main>
    );
  }

  const me = await fetchUserByEmail(session.user.email);
  if (!me) {
    return (
      <main className="p-6">
        <Denied />
      </main>
    );
  }

  // Vista para INSTRUCTOR
  if (me.rol === 'instructor') {
    return (
      <main className="p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-700">Sesiones VR</h1>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Formulario para crear sesión */}
          <div className="md:w-1/3">
            <SesionesVRForm />
          </div>

          {/* Tabla/listado de sesiones */}
          <div className="md:w-2/3">
            <SesionesVRList />
          </div>
        </div>
      </main>
    );
  }

  // Vista para CAPACITADO
  if (me.rol === 'capacitado') {
    return (
      <main className="p-6 space-y-4">
        <header>
          <h1 className="text-2xl font-semibold">Mis Sesiones VR</h1>
          <p className="text-sm text-gray-500">
            Aquí puedes ver las sesiones de entrenamiento que tienes asignadas.
          </p>
        </header>

        <MisSesiones />
      </main>
    );
  }

  return (
    <main className="p-6">
      <Denied />
    </main>
  );
}

function Denied() {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="rounded-lg border bg-white p-6 text-sm text-red-600"
    >
      No autorizado.
    </div>
  );
}
//sesiones