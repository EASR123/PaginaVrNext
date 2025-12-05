// app/dashboard/retroalimentacion/RetroalimentacionToolbar.tsx
'use client';

interface Props {
  search: string;
  setSearch: (v: string) => void;
  onExport: () => void;
}

export default function RetroalimentacionToolbar({ search, setSearch, onExport }: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3">
      <input
        type="text"
        placeholder="Buscar por usuario o módulo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-1/3 rounded-md border px-3 py-2 text-sm"
      />
      <button
        onClick={onExport}
        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        Descargar Excel
      </button>
    </div>
  );
}
