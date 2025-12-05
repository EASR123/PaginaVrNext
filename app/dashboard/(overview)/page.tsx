import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { CardsSkeleton } from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';
// Si quieres sesiones o usuarios recientes, importa tu nuevo componente:
// import LatestUsers from '@/app/ui/dashboard/latest-users';
// import LatestSessions from '@/app/ui/dashboard/latest-sessions';

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Panel de informacion 
      </h1>

      {/* Tarjetas principales */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>

      {/* Aquí puedes elegir qué mostrar: últimas sesiones o últimos usuarios */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <Suspense fallback={<LatestUsersSkeleton />}>
          <LatestUsers />
        </Suspense> */}

        {/* <Suspense fallback={<LatestSessionsSkeleton />}>
          <LatestSessions />
        </Suspense> */}
      </div>
    </main>
  );
}
