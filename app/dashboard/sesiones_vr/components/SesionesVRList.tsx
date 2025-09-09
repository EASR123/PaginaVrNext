'use client';

import { useEffect, useState } from "react";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/pagination";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

type SesionVR = {
  id: string;
  usuario: string;
  modulo: string;
  modelo: string;
  inicio: string;
  fin: string | null;
  resultado: string | null;
  tiempo_total_s: number | null;
  errores_totales: number | null;
  notas: string | null;
};

export default function SesionesVRList() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [sesiones, setSesiones] = useState<SesionVR[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetchSesiones = async () => {
    try {
      const res = await fetch(`/api/sesiones_vr?query=${query}&page=${page}`);
      const data = await res.json();
      if (data.ok) {
        setSesiones(data.sesiones);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSesiones();
  }, [query, page]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Listado de Sesiones VR</h2>

      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Search placeholder="Buscar módulo o usuario..." />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Usuario</th>
              <th className="px-3 py-2 text-left">Módulo</th>
              <th className="px-3 py-2 text-left">Modelo</th>
              <th className="px-3 py-2 text-left">Inicio</th>
              <th className="px-3 py-2 text-left">Fin</th>
              <th className="px-3 py-2 text-left">Resultado</th>
              <th className="px-3 py-2 text-left">Tiempo(s)</th>
              <th className="px-3 py-2 text-left">Errores</th>
              <th className="px-3 py-2 text-left">Notas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sesiones.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-4 text-center text-gray-500">
                  No se encontraron sesiones.
                </td>
              </tr>
            ) : (
              sesiones.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{s.usuario}</td>
                  <td className="px-3 py-2">{s.modulo}</td>
                  <td className="px-3 py-2">{s.modelo}</td>
                  <td className="px-3 py-2">{new Date(s.inicio).toLocaleString()}</td>
                  <td className="px-3 py-2">{s.fin ? new Date(s.fin).toLocaleString() : "-"}</td>
                  <td className="px-3 py-2">{s.resultado ?? "-"}</td>
                  <td className="px-3 py-2">{s.tiempo_total_s ?? "-"}</td>
                  <td className="px-3 py-2">{s.errores_totales ?? "-"}</td>
                  <td className="px-3 py-2">{s.notas ?? "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
