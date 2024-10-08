import { NotFoundError } from '@errors';
import { initiatePaymentInput } from '@schemas';
import { findUserById, initiatePayment } from '@services';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';

export const initiatePaymentHandler = asyncWrapper(
  async (req: Request<{}, {}, initiatePaymentInput>, res: Response) => {
    const { id } = res.locals.user;
    const { amount, currency } = req.body;
    const user = await findUserById(id);
    if (!user) throw new NotFoundError('User not found');
    const payment = await initiatePayment(user.email, amount, currency);
    return res.status(200).json(payment);
  }
);
