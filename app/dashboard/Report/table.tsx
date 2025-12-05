'use client';

import { useEffect, useState } from 'react';
import * as ExcelJS from 'exceljs';

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
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchData() {
    setLoading(true);
    const res = await fetch(`/api/reports?query=${query}&page=${page}`);
    const json = await res.json();
    if (json.ok) {
      setData(json.data);
      setTotalPages(json.totalPages);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [query, page]);

  async function exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reportes');

    sheet.columns = [
      { header: 'Usuario', key: 'nombre_completo', width: 25 },
      { header: 'Correo', key: 'correo', width: 30 },
      { header: 'Rol', key: 'rol', width: 15 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Sesion ID', key: 'session_id', width: 30 },
      { header: 'Proveedor', key: 'proveedor', width: 20 },
      { header: 'Token', key: 'token', width: 40 },
      { header: 'Inicio VR', key: 'vr_start_time', width: 20 },
      { header: 'Fin VR', key: 'vr_end_time', width: 20 },
      { header: 'Resultado VR', key: 'vr_result', width: 15 },
      { header: 'Duración (s)', key: 'vr_duration', width: 15 },
      { header: 'Errores', key: 'vr_errors', width: 10 },
    ];

    data.forEach((row) => {
      sheet.addRow({
        ...row,
        estado: row.activo ? 'Activo' : 'Inactivo',
        vr_start_time: new Date(row.vr_start_time).toLocaleString(),
        vr_end_time: row.vr_end_time ? new Date(row.vr_end_time).toLocaleString() : '',
      });
    });

    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reportes.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-4">
      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre, correo o resultado..."
          value={query}
          onChange={(e) => {
            setPage(1);
            setQuery(e.target.value);
          }}
          className="w-full sm:w-1/3 rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={exportToExcel}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          Exportar Excel
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Usuario</th>
              <th className="px-4 py-3 text-left font-semibold">Correo</th>
              <th className="px-4 py-3 text-left font-semibold">Rol</th>
              <th className="px-4 py-3 text-left font-semibold">Estado</th>
              <th className="px-4 py-3 text-left font-semibold">Proveedor</th>
              <th className="px-4 py-3 text-left font-semibold">Inicio VR</th>
              <th className="px-4 py-3 text-left font-semibold">Fin VR</th>
              <th className="px-4 py-3 text-left font-semibold">Resultado VR</th>
              <th className="px-4 py-3 text-left font-semibold">Duración (s)</th>
              <th className="px-4 py-3 text-left font-semibold">Errores</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-6 text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row) => (
                <tr key={row.vr_session_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{row.nombre_completo}</td>
                  <td className="px-4 py-3">{row.correo}</td>
                  <td className="px-4 py-3 capitalize">{row.rol}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                        row.activo
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {row.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{row.proveedor}</td>
                  <td className="px-4 py-3">{new Date(row.vr_start_time).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {row.vr_end_time ? new Date(row.vr_end_time).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3">{row.vr_result}</td>
                  <td className="px-4 py-3">{row.vr_duration}</td>
                  <td className="px-4 py-3">{row.vr_errors}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-6 text-gray-400">
                  No se encontraron reportes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-2 py-1 text-sm">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
