import { badRequest } from './http.ts';

export const invalidPasswordResponse = () => {
  return badRequest({
    message: 'Password must be at least 6 characters.',
  });
};

export const emailIsAlreadyInUseResponse = () => {
  return badRequest({
    message: 'Invalid email. Please provide a valid one.',
  });
};

export const invalidIdResponse = () => {
  return badRequest({
    message: 'The provided ID is not valid.',
  });
};
