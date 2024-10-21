import { NotFoundError } from '@errors';
import { exchangeRateInput, getBanksInput, initiatePaymentInput } from '@schemas';
import { findUserById, getBanks, getExchangeRate, initiatePayment } from '@services';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';

export const initiatePaymentHandler = asyncWrapper(
  async (req: Request<{}, {}, initiatePaymentInput>, res: Response) => {
    const { id } = res.locals.user;
    const { amount } = req.body;
    const user = await findUserById(id);
    if (!user) throw new NotFoundError('User not found');
    const payment = await initiatePayment(user.email, amount);
    return res.status(200).json(payment);
  }
);

export const exchangeRateHandler = asyncWrapper(async (req: Request<{}, {}, {}, exchangeRateInput>, res: Response) => {
  const { base, currency, amount } = req.query;
  const exchangeRate = await getExchangeRate(base, currency);
  const amountNum = amount ? +(amount * exchangeRate).toFixed(2) : undefined;
  return res.status(200).json({ exchangeRate, amount: amountNum });
});

export const getBanksHandler = asyncWrapper(async (req: Request<{}, {}, {}, getBanksInput>, res: Response) => {
  const { country } = req.query;
  const banks = await getBanks(country);
  return res.status(200).json({ banks });
});
