import { hash, compare } from 'bcryptjs'

export interface Hasher {
  hash(plain: string): Promise<string>
  compare(plain: string, hash: string): Promise<boolean>
}

export class BcryptHasher implements Hasher {
  async hash(plain: string): Promise<string> {
    return hash(plain, 8)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}