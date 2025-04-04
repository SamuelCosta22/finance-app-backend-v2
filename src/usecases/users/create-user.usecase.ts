import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PostgresCreateUserRepository } from '../../repositories/postgres/users/create-user.repository.ts';

export class CreateUserUseCase {
  async execute(input: CreateUserUseCaseInput) {
    //TODO: verificar se o email já está em uso

    //Gerar ID do usuário
    const userId = uuidv4();

    //criptografar a senha
    const hashedPassword = await bcrypt.hash(input.password, 10);

    //inserir o usuário no banco de dados
    const user = {
      ...input,
      id: userId,
      password: hashedPassword,
    };

    //retornar o repositório
    const postgresCreateUserRepository = new PostgresCreateUserRepository();
    const createdUser = await postgresCreateUserRepository.execute(user);

    return createdUser;
  }
}

export type CreateUserUseCaseInput = {
  ID?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};
