// app/dashboard/retroalimentacion/RetroalimentacionList.tsx
'use client';

import { useEffect, useState } from 'react';
import RetroalimentacionRow from './RetroalimentacionRow';
import RetroalimentacionToolbar from './RetroalimentacionToolbar';
import * as ExcelJS from 'exceljs';

interface Feedback {
  id: string;
  usuario: string;
  modulo: string;
  calificacion: number;
  comentarios: string | null;
  creado_en: string;
}

export default function RetroalimentacionList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    const res = await fetch(`/api/retroalimentacion?query=${search}&page=${page}`);
    const json = await res.json();
    if (json.ok) {
      setFeedbacks(json.feedbacks);
      setTotalPages(json.totalPages);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [search, page]);

  async function exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Retroalimentación');

    sheet.columns = [
      { header: 'Usuario', key: 'usuario', width: 25 },
      { header: 'Módulo', key: 'modulo', width: 25 },
      { header: 'Calificación', key: 'calificacion', width: 15 },
      { header: 'Comentario', key: 'comentarios', width: 40 },
      { header: 'Fecha', key: 'creado_en', width: 20 },
    ];

    feedbacks.forEach((f) => {
      sheet.addRow({
        usuario: f.usuario,
        modulo: f.modulo,
        calificacion: f.calificacion,
        comentarios: f.comentarios || '',
        creado_en: new Date(f.creado_en).toLocaleString(),
      });
    });

    // 📌 Generar buffer y descargar con API nativa
    const buf = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buf], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'retroalimentacion.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-4">
      {/* Buscador y botones */}
      <RetroalimentacionToolbar
        search={search}
        setSearch={setSearch}
        onExport={exportToExcel}
      />

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="w-full table-auto border-collapse bg-white text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Módulo</th>
              <th className="px-4 py-2">Calificación</th>
              <th className="px-4 py-2">Comentario</th>
              <th className="px-4 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  Cargando...
                </td>
              </tr>
            ) : feedbacks.length > 0 ? (
              feedbacks.map((f) => (
                <RetroalimentacionRow key={f.id} feedback={f} />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No se encontraron resultados
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
