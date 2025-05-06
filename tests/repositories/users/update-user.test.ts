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
    const expected = { ...updateUserParams, id: user.id };

    //act
    const result = await sut.execute(user.id, expected);

    //assert
    expect(result).toStrictEqual(expected);
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

  it('should throw if Prisma throws', async () => {
    //arrange
    const sut = new PostgresUpdateUserRepository();
    jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error());

    //act
    const promise = sut.execute(fakeUser.id, updateUserParams);

    //assert
    await expect(promise).rejects.toThrow();
  });
});
