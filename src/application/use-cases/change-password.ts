import { UserRepository } from '../../domain/repositories/user-repository'
import { Hasher } from '../../infra/cryptography/bcrypt-hasher'

interface ChangePasswordRequest {
  userId: string
  newPassword: string
}

export class ChangePasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private hasher: Hasher
  ) {}

  async execute({ userId, newPassword }: ChangePasswordRequest): Promise<void> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    const hashedPassword = await this.hasher.hash(newPassword)

    await this.userRepository.update(userId, {
      password: hashedPassword
    })
  }
}