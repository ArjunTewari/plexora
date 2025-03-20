import { type Session, type User } from "next-auth"
import { type JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { getUserByEmail } from "./db"

// Extend the built-in types
declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: string
    restaurantId: string
  }
  
  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    restaurantId: string
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await getUserByEmail(credentials.email)
        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          restaurantId: user.restaurantId,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | null }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.restaurantId = user.restaurantId
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT & { id: string; role: string; restaurantId: string } }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.restaurantId = token.restaurantId
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

