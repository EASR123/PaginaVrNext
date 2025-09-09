"use client";

import { useState, useEffect } from "react";

type Usuario = { id: string; nombre: string };
type Modulo = { id: string; titulo: string };
type Modelo = { id: string; nombre: string; marca: string };

export default function SesionesVRForm() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);

  const [usuarioId, setUsuarioId] = useState("");
  const [moduloId, setModuloId] = useState("");
  const [modeloId, setModeloId] = useState("");
  const [resultado, setResultado] = useState("");
  const [notas, setNotas] = useState("");

  useEffect(() => {
    fetch("/api/sesiones_vr/options")
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setUsuarios(data.usuarios);
          setModulos(data.modulos);
          setModelos(data.modelos);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId || !moduloId || !modeloId) {
      alert("Debes seleccionar usuario, módulo y modelo.");
      return;
    }

    const res = await fetch("/api/sesiones_vr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_id: usuarioId,
        modulo_id: moduloId,
        modelo_vehiculo_id: modeloId,
        resultado,
        notas,
      }),
    });

    const data = await res.json();
    if (data.ok) {
      alert("Sesión VR creada correctamente!");
      setUsuarioId("");
      setModuloId("");
      setModeloId("");
      setResultado("");
      setNotas("");
    } else {
      alert("Error: " + data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold">Crear Sesión VR</h2>

      <select
        value={usuarioId}
        onChange={e => setUsuarioId(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">Seleccionar Usuario</option>
        {usuarios.map(u => (
          <option key={u.id} value={u.id}>{u.nombre}</option>
        ))}
      </select>

      <select
        value={moduloId}
        onChange={e => setModuloId(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">Seleccionar Módulo</option>
        {modulos.map(m => (
          <option key={m.id} value={m.id}>{m.titulo}</option>
        ))}
      </select>

      <select
        value={modeloId}
        onChange={e => setModeloId(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">Seleccionar Modelo de Vehículo</option>
        {modelos.map(m => (
          <option key={m.id} value={m.id}>{m.marca} - {m.nombre}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Resultado (completado/abortado)"
        value={resultado}
        onChange={e => setResultado(e.target.value)}
        className="border rounded p-2"
      />

      <textarea
        placeholder="Notas adicionales"
        value={notas}
        onChange={e => setNotas(e.target.value)}
        className="border rounded p-2"
      />

      <button className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700">
        Crear Sesión
      </button>
    </form>
  );
}
