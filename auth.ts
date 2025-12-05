
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string) {
  try {
    console.log('🔍 Buscando usuario con email:', email);
    
    //  CONSULTA SIMPLE Y CORRECTA
    const users = await sql`
      SELECT 
        id,
        correo,
        nombre_completo,
        hash_password,
        rol,
        activo
      FROM usuarios 
      WHERE correo = ${email}
      LIMIT 1
    `;
    
    const user = users[0];
    console.log(' Usuario encontrado:', user ? 'Sí' : 'No');
    return user || null;
  } catch (error) {
    console.error(' Error en getUser:', error);
    return null;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          console.log(' Iniciando autorización');
          
          const parsedCredentials = z
            .object({ 
              email: z.string().email(), 
              password: z.string().min(6) 
            })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            console.log(' Credenciales inválidas');
            return null;
          }

          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          
          if (!user) {
            console.log(' Usuario no encontrado');
            return null;
          }
          
          if (!user.activo) {
            console.log(' Usuario inactivo');
            return null;
          }

          console.log(' Verificando contraseña...');
          const passwordsMatch = await bcrypt.compare(password, user.hash_password);
          
          if (passwordsMatch) {
            console.log(' Autenticación exitosa');
          
            return {
              id: user.id,
              email: user.correo,
              name: user.nombre_completo,
              rol: user.rol
            };
          } else {
            console.log(' Contraseña incorrecta');
            return null;
          }
        } catch (error) {
          console.error(' Error en authorize:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.rol = (user as any).rol;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.rol) {
        session.user.rol = token.rol;
      }
      return session;
    },
  },
});
