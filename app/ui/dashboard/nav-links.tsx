'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserGroupIcon,
  TruckIcon,
  CubeIcon,
  ChartBarIcon,
  ComputerDesktopIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

type Props = {
  role?: 'instructor' | 'capacitado';
};

const allLinks = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon, roles: ['instructor', 'capacitado'] },
  { name: 'Vehículos', href: '/dashboard/vehiculos', icon: TruckIcon, roles: ['instructor', 'capacitado'] },
  { name: 'Usuarios', href: '/dashboard/users', icon: UserGroupIcon, roles: ['instructor'] },
  { name: 'Módulos', href: '/dashboard/modulos', icon: CubeIcon, roles: ['instructor'] },
  { name: 'Reportes', href: '/dashboard/Report', icon: ChartBarIcon, roles: ['instructor'] },
  { name: 'Sesiones VR', href: '/dashboard/sesiones_vr', icon: ComputerDesktopIcon, roles: ['instructor'] },
  { name: 'Retroalimentación', href: '/dashboard/retroalimentacion', icon: ChatBubbleOvalLeftEllipsisIcon, roles: ['instructor'] },
];

export default function NavLinks({ role }: Props) {
  const pathname = usePathname();

  return (
    <>
      {allLinks
        .filter((link) => !role || link.roles.includes(role))
        .map((link) => {
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
