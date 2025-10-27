import { NuxtAuthHandler } from '#auth';

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  pages: {
    signIn: '/login',
  },
  providers: [
    {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        // TODO: Реализовать проверку учетных данных с БД
        // Пока что для демо возвращаем mock пользователя
        if (credentials?.email === 'demo@example.com' && credentials?.password === 'demo') {
          return {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Demo User',
            email: 'demo@example.com',
          };
        }
        return null;
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
});
