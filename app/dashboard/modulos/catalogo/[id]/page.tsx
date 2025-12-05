'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Modulo {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  estado: string;
  dificultad: string | null;
  tiempo_estimado_min: number | null;
  creado_por_nombre: string | null;
  creado_por_correo: string | null;
  creado_en: string;
  actualizado_en: string;
}

interface Paso {
  numero: number;
  titulo: string;
  instruccion: string;
  tiempo_esperado_s: number | null;
  critico: boolean;
}

interface Pieza {
  codigo: string;
  nombre: string;
  descripcion: string;
  cantidad: string;
  unidad: string;
}

interface Modelo {
  nombre: string;
  marca: string;
  anio_desde: number;
  anio_hasta: number | null;
}

export default function ModuloDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [modulo, setModulo] = useState<Modulo | null>(null);
  const [pasos, setPasos] = useState<Paso[]>([]);
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/modulos/${id}`);
      const json = await res.json();
      if (json.ok) {
        setModulo(json.modulo);
        setPasos(json.pasos);
        setPiezas(json.piezas);
        setModelos(json.modelos);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!modulo) return <div className="p-6 text-red-600">Módulo no encontrado</div>;

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <div className="font-mono text-xs text-gray-600">{modulo.codigo}</div>
          <h1 className="text-2xl font-bold">{modulo.titulo}</h1>
          <p className="text-gray-600">{modulo.descripcion ?? 'Sin descripción.'}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          ← Volver
        </button>
      </header>

      <section className="grid gap-4 rounded-lg border bg-white p-4 md:grid-cols-3">
        <div><b>Estado:</b> {modulo.estado}</div>
        <div><b>Dificultad:</b> {modulo.dificultad ?? '—'}</div>
        <div><b>Tiempo estimado:</b> {modulo.tiempo_estimado_min ?? '—'} min</div>
        <div><b>Creado por:</b> {modulo.creado_por_nombre ?? modulo.creado_por_correo}</div>
        <div><b>Creado en:</b> {new Date(modulo.creado_en).toLocaleString()}</div>
        <div><b>Actualizado:</b> {new Date(modulo.actualizado_en).toLocaleString()}</div>
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold">Pasos</h2>
        <ul className="mt-2 list-decimal list-inside space-y-1">
          {pasos.map((p) => (
            <li key={p.numero}>
              <b>{p.titulo}</b> — {p.instruccion} ({p.tiempo_esperado_s ?? '—'}s)
              {p.critico && <span className="ml-2 text-red-600 text-xs">(Crítico)</span>}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold">Piezas requeridas</h2>
        <table className="w-full mt-2 text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Código</th>
              <th className="text-left py-1">Nombre</th>
              <th className="text-left py-1">Cantidad</th>
              <th className="text-left py-1">Unidad</th>
            </tr>
          </thead>
          <tbody>
            {piezas.map((p) => (
              <tr key={p.codigo}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.cantidad}</td>
                <td>{p.unidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="font-semibold">Modelos de vehículo</h2>
        <ul className="mt-2 space-y-1">
          {modelos.map((m, i) => (
            <li key={i}>
              {m.marca} {m.nombre} ({m.anio_desde}–{m.anio_hasta ?? 'Actual'})
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
