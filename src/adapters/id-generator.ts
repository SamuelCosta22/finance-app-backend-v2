import { v4 as uuid } from 'uuid';

export interface IIdGeneratorAdapter {
  execute(): string;
}

export class IdGeneratorAdapter {
  execute() {
    return uuid();
  }
}
