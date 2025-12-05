// app/dashboard/modulos/catalogo/loading.tsx
export default function Loading() {
  return (
    <main className="p-6">
      <div className="animate-pulse space-y-3">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl border bg-white p-4">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="mt-2 h-5 w-56 rounded bg-gray-200" />
              <div className="mt-2 h-4 w-48 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
