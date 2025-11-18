import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { AuthenticateUserUseCase } from "../../../application/use-cases/authenticate-user";

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
});

export class AuthController {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {}

  async authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { cpf, password } = authenticateBodySchema.parse(request.body);

      const { user } = await this.authenticateUserUseCase.execute({
        cpf,
        password,
      });

      const token = await reply.jwtSign(
        { role: user.role },
        { sign: { sub: user.id } }
      );

      return reply.status(200).send({
        access_token: token,
        user,
      });
    } catch (error) {
      return reply.status(400).send({
        message:
          error instanceof Error ? error.message : "Authentication failed",
      });
    }
  }
}
