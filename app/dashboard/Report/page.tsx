// app/dashboard/Report/page.tsx
// app/dashboard/Report/page.tsx
import { auth } from '@/auth';
import { fetchUserByEmail } from '@/app/lib/users';
import ReportsTable from '@/app/dashboard/Report/table';

export const dynamic = 'force-dynamic';

export default async function ReportPage() {
  const session = await auth();
  if (!session?.user?.email) {
    return (
      <main className="p-6">
        <Denied />
      </main>
    );
  }

  const me = await fetchUserByEmail(session.user.email);
  if (!me || me.rol !== 'instructor') {
    return (
      <main className="p-6">
        <Denied />
      </main>
    );
  }

  return (
    <main className="p-6 space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Reportes de Usuarios y Sesiones VR</h1>
        <p className="text-sm text-gray-500">Acceso exclusivo para instructores.</p>
      </header>

      <ReportsTable />
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
