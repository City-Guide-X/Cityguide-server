import { getAirtimeInput, getDataInput, getPlansInput } from '@schemas';
import { getBillers, initPurchase, Providers } from '@services';
import { Request, Response } from 'express';

export const getPlansHandler = async (req: Request<getPlansInput>, res: Response) => {
  const { provider } = req.params;
  const response = await getBillers(provider as Providers, 'data');
  const plans = response.data.PaymentItems.map((item: any) => ({
    id: item.Id,
    name: item.Name,
    itemFee: item.ItemFee,
    amount: item.Amount,
    paymentCode: item.PaymentCode,
  }));
  return res.status(200).json({ plans });
};

export const getAirtimeHandler = async (req: Request<{}, {}, getAirtimeInput>, res: Response) => {
  const { provider, phoneNumber, amount } = req.body;
  try {
    const response = await getBillers(provider as Providers, 'airtime');
    const PaymentCode = response.data.PaymentItems[0].PaymentCode;
    const purchase = await initPurchase({
      PaymentCode,
      Amount: amount,
      CustomerId: phoneNumber,
      CustomerMobile: phoneNumber,
      CustomerEmail: 'oluwatobisalau2000@gmail.com',
      requestReference: Math.random().toString().slice(-12),
    });
    return res.status(200).json(purchase.data);
  } catch (err: any) {
    if (err.response.status === 417)
      return res.status(400).json({ message: 'Try again in 120 seconds. Payment code not available' });
  }
};

export const getDataHandler = async (req: Request<{}, {}, getDataInput>, res: Response) => {
  const { paymentCode, phoneNumber, amount } = req.body;
  try {
    const purchase = await initPurchase({
      Amount: amount,
      CustomerId: phoneNumber,
      PaymentCode: paymentCode,
      CustomerMobile: phoneNumber,
      CustomerEmail: 'oluwatobisalau2000@gmail.com',
      requestReference: Math.random().toString().slice(-12),
    });
    return res.status(200).json(purchase.data);
  } catch (err: any) {
    if (err.response.status === 417)
      return res.status(400).json({ message: 'Try again in 120 seconds. Payment code not available' });
  }
};
