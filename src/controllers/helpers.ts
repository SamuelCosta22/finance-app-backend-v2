export const badRequest = (body: object) => {
  return {
    statusCode: 400,
    body: {
      body,
    },
  };
};

export const created = (body: object) => {
  return {
    statudCode: 201,
    body,
  };
};

export const serverError = () => {
  return {
    statusCode: 500,
    body: {
      message: 'Internal server error',
    },
  };
};
