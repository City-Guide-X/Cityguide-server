import { createStayInput } from '@schemas';
import { createEstablishmentStay, createUserStay } from '@services';
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';

export const createStayHandler = asyncWrapper(async (req: Request<{}, {}, createStayInput>, res: Response) => {
  const { id, type } = res.locals.user;
  const body = req.body;
  const data = { ...body, partnerId: id };
  const stay = type === 'USER' ? await createUserStay(data) : await createEstablishmentStay(data);
  return res.status(201).json({ stay });
});
