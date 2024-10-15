import { BadRequestError } from '@errors';
import { IPaymentAuth } from '@types';
import axios from 'axios';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export const initiatePayment = async (email: string, amount: number, currency: string) => {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      { email, amount: String(amount * 100), currency },
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

export const verifyPayment = async (reference: string, transactionAmount: number) => {
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
