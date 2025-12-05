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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  // Cargar opciones
  useEffect(() => {
    fetch("/api/sesiones_vr/options")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setUsuarios(data.usuarios);
          setModulos(data.modulos);
          setModelos(data.modelos);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!usuarioId || !moduloId || !modeloId || !resultado) {
      setMessage({ ok: false, text: "Debes seleccionar usuario, módulo, modelo y resultado." });
      return;
    }

    setLoading(true);

    try {
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
        setMessage({ ok: true, text: "Sesión VR creada correctamente ✅" });
        setUsuarioId("");
        setModuloId("");
        setModeloId("");
        setResultado("");
        setNotas("");
      } else {
        setMessage({ ok: false, text: "Error: " + data.error });
      }
    } catch (err: any) {
      setMessage({ ok: false, text: "Error en la red: " + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold">Crear Sesión VR</h2>

      <select
        value={usuarioId}
        onChange={(e) => setUsuarioId(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">Seleccionar Usuario</option>
        {usuarios.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nombre}
          </option>
        ))}
      </select>

      <select
        value={moduloId}
        onChange={(e) => setModuloId(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">Seleccionar Módulo</option>
        {modulos.map((m) => (
          <option key={m.id} value={m.id}>
            {m.titulo}
          </option>
        ))}
      </select>

      <select
        value={modeloId}
        onChange={(e) => setModeloId(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">Seleccionar Modelo de Vehículo</option>
        {modelos.map((m) => (
          <option key={m.id} value={m.id}>
            {m.marca} - {m.nombre}
          </option>
        ))}
      </select>

      <select
        value={resultado}
        onChange={(e) => setResultado(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">Seleccionar Resultado</option>
        <option value="completado">Completado</option>
        <option value="abortado">Abortado</option>
      </select>

      <textarea
        placeholder="Notas adicionales"
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        className="border rounded p-2"
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creando..." : "Crear Sesión"}
      </button>

      {message && (
        <p className={`text-sm mt-2 ${message.ok ? "text-green-600" : "text-red-600"}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
