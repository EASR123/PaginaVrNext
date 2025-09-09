'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AcmeLogo from '@/app/ui/acme-logo';
import { EyeIcon, EyeSlashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function RegisterTechnicianPage() {
  const router = useRouter();
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombreCompleto, email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErr(data?.error ?? 'No se pudo registrar.');
      } else {
        setMsg('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');
        setTimeout(() => router.push('/login?registered=1'), 1200);
      }
    } catch (e: any) {
      setErr(e?.message ?? 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-4">
      <div className="relative mx-auto w-full max-w-md">
        {/* Efecto de fondo decorativo */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-yellow-400/20 rounded-3xl blur-3xl"></div>
        
        <div className="relative rounded-3xl bg-white/95 backdrop-blur-sm p-8 shadow-2xl border border-white/20">
          
          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <div className="w-40 text-blue-600">
                <AcmeLogo />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Registro de <span className="text-blue-600">Técnico</span>
            </h1>
            <p className="text-gray-600">Crea tu cuenta en IMCRUZ VR</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Campo Nombre Completo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                placeholder="Juan Pérez García"
                required
                disabled={loading}
              />
            </div>

            {/* Campo Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tecnico@ejemplo.com"
                required
                disabled={loading}
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPass ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creando cuenta...
                </div>
              ) : (
                'Crear cuenta de Técnico'
              )}
            </button>

            {/* Mensajes de estado */}
            {msg && (
              <div className="rounded-xl bg-green-50 p-4 border border-green-200">
                <p className="text-sm text-green-700 text-center">{msg}</p>
              </div>
            )}
            
            {err && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-200">
                <p className="text-sm text-red-700 text-center">{err}</p>
              </div>
            )}

            {/* Enlace para login */}
            <div className="text-center text-sm text-gray-600">
              <p>¿Ya tienes cuenta?{' '}
                <Link 
                  href="/login" 
                  className="font-semibold text-blue-600 hover:text-blue-700 underline"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>

          {/* Botón volver */}
          <Link
            href="/login"
            className="group inline-flex items-center justify-center w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-blue-400 hover:text-blue-600"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Volver al inicio de sesión
          </Link>

          {/* Información de seguridad */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-xs text-blue-600">Registro seguro y encriptado</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2024 IMCRUZ VR Experience • Plataforma técnica
          </p>
        </div>
      </div>
    </main>
  );
}