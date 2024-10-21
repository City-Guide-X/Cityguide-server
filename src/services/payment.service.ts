import { BadRequestError } from '@errors';
import { IPaymentAuth } from '@types';
import axios from 'axios';
import { get, put } from 'memory-cache';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export const initiatePayment = async (email: string, amount?: number) => {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      { email, amount: String((amount ?? 50) * 100), channels: ['card'] },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw new BadRequestError('Payment initiation failed');
  }
};

export const verifyPayment = async (reference: string) => {
  try {
    const response = await axios.get(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const {
      status,
      gateway_response,
      amount,
      authorization,
      customer: { email },
    } = response.data.data;
    if (status !== 'success' && gateway_response !== 'Successful')
      throw new BadRequestError('Payment was not successful');
    return { ...authorization, email, amount } as IPaymentAuth;
  } catch (error: any) {
    throw new BadRequestError('Payment verification failed');
  }
};

export const refundPayment = async (transaction: string, amount?: number) => {
  const body = amount ? { transaction, amount: amount * 100 } : { transaction };
  try {
    await axios.post(`${PAYSTACK_BASE_URL}/refund`, body, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (err: any) {
    throw new BadRequestError('Payment refund failed');
  }
};

export const getExchangeRate = async (base: string, currency: string): Promise<number> => {
  const EXPIRY = 1000 * 60 * 60 * 24;
  let rate = get(`exchange_rate_${base}`);
  if (rate) {
    rate = JSON.parse(rate);
    return rate[currency];
  }
  rate = get(`exchange_rate_${currency}`);
  if (rate) {
    rate = JSON.parse(rate);
    return 1 / rate[base];
  }
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/latest/${base}`, {
      headers: { Authorization: `Bearer ${process.env.EXCHANGE_RATE_API_KEY}` },
    });
    rate = response.data.conversion_rates;
    put(`exchange_rate_${base}`, JSON.stringify(rate), EXPIRY);
    return rate[currency];
  } catch (error: any) {
    throw new BadRequestError('Exchange rate fetch failed');
  }
};
