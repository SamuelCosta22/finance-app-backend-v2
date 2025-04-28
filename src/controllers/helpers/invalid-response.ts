import { badRequest, notFound } from './http.ts';

export const invalidIdResponse = () => {
  return badRequest({
    message: 'The provided ID is not valid.',
  });
};

export const userNotFoundResponse = () => {
  return notFound({
    message: 'User not found.',
  });
};
