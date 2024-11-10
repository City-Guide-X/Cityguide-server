import { currencies } from '@constants';
import { NotFoundError } from '@errors';
import { exchangeRateInput, getBanksInput, initiatePaymentInput } from '@schemas';
import { findUserById, getBanks, getExchangeRate, initiatePayment } from '@services';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';

export const initiatePaymentHandler = asyncWrapper(
  async (req: Request<{}, {}, initiatePaymentInput>, res: Response) => {
    const { id } = res.locals.user;
    let { amount, currency } = req.body;
    const [user, rate] = await Promise.all([
      findUserById(id),
      amount && currency && currency !== 'NGN' ? getExchangeRate(currency, 'NGN') : undefined,
    ]);
    if (!user) throw new NotFoundError('User not found');
    if (rate && amount) amount = +(amount * rate).toFixed(2);
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

export const getCurrenciesHandler = asyncWrapper(async (req: Request, res: Response) => {
  return res.status(200).json({ currencies });
});
