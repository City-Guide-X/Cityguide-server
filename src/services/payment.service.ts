import { BadRequestError } from '@errors';
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
