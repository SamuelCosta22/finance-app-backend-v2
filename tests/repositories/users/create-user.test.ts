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
});
