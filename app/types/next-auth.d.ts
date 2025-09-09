// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface User {
    rol?: string;
  }
  
  interface Session {
    user: {
      rol?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    rol?: string;
  }
}