// app/lib/vehiculos.ts
import sql from '@/app/lib/db';

export type Marca = {
  id: string;
  nombre: string;
  creado_en: string;
  actualizado_en: string;
};

export type ModeloVehiculoRow = {
  id: string;
  marca_id: string;
  marca_nombre: string;
  nombre: string;
  anio_desde: number;
  anio_hasta: number | null;
  creado_en: string;
  actualizado_en: string;
};

export async function fetchMarcas(): Promise<Marca[]> {
  return sql<Marca[]>`
    SELECT id, nombre, creado_en, actualizado_en
    FROM public.marcas
    ORDER BY nombre ASC
  `;
}

export async function fetchModelosVehiculo(): Promise<ModeloVehiculoRow[]> {
  return sql<ModeloVehiculoRow[]>`
    SELECT
      mv.id,
      mv.marca_id,
      m.nombre AS marca_nombre,
      mv.nombre,
      mv.anio_desde,
      mv.anio_hasta,
      mv.creado_en,
      mv.actualizado_en
    FROM public.modelos_vehiculo mv
    JOIN public.marcas m ON m.id = mv.marca_id
    ORDER BY m.nombre ASC, mv.nombre ASC, mv.anio_desde ASC
  `;
}
