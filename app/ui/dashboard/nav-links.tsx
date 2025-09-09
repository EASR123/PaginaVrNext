'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  TruckIcon,
  CubeIcon, // Customers
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

// Links base: Home, Invoices, Customers
const links = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  //{ name: 'Invoices', href: '/dashboard/invoices', icon: DocumentDuplicateIcon },
  //{ name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'usuarios', href: '/dashboard/users', icon: UserGroupIcon },
  { name: 'vehiculos', href: '/dashboard/vehiculos', icon: TruckIcon },
  { name: 'modulos', href: '/dashboard/modulos', icon: CubeIcon },
  { name: 'Reportes', href: '/dashboard/Report', icon: CubeIcon },
  { name: 'Sesiones VR', href: '/dashboard/sesiones_vr', icon: CubeIcon },

];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const active = pathname === link.href || pathname.startsWith(link.href + '/');
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3',
              active ? 'bg-sky-100 text-blue-600' : 'bg-gray-50 hover:bg-sky-100 hover:text-blue-600',
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
