// ActiveForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { toggleActiveAction, type ActionResult } from './actions';
import type { Usuarios } from '@/app/lib/definitions';

function SubmitButton({ label, labelPending }: { label: string; labelPending: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors
        ${pending ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}
      `}
      disabled={pending}
    >
      {pending ? labelPending : label}
    </button>
  );
}

interface ActiveFormProps {
  user: Usuarios; // <-- recibe el usuario completo
}

export default function ActiveForm({ user }: ActiveFormProps) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    toggleActiveAction,
    null,
  );

  return (
    <form
      action={formAction}
      className="flex flex-col sm:flex-row items-center gap-3 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <input type="hidden" name="userId" value={user.id} />
      <input type="hidden" name="active" value={(!user.activo).toString()} />

      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold transition-colors
          ${user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        `}
      >
        {user.activo ? 'Activo' : 'Inactivo'}
      </span>

      <SubmitButton
        label={user.activo ? 'Desactivar' : 'Activar'}
        labelPending={user.activo ? 'Desactivando...' : 'Activando...'}
      />

      {state?.message && (
        <div className="mt-2 sm:mt-0 sm:ml-4 min-w-[160px] text-sm">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 font-medium transition-colors
              ${state.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            `}
          >
            {state.message}
          </span>
        </div>
      )}
    </form>
  );
}
