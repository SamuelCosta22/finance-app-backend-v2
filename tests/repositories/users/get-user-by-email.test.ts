import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresGetUserByEmailRepository } from '../../../src/repositories/postgres/users/get-user-by-email.repository.ts';
import { user as fakeUser } from '../../fixtures/user.ts';
import { jest } from '@jest/globals';

describe('Get User By Email Repository', () => {
  it('should get a user by email on db', async () => {
    //arrange
    const user = await prisma.user.create({ data: fakeUser });
    const sut = new PostgresGetUserByEmailRepository();

    //act
    const result = await sut.execute(user.email);

    //assert
    expect(result).toStrictEqual(user);
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    const sut = new PostgresGetUserByEmailRepository();
    const prismaSpy = jest.spyOn(prisma.user, 'findUnique');

    //act
    await sut.execute(fakeUser.email);

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: { email: fakeUser.email },
    });
  });

  it('should throw if Prisma throws', async () => {
    //arrange
    const sut = new PostgresGetUserByEmailRepository();
    jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(fakeUser.email);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
