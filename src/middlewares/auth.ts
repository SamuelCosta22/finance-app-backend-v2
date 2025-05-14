import jwt from 'jsonwebtoken';

export const auth = (request, response, next) => {
  try {
    const accessToken = request.headers?.authorization?.split('Bearer ')[1];
    if (!accessToken) {
      return response.status(401).send({ message: 'Unauthorized' });
    }

    const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
      throw new Error('JWT secrets not defined in environment variables.');
    }

    const decodedToken = jwt.verify(accessToken, accessTokenSecret);

    if (typeof decodedToken === 'string' || !('userId' in decodedToken)) {
      return response.status(401).send({ message: 'Unauthorized' });
    }

    request.userId = decodedToken.userId;

    next();
  } catch (error) {
    console.error(error);
    return response.status(401).send({ message: 'Unauthorized' });
  }
};
