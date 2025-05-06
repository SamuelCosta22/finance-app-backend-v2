import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresGetUserByIdRepository } from '../../../src/repositories/postgres/users/get-user-by-id.repository.ts';
import { user as fakeUser } from '../../fixtures/user.ts';

describe('Get User By Id Repository', () => {
  it('should get a user by id on db', async () => {
    //arrange
    const user = prisma.user.create({ data: fakeUser });
    const sut = new PostgresGetUserByIdRepository();

    //act
    const result = await sut.execute(fakeUser.id);

    //assert
    expect(result).toStrictEqual(user);
  });
});
