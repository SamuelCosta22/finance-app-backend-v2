import { CreateUserParams } from '../users/CreateUserParams.ts';

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
  execute(userId: string, input: CreateUserParams): Promise<any>;
}

export interface IGetUserBalanceRepository {
  execute(userId: string): Promise<any>;
}
