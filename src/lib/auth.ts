import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Add user level and XP to session
        const userData = await prisma.user.findUnique({
          where: { id: user.id },
          select: { 
            level: true, 
            totalXP: true, 
            preferredLang: true,
            profile: {
              select: {
                displayName: true,
                avatar: true,
              }
            }
          }
        })
        if (userData) {
          session.user.level = userData.level
          session.user.totalXP = userData.totalXP
          session.user.preferredLang = userData.preferredLang
          session.user.profile = userData.profile
        }
      }
      return session
    },
  },
  session: {
    strategy: "database",
  },
})