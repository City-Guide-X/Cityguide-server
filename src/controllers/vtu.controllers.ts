import { getBillers } from '@services';
import { Request, Response } from 'express';

export const getBillersHandler = async (req: Request, res: Response) => {
  const response = await getBillers();
  const data = response.data.BillerList.Category[0].Billers;
  const billers = data.map((bill: any) => ({
    id: bill.Id,
    name: bill.Name,
    shortName: bill.ShortName,
    narration: bill.Narration,
    owner: bill.QuickTellerSiteUrlName,
  }));
  return res.status(200).json({ billers });
};
