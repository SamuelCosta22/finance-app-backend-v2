import { IPasswordComparatorAdapter } from '../../adapters/password-comparator.ts';
import { ITokensGeneratorAdapter } from '../../adapters/tokens-generator.ts';
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.ts';
import { IGetUserByEmailRepository } from '../../types/repositories/users.repository.ts';

export class LoginUserUseCase {
  constructor(
    private getUserByEmailRepository: IGetUserByEmailRepository,
    private passwordComparatorAdapter: IPasswordComparatorAdapter,
    private tokenGeneratorAdapter: ITokensGeneratorAdapter,
  ) {
    this.getUserByEmailRepository = getUserByEmailRepository;
    this.passwordComparatorAdapter = passwordComparatorAdapter;
    this.tokenGeneratorAdapter = tokenGeneratorAdapter;
  }

  async execute(input: LoginUserUseCaseInput) {
    const user = await this.getUserByEmailRepository.execute(input.email);
    if (!user) throw new UserNotFoundError();

    const isPasswordValid = await this.passwordComparatorAdapter.execute(
      input.password,
      user.password,
    );
    if (!isPasswordValid) throw new InvalidPasswordError();

    return {
      ...user,
      tokens: this.tokenGeneratorAdapter.execute(user.id),
    };
  }
}

export type LoginUserUseCaseInput = {
  email: string;
  password: string;
};
