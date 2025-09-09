import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-4">
      <div className="relative mx-auto flex w-full max-w-[450px] flex-col space-y-6 p-6">
        {/* Tarjeta principal con sombra y bordes elegantes */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl border border-gray-100">
          
          {/* Header con gradiente IMCRUZ */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-6">
              <div className="w-40 text-blue-600">
                <AcmeLogo />
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bienvenido de vuelta
              </h1>
              <p className="text-gray-600">
                Ingresa a tu cuenta IMCRUZ VR
              </p>
            </div>
          </div>

          {/* Login form */}
          <Suspense fallback={
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          }>
            <LoginForm />
          </Suspense>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">o</span>
            </div>
          </div>

          {/* Register (Técnico) */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">¿Eres técnico y no tienes cuenta?</p>
            <Link
              href="/login/register"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-400 px-4 py-3 text-sm font-semibold text-gray-900 hover:from-yellow-400 hover:to-yellow-300 transition-all hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              <span>Crear cuenta de Técnico</span>
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          {/* Footer de la tarjeta */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                ¿Necesitas ayuda?{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contactar soporte
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer externo */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 IMCRUZ VR Experience. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </main>
  );
}