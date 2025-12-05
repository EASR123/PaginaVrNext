'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProfileAction, type ActionResult } from './actions';

interface Props {
  user: { nombre_completo: string; correo: string };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? 'Guardando...' : 'Guardar cambios'}
    </button>
  );
}

export default function ProfileForm({ user }: Props) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    updateProfileAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre completo</label>
        <input
          name="nombre_completo"
          defaultValue={user.nombre_completo}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Correo</label>
        <input
          type="email"
          name="correo"
          defaultValue={user.correo}
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <hr className="my-4" />
      <h3 className="text-sm font-semibold text-gray-700">Cambio de contraseña</h3>

      <div>
        <label className="block text-sm font-medium mb-1">Contraseña actual</label>
        <input
          type="password"
          name="password_actual"
          placeholder="Ingresa tu contraseña actual"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nueva contraseña</label>
        <input
          type="password"
          name="password_nueva"
          placeholder="Nueva contraseña"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Confirmar nueva contraseña</label>
        <input
          type="password"
          name="password_confirmacion"
          placeholder="Repite la nueva contraseña"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <SubmitButton />

      {state?.message && (
        <p
          className={`text-sm mt-2 ${
            state.ok ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
