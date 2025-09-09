// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request }) {
      // ⚠️ No interceptar Server Actions ni métodos != GET
      if (request.method !== 'GET' || request.headers.get('next-action')) {
        return true;
      }

      const nextUrl = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) return isLoggedIn;
      if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
      return true;
    },
  },
  providers: [], // los providers los defines en auth.ts
} satisfies NextAuthConfig;
