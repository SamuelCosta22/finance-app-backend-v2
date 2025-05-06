import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresCreateUserRepository } from '../../../src/repositories/postgres/users/create-user.repository.ts';
import { user } from '../../fixtures/user.ts';

describe('Create User Repository', () => {
  it('should create a user on db', async () => {
    //arrange
    const sut = new PostgresCreateUserRepository();

    //act
    const result = await sut.execute(user);

    //assert
    expect(result.id).toBe(user.id);
    expect(result.first_name).toBe(user.first_name);
    expect(result.last_name).toBe(user.last_name);
    expect(result.email).toBe(user.email);
    expect(result.password).toBe(user.password);
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    const sut = new PostgresCreateUserRepository();
    const prismaSpy = jest.spyOn(prisma.user, 'create');

    //act
    await sut.execute(user);

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({ data: user });
  });

  it('should throw if Prisma throws', async () => {
    //arrange
    const sut = new PostgresCreateUserRepository();
    jest.spyOn(prisma.user, 'create').mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(user);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
