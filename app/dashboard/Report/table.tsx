// app/dashboard/Report/table.tsx
'use client';

import { useState, useEffect } from 'react';

interface ReportData {
  user_id: string;
  nombre_completo: string;
  correo: string;
  rol: string;
  activo: boolean;
  session_id: string;
  proveedor: string;
  token: string;
  ip: string;
  user_agent: string;
  session_created_at: string;
  session_expires_at: string;
  vr_session_id: string;
  vr_start_time: string;
  vr_end_time: string;
  vr_result: string;
  vr_duration: number;
  vr_errors: number;
}

export default function ReportsTable() {
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/reports');
      const result = await res.json();
      setData(result);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm p-4">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Usuario</th>
            <th className="px-4 py-3 text-left font-semibold">Correo</th>
            <th className="px-4 py-3 text-left font-semibold">Rol</th>
            <th className="px-4 py-3 text-left font-semibold">Estado</th>
            <th className="px-4 py-3 text-left font-semibold">Sesion ID</th>
            <th className="px-4 py-3 text-left font-semibold">Proveedor</th>
            <th className="px-4 py-3 text-left font-semibold">Token</th>
            <th className="px-4 py-3 text-left font-semibold">Fecha Inicio VR</th>
            <th className="px-4 py-3 text-left font-semibold">Resultado VR</th>
            <th className="px-4 py-3 text-left font-semibold">Duración VR (s)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.vr_session_id}>
                <td className="px-4 py-3">{row.nombre_completo}</td>
                <td className="px-4 py-3">{row.correo}</td>
                <td className="px-4 py-3">{row.rol}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs capitalize ${
                      row.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {row.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">{row.session_id}</td>
                <td className="px-4 py-3">{row.proveedor}</td>
                <td className="px-4 py-3">{row.token}</td>
                <td className="px-4 py-3">{new Date(row.vr_start_time).toLocaleString()}</td>
                <td className="px-4 py-3">{row.vr_result}</td>
                <td className="px-4 py-3">{row.vr_duration}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center py-4 text-gray-500">
                No se encontraron reportes.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
