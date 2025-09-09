// app/dashboard/modulos/catalogo/search-box.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function SearchBox() {
  const router = useRouter();
  const sp = useSearchParams();
  const q0 = sp.get('q') ?? '';
  const [value, setValue] = useState(q0);
  const [debounced] = useDebounce(value, 300);

  useEffect(() => {
    // Si el valor cambia (debounced), actualizamos la URL
    const params = new URLSearchParams(sp.toString());
    if (debounced) {
      params.set('q', debounced);
    } else {
      params.delete('q');
    }
    router.replace(`/dashboard/modulos/catalogo?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const clear = () => setValue('');

  return (
    <div className="relative w-full max-w-xl">
      <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar por código o creador…"
        className="w-full rounded-md border border-gray-300 pl-10 pr-9 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-100"
          aria-label="Limpiar búsqueda"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
