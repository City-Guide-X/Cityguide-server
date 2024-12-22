import { defaultStatusProgress } from '@constants';
import { privateFields, privateVTUFields } from '@models';
import {
  createReceiverInput,
  createTransactionInput,
  deleteReceiverInput,
  getVTUTransactionInput,
  updateReceiverInput,
  vtuServicesInput,
} from '@schemas';
import {
  createNotification,
  createReceiver,
  createTransaction,
  deleteReceiver,
  getTransaction,
  getUserReceivers,
  getUserTransactions,
  getVTUServices,
  updateReceiver,
  updateTransaction,
  updateUserInfo,
  verifyPayment,
} from '@services';
import { EntityType, IVtuTransaction, NotificationType, VTUStatus, VTUTransactionStatus } from '@types';
import { asyncWrapper, numberToCurrency, sanitize } from '@utils';
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
    const socketId = onlineUsers.get(id);
    let transaction;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      data.paymentAuth = await verifyPayment(data.payReference, { payByProxy: true, price: data.amount });
      if (saveCard && !useSavedCard) await updateUserInfo(id, { paymentAuth: data.paymentAuth }, session);
      // Create Transaction
      const statusProgress = defaultStatusProgress;
      statusProgress[VTUTransactionStatus.CREATED] = new Date();
      transaction = await createTransaction({ ...data, status: VTUStatus.IN_PROGRESS, statusProgress }, session);
      res.status(201).json({ transaction: sanitize(transaction, privateVTUFields) });
      // Process Transaction
      transaction = await updateTransaction(
        transaction.id,
        { statusProgress: { ...transaction.statusProgress, [VTUTransactionStatus.PROCESSING]: new Date() } },
        session
      );
      if (socketId)
        res.locals.io?.to(socketId).emit('vtu_transaction_status_progress', sanitize(transaction, privateVTUFields));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Send to Local partner for processing
      transaction = await updateTransaction(
        transaction.id,
        { statusProgress: { ...transaction.statusProgress, [VTUTransactionStatus.LOCAL_PROCESSING]: new Date() } },
        session
      );
      if (socketId)
        res.locals.io?.to(socketId).emit('vtu_transaction_status_progress', sanitize(transaction, privateVTUFields));
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Finalize transaction
      transaction = await updateTransaction(
        transaction.id,
        {
          status: VTUStatus.SUCCESSFUL,
          statusProgress: { ...transaction.statusProgress, [VTUTransactionStatus.SUCCESSFUL]: new Date() },
        },
        session
      );
      if (socketId)
        res.locals.io?.to(socketId).emit('vtu_transaction_status_progress', sanitize(transaction, privateVTUFields));

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
      await session.commitTransaction();
      if (socketId) res.locals.io?.to(socketId).emit('new_notification', sanitize(notification, privateFields));
      return;
    } catch (err: any) {
      if (transaction) {
        transaction = await updateTransaction(
          transaction.id,
          {
            status: VTUStatus.FAILED,
            statusProgress: { ...transaction.statusProgress, [VTUTransactionStatus.FAILED]: new Date() },
          },
          session
        );
        if (socketId)
          res.locals.io?.to(socketId).emit('vtu_transaction_status_progress', sanitize(transaction, privateVTUFields));
        await session.commitTransaction();
      } else {
        await session.abortTransaction();
        throw err;
      }
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

export const getTransactionHandler = asyncWrapper(async (req: Request<getVTUTransactionInput>, res: Response) => {
  const { transactionId } = req.params;
  const transaction = await getTransaction(transactionId);
  return res.status(200).json({ transaction: sanitize(transaction, privateVTUFields) });
});

export const getVTUServicesHandler = asyncWrapper(async (req: Request<{}, {}, {}, vtuServicesInput>, res: Response) => {
  const { type } = req.query;
  const services = getVTUServices(type);
  return res.status(200).json({ services });
});
