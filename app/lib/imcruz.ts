// app/lib/imcruz.ts
import sql from './db';

export type ModuloLite = {
  id: string;
  codigo: string;
  titulo: string;
  estado: string | null;
  dificultad: string | null;
};

export async function fetchModulos(): Promise<ModuloLite[]> {
  return sql/*sql*/`
    select id, codigo, titulo, estado, dificultad
    from modulos
    order by codigo asc
  `;
}

export type PasoDetalle = {
  numero: number;
  paso_id: string;
  paso_titulo: string;
  instruccion: string;
  accion_esperada: any | null;
  tiempo_esperado_s: number | null;
  critico: boolean;
};

export async function fetchModuloDetalle(codigo: string) {
  const modulo = await sql/*sql*/`
    select id, codigo, titulo, descripcion, estado, dificultad
    from modulos
    where codigo = ${codigo}
    limit 1
  `;
  if (!modulo[0]) return null;

  const pasos: PasoDetalle[] = await sql/*sql*/`
    select numero, paso_id, paso_titulo, instruccion, accion_esperada, tiempo_esperado_s, critico
    from vw_modulo_con_pasos
    where codigo = ${codigo}
    order by numero asc
  `;
  return { modulo: modulo[0], pasos };
}
