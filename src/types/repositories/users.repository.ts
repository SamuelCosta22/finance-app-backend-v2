import {
  LoginUserUseCaseInput,
  LoginUserUseCaseOutput,
} from '../../usecases/users/login-user.usecase.ts';
import {
  CreateUserParams,
  UpdateUserParams,
} from '../users/CreateUserParams.ts';

export interface IGetUserByIdRepository {
  execute(userId: string): Promise<any>;
}

export interface ICreateUserRepository {
  execute(createUserParams: CreateUserParams): Promise<any>;
}

export interface IGetUserByEmailRepository {
  execute(email: string): Promise<any>;
}

export interface IDeleteUserRepository {
  execute(userId: string): Promise<any>;
}

export interface IUpdateUserRepository {
  execute(userId: string, input: UpdateUserParams): Promise<any>;
}

export interface IGetUserBalanceRepository {
  execute(userId: string, from: Date, to: Date): Promise<any>;
}

export interface ILoginUserUseCase {
  execute(input: LoginUserUseCaseInput): Promise<LoginUserUseCaseOutput>;
}
