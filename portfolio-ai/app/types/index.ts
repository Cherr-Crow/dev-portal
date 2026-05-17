// app/types/index.ts
import { User, Profile, Project, Chat, Message, ChatParticipant } from '@prisma/client'

export type UserWithRelations = User & {
  profile: Profile | null
  projects: Project[]
}

export type DeveloperWithRelations = User & {
  profile: Profile | null
  projects: (Project & {
    techStack: string
  })[]
}

export type ChatWithParticipants = Chat & {
  participants: (ChatParticipant & {
    user: Pick<User, 'id' | 'name' | 'email' | 'role'>
  })[]
  messages?: Message[]
}

export type MessageWithSender = Message & {
  sender: Pick<User, 'id' | 'name' | 'email'>
}