
// app/ui/sidebar.tsx
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon, UserGroupIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { signOut, auth } from '@/auth';

export default async function SideNav() {
  // Server Component: podemos leer la sesión aquí
  const session = await auth();
  const userName = session?.user?.name ?? 'Usuario';
  const role = (session as any)?.role as 'instructor' | 'capacitado' | undefined;

  return (
    <aside className="flex h-full flex-col gap-3 px-3 py-4 md:px-2">
      {}
      <Link
        className="mb-1 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>

      {}
      <nav className="flex flex-col gap-2">
        <NavLinks />

        {}
        {role === 'instructor' && (
          <Link
            href="/dashboard/users"
            className="flex h-[44px] w-full items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
          >
            <UserGroupIcon className="h-5 w-5" />
            <span>Usuarios</span>
          </Link>
        )}
         {role === 'instructor' && (
          <Link
            href="/dashboard/modulos"
            className="flex h-[44px] w-full items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
          >
            <UserGroupIcon className="h-5 w-5" />
            <span>modulos</span>
          </Link>
        )}
      </nav>

      {}
      <div className="mt-auto">
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <div className="flex items-center justify-between rounded-md bg-gray-50 p-2">
            <div className="flex min-w-0 items-center gap-2">
              <UserCircleIcon className="h-6 w-6 text-gray-600" />
              <span className="truncate text-sm font-medium">{userName}</span>
              {role && (
                <span className="hidden text-xs text-gray-500 capitalize md:inline">
                  ({role})
                </span>
              )}
            </div>

            <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-sky-100 hover:text-blue-600">
              <PowerIcon className="h-5 w-5" />
              <span className="hidden md:inline">Cerrar Sesion</span>
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}

// app/ui/sidenav.tsx
// app/ui/sidenav.tsx
// app/ui/sidenav.tsx
// app/ui/sidenav.tsx
// app/ui/sidenav.tsx
// app/ui/dashboard/sidenav-temp.tsx
// app/ui/dashboard/sidenav.tsx
