'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateUserRoleAction, type ActionResult } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      disabled={pending}
    >
      {pending ? 'Guardando...' : 'Guardar'}
    </button>
  );
}

export default function RoleForm({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: 'instructor' | 'capacitado';
}) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    updateUserRoleAction,
    null,
  );

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        className="rounded-md border px-2 py-1 text-sm"
      >
        <option value="instructor">instructor</option>
        <option value="capacitado">capacitado</option>
      </select>
      <SubmitButton />
      <div
        aria-live="polite"
        aria-atomic="true"
        className="min-w-[120px] text-xs"
      >
        {state?.message && (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 ${
              state.ok
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
