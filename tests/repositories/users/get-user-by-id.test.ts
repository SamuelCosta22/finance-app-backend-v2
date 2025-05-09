import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresGetUserByIdRepository } from '../../../src/repositories/postgres/users/get-user-by-id.repository.ts';
import { user as fakeUser } from '../../fixtures/user.ts';
import { jest } from '@jest/globals';

describe('Get User By Id Repository', () => {
  it('should get a user by id on db', async () => {
    //arrange
    const user = await prisma.user.create({ data: fakeUser });
    const sut = new PostgresGetUserByIdRepository();

    //act
    const result = await sut.execute(user.id);

    //assert
    expect(result).toStrictEqual(user);
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    const sut = new PostgresGetUserByIdRepository();
    const prismaSpy = jest.spyOn(prisma.user, 'findUnique');

    //act
    await sut.execute(fakeUser.id);

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: fakeUser.id },
    });
  });

  it('should throw if Prisma throws', async () => {
    //arrange
    const sut = new PostgresGetUserByIdRepository();
    jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(fakeUser.id);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
