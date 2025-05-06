import { faker } from '@faker-js/faker';
import { prisma } from '../../../src/lib/prisma.ts';
import { PostgresUpdateUserRepository } from '../../../src/repositories/postgres/users/update-user.repository.ts';
import { user as fakeUser } from '../../fixtures/user.ts';

const updateUserParams = {
  id: faker.string.uuid(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

describe('Update User Repository', () => {
  it('should update user on db', async () => {
    //arrange
    const user = await prisma.user.create({ data: fakeUser });
    const sut = new PostgresUpdateUserRepository();

    //act
    const result = await sut.execute(user.id, fakeUser);

    //assert
    expect(result).toStrictEqual(updateUserParams);
  });

  it('should call Prisma with correct params', async () => {
    //arrange
    const user = await prisma.user.create({ data: fakeUser });
    const sut = new PostgresUpdateUserRepository();
    const prismaSpy = jest.spyOn(prisma.user, 'update');

    //act
    await sut.execute(user.id, updateUserParams);

    //assert
    expect(prismaSpy).toHaveBeenCalledWith({
      where: { id: user.id },
      data: updateUserParams,
    });
  });
});
