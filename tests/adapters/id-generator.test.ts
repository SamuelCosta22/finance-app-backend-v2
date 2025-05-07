import { IdGeneratorAdapter } from '../../src/adapters/id-generator.ts';

describe('IdGeneratorAdapter', () => {
  it('should return a random id', async () => {
    //arrange
    const sut = new IdGeneratorAdapter();

    //act
    const result = await sut.execute();

    //assert
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(result).toMatch(uuidRegex);
  });
});
