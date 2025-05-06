import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresGetUserByEmailRepository } from '../../../src/repositories/postgres/users/get-user-by-email.repository.ts';
import { user as fakeUser } from '../../fixtures/user.ts';

describe('Get User By Email Repository', () => {
  it('should get a user by email on db', async () => {
    //arrange
    const user = prisma.user.create({ data: fakeUser });
    const sut = new PostgresGetUserByEmailRepository();

    //act
    const result = await sut.execute(fakeUser.email);

    //assert
    expect(result).toStrictEqual(user);
  });
});
