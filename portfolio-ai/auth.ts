import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/app/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        console.log("=== AUTHORIZE CALLED ===")
        console.log("Credentials:", credentials)
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }
        
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })
          console.log("User found:", user)
          
          if (!user || !user.password) {
            console.log("No user or no password")
            return null
          }
          
          const isValid = await bcrypt.compare(credentials.password as string, user.password)
          console.log("Password valid:", isValid)
          
          if (!isValid) return null
          
          console.log("Returning user:", { id: user.id, email: user.email, role: user.role })
          return { id: user.id, email: user.email, name: user.name, role: user.role }
        } catch (error) {
          console.error("Authorize error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("=== JWT CALLBACK ===")
      console.log("User:", user)
      console.log("Token before:", token)
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      console.log("Token after:", token)
      return token
    },
    async session({ session, token }) {
      console.log("=== SESSION CALLBACK ===")
      console.log("Token:", token)
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      console.log("Session:", session)
      return session
    },
  },
  debug: true,
})