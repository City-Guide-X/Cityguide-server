import { getAirtimeInput, getDataInput, getPlansInput } from '@schemas';
import { getBillers, initPurchase, Providers } from '@services';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';

export const getPlansHandler = asyncWrapper(async (req: Request<getPlansInput>, res: Response) => {
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
});

export const getAirtimeHandler = asyncWrapper(async (req: Request<{}, {}, getAirtimeInput>, res: Response) => {
  const { provider, phoneNumber, amount } = req.body;
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
});

export const getDataHandler = asyncWrapper(async (req: Request<{}, {}, getDataInput>, res: Response) => {
  const { paymentCode, phoneNumber, amount } = req.body;
  const purchase = await initPurchase({
    Amount: amount,
    CustomerId: phoneNumber,
    PaymentCode: paymentCode,
    CustomerMobile: phoneNumber,
    CustomerEmail: 'oluwatobisalau2000@gmail.com',
    requestReference: Math.random().toString().slice(-12),
  });
  return res.status(200).json(purchase.data);
});
