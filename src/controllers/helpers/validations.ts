import validator from 'validator';

export const checkIfIdIsValid = (id: string) => validator.isUUID(id);
