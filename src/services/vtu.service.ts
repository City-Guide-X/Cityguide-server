import { BadRequestError, NotFoundError } from '@errors';
import { Receiver, ReceiverModel, Transaction, TransactionModel } from '@models';
import { ClientSession } from 'mongoose';

export const createReceiver = (option: Partial<Receiver>) => {
  return ReceiverModel.create({ ...option });
};

export const getUserReceivers = (user: string) => {
  return ReceiverModel.find({ user }).sort('-createdAt');
};

export const updateReceiver = async (_id: string, options: Partial<Receiver>) => {
  const { matchedCount, modifiedCount } = await ReceiverModel.updateOne({ _id }, { ...options });
  if (!matchedCount) throw new NotFoundError('Receiver not found');
  if (!modifiedCount) throw new BadRequestError('Receiver not updated');
};

export const deleteReceiver = async (_id: string) => {
  const { deletedCount } = await ReceiverModel.deleteOne({ _id });
  if (!deletedCount) throw new NotFoundError('Receiver not found');
};

export const createTransaction = async (option: Partial<Transaction>, session?: ClientSession) => {
  const [transaction] = await TransactionModel.create([{ ...option }], { session });
  return transaction;
};

export const getUserTransactions = (user: string) => {
  return TransactionModel.find({ user }).sort('-createdAt');
};
