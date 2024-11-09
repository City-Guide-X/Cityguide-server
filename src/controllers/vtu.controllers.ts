import { privateFields } from '@models';
import { createReceiverInput, deleteReceiverInput, updateReceiverInput } from '@schemas';
import { createReceiver, deleteReceiver, getUserReceivers, updateReceiver } from '@services';
import { asyncWrapper, sanitize } from '@utils';
import { Request, Response } from 'express';

export const createReceiverHandler = asyncWrapper(async (req: Request<{}, {}, createReceiverInput>, res: Response) => {
  const { id } = res.locals.user;
  const data = { ...req.body, user: id as any };
  const receiver = await createReceiver(data);
  return res.status(201).json({ receiver: sanitize(receiver, privateFields) });
});

export const getUserReceiversHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const receivers = await getUserReceivers(id);
  return res.status(200).json({ receivers: sanitize(receivers, privateFields) });
});

export const updateReceiverHandler = asyncWrapper(
  async (req: Request<updateReceiverInput['params'], {}, updateReceiverInput['body']>, res: Response) => {
    const { receiverId } = req.params;
    await updateReceiver(receiverId, req.body);
    return res.sendStatus(204);
  }
);

export const deleteReceiverHandler = asyncWrapper(async (req: Request<deleteReceiverInput>, res: Response) => {
  const { receiverId } = req.params;
  await deleteReceiver(receiverId);
  return res.sendStatus(204);
});
