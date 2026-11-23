import type { User } from "@/types/models"

export interface UserRepository {
  get(id: string): Promise<User | null>
  create(user: User): Promise<void>
}
