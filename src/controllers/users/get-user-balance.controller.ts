import { ZodError } from 'zod';
import { UserNotFoundError } from '../../errors/user.ts';
import { getUserBalanceSchema } from '../../schemas/user.ts';
import { IGetUserBalanceRepository } from '../../types/repositories/users.repository.ts';
import { badRequest, serverError, success } from '../helpers/http.ts';
import { userNotFoundResponse } from '../helpers/invalid-response.ts';

export class GetUserBalanceController {
  constructor(private getUserBalanceUsecase: IGetUserBalanceRepository) {
    this.getUserBalanceUsecase = getUserBalanceUsecase;
  }

  async execute(httpRequest: any) {
    try {
      const userId = httpRequest.params.userId;
      const from = httpRequest.query.from;
      const to = httpRequest.query.to;

      await getUserBalanceSchema.parseAsync({
        user_id: userId,
        from,
        to,
      });

      const balance = await this.getUserBalanceUsecase.execute(
        userId,
        from,
        to,
      );

      const { statusCode, body } = success(balance);
      return { statusCode, body };
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return userNotFoundResponse();
      }
      if (error instanceof ZodError) {
        return badRequest({ message: error.errors[0].message });
      }
      console.error(error);
      return serverError();
    }
  }
}
