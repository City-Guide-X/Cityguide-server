import { BadRequestError } from '@errors';
import { privateFields, privateVTUFields } from '@models';
import { createReceiverInput, createTransactionInput, deleteReceiverInput, updateReceiverInput } from '@schemas';
import {
  chargeCard,
  createNotification,
  createReceiver,
  createTransaction,
  deleteReceiver,
  findUserById,
  getUserReceivers,
  getUserTransactions,
  updateReceiver,
  updateUserInfo,
  verifyPayment,
} from '@services';
import { EntityType, IVtuTransaction, NotificationType, VTUStatus } from '@types';
import { asyncWrapper, numberToCurrency, sanitize } from '@utils';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const createReceiverHandler = asyncWrapper(async (req: Request<{}, {}, createReceiverInput>, res: Response) => {
  const { id } = res.locals.user;
  const data = { ...req.body, user: id as any };
  const receiver = await createReceiver(data);
  return res.status(201).json({ receiver: sanitize(receiver, privateVTUFields) });
});

export const getUserReceiversHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const receivers = await getUserReceivers(id);
  return res.status(200).json({ receivers: sanitize(receivers, privateVTUFields) });
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

export const createTransactionHandler = asyncWrapper(
  async (req: Request<{}, {}, createTransactionInput>, res: Response) => {
    const { id } = res.locals.user;
    const { useSavedCard, saveCard, ...data }: IVtuTransaction = { ...req.body, user: id as any };
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      if (useSavedCard) {
        const user = await findUserById(id);
        if (!user) throw new BadRequestError('User not found');
        const paymentAuth = user.paymentAuth;
        if (!paymentAuth) throw new BadRequestError('Payment authorization not found');
        if (!dayjs().isBefore(`${paymentAuth.exp_year}-${paymentAuth.exp_month}-01`, 'month'))
          throw new BadRequestError('Payment authorization expired');
        data.paymentAuth = paymentAuth;
        await chargeCard(paymentAuth.authorization_code, paymentAuth.email, String(data.amount));
      } else if (data.payReference) {
        data.paymentAuth = await verifyPayment(data.payReference, { payByProxy: true, price: data.amount });
        if (saveCard) await updateUserInfo(id, { paymentAuth: data.paymentAuth }, session);
      } else throw new BadRequestError('Payment is required for vtu purchase');
      const transaction = await createTransaction({ ...data, status: VTUStatus.SUCCESSFUL }, session);
      const transactionResponse = sanitize(transaction, privateVTUFields);

      const notificationObj = {
        recipient: id,
        recipientType: EntityType.USER,
        type: NotificationType.VTU,
        title: `${data.type} purchase`,
        message: `A ${data.type} purchase of NGN ${numberToCurrency(
          data.amount
        )} has been successfully processed. Thank you for using our VTU service.`,
      };
      const notification = await createNotification(notificationObj, session);

      const socketId = onlineUsers.get(id);
      if (socketId) res.locals.io?.to(socketId).emit('new_notification', sanitize(notification, privateFields));
      return res.status(201).json({ transaction: transactionResponse });
    } catch (err: any) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
);

export const getUserTransactionsHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const transactions = await getUserTransactions(id);
  return res.status(200).json({ transactions: sanitize(transactions, privateVTUFields) });
});
