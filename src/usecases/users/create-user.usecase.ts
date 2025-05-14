import { IIdGeneratorAdapter } from '../../adapters/id-generator.ts';
import { IHashGeneratorAdapter } from '../../adapters/password-hasher.ts';
import { ITokensGeneratorAdapter } from '../../adapters/tokens-generator.ts';
import { EmailAlreadyInUseError } from '../../errors/user.ts';
import {
  ICreateUserRepository,
  IGetUserByEmailRepository,
} from '../../types/repositories/users.repository.ts';

export class CreateUserUseCase {
  constructor(
    private createUserRepository: ICreateUserRepository,
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private passwordHasherAdapter: IHashGeneratorAdapter,
    private idGeneratorAdapter: IIdGeneratorAdapter,
    private tokenGeneratorAdapter: ITokensGeneratorAdapter,
  ) {
    this.createUserRepository = createUserRepository;
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordHasherAdapter = passwordHasherAdapter;
    this.idGeneratorAdapter = idGeneratorAdapter;
    this.tokenGeneratorAdapter = tokenGeneratorAdapter;
  }

  async execute(input: CreateUserUseCaseInput) {
    const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
      input.email,
    );

    if (userWithProvidedEmail) {
      throw new EmailAlreadyInUseError(input.email);
    }

    const userId = this.idGeneratorAdapter.execute();
    const hashedPassword = await this.passwordHasherAdapter.execute(
      input.password,
    );

    const user = {
      ...input,
      id: userId,
      password: hashedPassword,
    };

    const createdUser = await this.createUserRepository.execute(user);

    return {
      ...createdUser,
      tokens: this.tokenGeneratorAdapter.execute(userId),
    };
  }
}

export type CreateUserUseCaseInput = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};
