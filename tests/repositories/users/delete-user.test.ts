import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresDeleteUserRepository } from '../../../src/repositories/postgres/users/delete-user.repository.ts';
import { user } from '../../fixtures/user.ts';

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
    const sut = new PostgresDeleteUserRepository();
    const prismaSpy = jest.spyOn(prisma.user, 'delete');

    //act
    await sut.execute(user.id);

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({ where: { id: user.id } });
  });
});
