import NextAuth from "next-auth/next";
import CredentialProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  secret: process.env.NEXT_AUTH_SECRET_KEY,
  providers: [
    CredentialProvider({
      name: "credentails",
      credentials: {
        phoneNumber: {
          label: "شماره تماس",
          type: "text",
        },
      },
      async authorize(credentials) {
        console.log("credentails", credentials);
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: credentials?.phoneNumber,
          }),
        });

        const user = await res.json();

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...user, ...token };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
