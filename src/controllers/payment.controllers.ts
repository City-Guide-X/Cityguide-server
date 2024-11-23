import { currencies } from '@constants';
import { BadRequestError, NotFoundError } from '@errors';
import { completePaymentInput, exchangeRateInput, getBanksInput, initiatePaymentInput } from '@schemas';
import { chargeCard, completeCharge, findUserById, getBanks, getExchangeRate, initiatePayment } from '@services';
import { asyncWrapper } from '@utils';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

export const initiatePaymentHandler = asyncWrapper(
  async (req: Request<{}, {}, initiatePaymentInput>, res: Response) => {
    const { id } = res.locals.user;
    let { amount, currency, useSavedCard } = req.body;
    const [user, rate] = await Promise.all([
      findUserById(id),
      amount && currency && currency !== 'NGN' ? getExchangeRate(currency, 'NGN') : undefined,
    ]);
    if (!user) throw new NotFoundError('User not found');
    if (rate && amount) amount = +(amount * rate).toFixed(2);
    let payment: Record<string, any>;
    if (useSavedCard && amount) {
      const paymentAuth = user.paymentAuth;
      if (!paymentAuth) throw new BadRequestError('No payment method found');
      if (!dayjs().isBefore(`${paymentAuth.exp_year}-${paymentAuth.exp_month}-01`, 'month'))
        throw new BadRequestError('Payment method expired');
      payment = await chargeCard(paymentAuth.authorization_code, paymentAuth.email, String(amount));
    } else {
      const initiateRes = await initiatePayment(user.email, amount);
      payment = { ...initiateRes, status: 'initiated', message: 'Payment initiated' };
    }
    return res.status(200).json({ ...payment, convertedAmount: amount });
  }
);

export const completePaymentHandler = asyncWrapper(
  async (req: Request<{}, {}, completePaymentInput>, res: Response) => {
    const { reference, ...data } = req.body;
    let url = 'charge/';
    if (data.otp) url += 'submit_otp';
    else if (data.birthday) url += 'submit_birthday';
    else if (data.pin) url += 'submit_pin';
    else if (data.phone) url += 'submit_phone';
    else throw new BadRequestError('Invalid request');
    const payment = await completeCharge(url, reference, data);
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
