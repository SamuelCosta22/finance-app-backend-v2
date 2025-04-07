export const badRequest = (body: object) => ({
  statusCode: 400,
  body,
});

export const created = (body: object) => ({
  statudCode: 201,
  body,
});

export const serverError = () => ({
  statusCode: 500,
  body: {
    message: 'Internal server error',
  },
});

export const success = (body: object) => ({
  statusCode: 200,
  body,
});
