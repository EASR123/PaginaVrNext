// app/dashboard/Report/page.tsx
// app/dashboard/Report/page.tsx
import ReportsTable from '@/app/dashboard/Report/table';
import sql from '@/app/lib/db';

export default function ReportPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Reportes de Usuarios y Sesiones VR</h1>
      <ReportsTable />
    </main>
  );
}
