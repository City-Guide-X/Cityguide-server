import { BadRequestError } from '@errors';
import { IPaymentAuth } from '@types';
import { withRetry } from '@utils';
import axios from 'axios';
import { get, put } from 'memory-cache';
import { v4 } from 'uuid';

const ax = axios.create({ baseURL: 'https://api.paystack.co' });

export const initiatePayment = async (email: string, amount?: number) => {
  try {
    const response = await ax.post(
      'transaction/initialize',
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

export const verifyPayment = async (reference: string, options?: { payByProxy: boolean; price: number }) => {
  try {
    const response = await ax.get(`transaction/verify/${reference}`, {
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
    if (status !== 'success' && gateway_response !== 'Successful') throw new Error('Payment was not successful');
    if (options?.payByProxy && amount !== options.price * 100) throw new Error('Amount paid does not match');
    return { ...authorization, email } as IPaymentAuth;
  } catch (error: any) {
    throw new BadRequestError(error.message || 'Payment verification failed');
  }
};

export const refundPayment = async (transaction: string, amount?: number) => {
  const body = amount ? { transaction, amount: amount * 100 } : { transaction };
  try {
    await ax.post('refund', body, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (err: any) {
    throw new BadRequestError('Payment refund failed');
  }
};

export const chargeCard = async (authorization_code: string, email: string, amount: string) => {
  const reference = v4();
  return withRetry(
    async () => {
      const response = await ax.post(
        'charge',
        { authorization_code, email, amount: String(+amount * 100), reference },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const { amount: chargedAmount, status } = response.data.data;
      if (status !== 'success') throw new BadRequestError('Could not charge card');
      if (chargedAmount !== +amount) throw new BadRequestError('Amount charged does not match');
      return chargedAmount;
    },
    { shouldRetry: (error: any) => !(error instanceof BadRequestError) }
  );
};

export const payRecipient = async (recipient: string, amount: number, reason: string) => {
  const reference = v4();
  return withRetry(async () => {
    const response = await ax.post(
      'transfer',
      { source: 'balance', amount: amount * 100, recipient, reason, reference },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data;
  });
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

export const addRecipient = async (
  type: string,
  name: string,
  account_number: string,
  bank_code: string,
  currency: string
): Promise<string> => {
  try {
    const response = await ax.post(
      'transferrecipient',
      { type, name, account_number, bank_code, currency },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.data.recipient_code;
  } catch (err: any) {
    throw new BadRequestError('Recipient creation failed');
  }
};

export const getBanks = async (country: string) => {
  try {
    const response = await ax.get(`bank?country=${country}&perPage=100`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const banks = response.data.data.map((bank: any) => ({
      name: bank.name,
      code: bank.code,
      country: bank.country,
      currency: bank.currency,
      type: bank.type,
    }));
    return banks;
  } catch (err: any) {
    throw new BadRequestError('Bank fetch failed');
  }
};
