import { UserRepository } from '../../domain/repositories/user-repository'
import { Hasher } from '../../infra/cryptography/bcrypt-hasher'

interface AuthenticateUserRequest {
  cpf: string
  password: string
}

interface AuthenticateUserResponse {
  user: {
    id: string
    name: string
    cpf: string
    role: string
  }
}

export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hasher: Hasher
  ) {}

  async execute({ cpf, password }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByCpf(cpf)

    if (!user) {
      throw new Error('Invalid credentials')
    }

    const isPasswordValid = await this.hasher.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        cpf: user.cpf,
        role: user.role
      }
    }
  }
}