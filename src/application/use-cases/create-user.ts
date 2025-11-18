import { UserRepository } from '../../domain/repositories/user-repository'
import { Hasher } from '../../infra/cryptography/bcrypt-hasher'
import { User, CreateUserRequest } from '../../domain/entities/user'

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hasher: Hasher
  ) {}

  async execute(data: CreateUserRequest): Promise<User> {
    const userExists = await this.userRepository.findByCpf(data.cpf)

    if (userExists) {
      throw new Error('User with this CPF already exists')
    }

    const hashedPassword = await this.hasher.hash(data.password)

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword
    })

    return user
  }
}