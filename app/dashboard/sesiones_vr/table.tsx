'use client';

import { useEffect, useState } from "react";

interface Sesion {
  sesion_id: string;
  inicio: string;
  fin: string | null;
  resultado: string | null;
  tiempo_total_s: number | null;
  errores_totales: number | null;
  modulo_titulo: string;
  modulo_descripcion: string;
  dificultad: string | null;
  tiempo_estimado_min: number | null;
  marca: string;
  modelo: string;
  anio_desde: number;
  anio_hasta: number | null;
}

export default function MisSesiones() {
  const [data, setData] = useState<Sesion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSesiones() {
      const res = await fetch("/api/sesiones/mis");
      const json = await res.json();
      if (json.ok) setData(json.sesiones);
      setLoading(false);
    }
    fetchSesiones();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm p-4">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Módulo</th>
            <th className="px-4 py-2 text-left font-semibold">Vehículo</th>
            <th className="px-4 py-2 text-left font-semibold">Inicio</th>
            <th className="px-4 py-2 text-left font-semibold">Fin</th>
            <th className="px-4 py-2 text-left font-semibold">Resultado</th>
            <th className="px-4 py-2 text-left font-semibold">Duración (s)</th>
            <th className="px-4 py-2 text-left font-semibold">Errores</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((s) => (
              <tr key={s.sesion_id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="font-medium">{s.modulo_titulo}</div>
                  <div className="text-xs text-gray-500">{s.modulo_descripcion}</div>
                  <div className="text-xs text-gray-400">
                    Dificultad: {s.dificultad ?? "—"} | Estimado: {s.tiempo_estimado_min ?? "—"} min
                  </div>
                </td>
                <td className="px-4 py-2 text-sm">
                  {s.marca} {s.modelo} ({s.anio_desde} - {s.anio_hasta ?? "Actual"})
                </td>
                <td className="px-4 py-2">{new Date(s.inicio).toLocaleString()}</td>
                <td className="px-4 py-2">
                  {s.fin ? new Date(s.fin).toLocaleString() : "En curso"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                      s.resultado === "completado"
                        ? "bg-green-100 text-green-700"
                        : s.resultado === "abortado"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {s.resultado ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-2">{s.tiempo_total_s ?? "—"}</td>
                <td className="px-4 py-2">{s.errores_totales ?? 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500">
                No tienes sesiones asignadas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
