import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 bg-gradient-to-br from-blue-50 to-yellow-50">
      {/* Header con gradiente azul IMCRUZ */}
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-4 md:h-52">
        <AcmeLogo />
      </div>
      
      {/* Main Content */}
      <div className="mt-8 flex grow flex-col gap-8 md:flex-row">
        {/* Text Content */}
        <div className="flex flex-col justify-center gap-8 rounded-lg px-6 py-10 md:w-2/5 md:px-20">
          <div className="space-y-6">
            <h1 className={`text-4xl font-bold text-gray-900 md:text-5xl ${lusitana.className}`}>
              Bienvenidos a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500">
                IMCRUZ VR
              </span>
            </h1>
            
            <p className="text-lg text-gray-700 md:text-xl">
              Descubre experiencias inmersivas de realidad virtual que transformarán tu percepción del mundo digital.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/login"
                className="group flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg md:text-base hover:scale-105"
              >
                <span>Iniciar sesión</span>
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <a
                href="https://www.imcruz.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-yellow-400 hover:shadow-lg md:text-base hover:scale-105"
              >
                <span>Visitar IMCRUZ</span>
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p>Una experiencia traída por{' '}
              <a href="https://www.imcruz.com/" className="font-semibold text-blue-600 hover:text-blue-700">
                IMCRUZ
              </a>
            </p>
            <p className="text-xs text-gray-500">Impulsado por Vercel</p>
          </div>
        </div>

        {/* Image Content */}
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-3xl blur-lg opacity-30"></div>
            
            <Image 
              src="/coche.jpg" 
              width={1000} 
              height={760} 
              className="hidden md:block rounded-2xl shadow-2xl relative z-10 border-4 border-white"
              alt="Experiencia de realidad virtual IMCRUZ"
              priority
            />
            <Image
              src="/coche.jpg"
              width={560}
              height={620}
              className="block md:hidden rounded-2xl shadow-xl relative z-10 border-4 border-white"
              alt="Experiencia de realidad virtual IMCRUZ"
              priority
            />
            
            {/* Badge decorativo con colores IMCRUZ */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg z-20">
              ¡Nuevo!
            </div>
          </div>
        </div>
      </div>

      {/* Footer decorativo */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-2 shadow-sm">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Colores oficiales IMCRUZ</span>
        </div>
      </div>
    </main>
  );
}