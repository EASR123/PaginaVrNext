// app/dashboard/retroalimentacion/page.tsx
import { auth } from '@/auth';
import { fetchUserByEmail } from '@/app/lib/users';
import RetroalimentacionList from './RetroalimentacionList';

export const dynamic = 'force-dynamic';

export default async function RetroalimentacionPage() {
  const session = await auth();
  if (!session?.user?.email) {
    return <Denied />;
  }

  const me = await fetchUserByEmail(session.user.email);
  if (!me || me.rol !== 'instructor') {
    return <Denied />;
  }

  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Retroalimentación</h1>
        <p className="text-sm text-gray-500">
          Listado de comentarios, calificaciones y métricas de los usuarios.
        </p>
      </header>

      <RetroalimentacionList />
    </main>
  );
}

function Denied() {
  return (
    <main className="p-6">
      <div
        role="alert"
        aria-live="polite"
        className="rounded-lg border bg-white p-6 text-sm text-red-600"
      >
        No autorizado.
      </div>
    </main>
  );
}
