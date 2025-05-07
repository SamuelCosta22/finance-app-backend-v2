import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresDeleteUserRepository } from '../../../src/repositories/postgres/users/delete-user.repository.ts';
import { user } from '../../fixtures/user.ts';
import { UserNotFoundError } from '../../../src/errors/user.ts';

describe('Delete User Repository', () => {
  it('should delete a user on db', async () => {
    //arrange
    await prisma.user.create({ data: user });
    const sut = new PostgresDeleteUserRepository();

    //act
    const result = await sut.execute(user.id);

    //assert
    expect(result).toStrictEqual(user);
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    await prisma.user.create({ data: user });
    const sut = new PostgresDeleteUserRepository();
    const prismaSpy = jest.spyOn(prisma.user, 'delete');

    //act
    await sut.execute(user.id);

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({ where: { id: user.id } });
  });

  it('should throw Generic Error if Prisma throws generic error', async () => {
    //arrange
    const sut = new PostgresDeleteUserRepository();
    jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(user.id);

    //assert
    await expect(promise).rejects.toThrow();
  });

  it('should throw UserNotFoundError if Prisma throws P2025', async () => {
    //arrange
    const sut = new PostgresDeleteUserRepository();
    jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
      new PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '4.9.0',
      }),
    );

    //act
    const promise = sut.execute(user.id);

    //assert
    await expect(promise).rejects.toThrow(UserNotFoundError);
  });
});
