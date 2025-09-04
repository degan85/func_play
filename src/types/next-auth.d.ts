import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      level: number
      totalXP: number
      preferredLang: string
      profile?: {
        displayName?: string | null
        avatar?: string | null
      } | null
    }
  }

  interface User {
    id: string
    level: number
    totalXP: number
    preferredLang: string
    profile?: {
      displayName?: string | null
      avatar?: string | null
    } | null
  }
}