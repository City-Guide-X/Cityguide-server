import { privateFields, User } from '@models';
import {
  createUserInput,
  getEstablishmentInput,
  getEstablishmentsInput,
  loginUserInput,
  updateUserInput,
} from '@schemas';
import {
  createUser,
  findEstablishmentById,
  findEstablishmentByType,
  findUserByEmail,
  findUserById,
  getAllEstablishments,
  setUserRefreshToken,
  signTokens,
  updateUserInfo,
} from '@services';
import { sendEmail } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createUserHandler = async (req: Request<{}, {}, createUserInput>, res: Response) => {
  const body = req.body;
  try {
    const user = await createUser(body);
    await sendEmail({
      to: user.email,
      template: 'verificationCode',
      locals: {
        name: `${user.firstName} ${user.lastName}`,
        verifyCode: user.otp,
      },
    });
    const { accessToken, refreshToken } = signTokens({
      id: user._id.toString(),
      type: 'USER',
      isPartner: user.isPartner,
    });
    await setUserRefreshToken(user._id.toString(), refreshToken!);
    return res.status(201).json({ user: omit(user.toJSON(), privateFields), accessToken });
  } catch (err: any) {
    if (err.code === 11000)
      return res.status(409).json({
        message: `User with ${err.keyValue.phoneNumber || err.keyValue.email} already exists`,
      });
  }
};

export const loginUserHandler = async (req: Request<{}, {}, loginUserInput>, res: Response) => {
  const { email, password } = req.body;
  const message = 'Invalid email or password';
  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message });
  const isUser = await user.validatePassword(password);
  if (!isUser) return res.status(401).json({ message });
  const { accessToken, refreshToken } = signTokens({
    id: user._id.toString(),
    type: 'USER',
    isPartner: user.isPartner,
  });
  await setUserRefreshToken(user._id.toString(), refreshToken!);
  return res.status(200).json({ user: omit(user.toJSON(), privateFields), accessToken });
};

export const socialAuthHandler = async (req: Request, res: Response) => {
  const data = req.user as Partial<User>;
  if (!data) return res.status(401).json({ message: 'Invalid login' });
  const user = await findUserByEmail(data.email!);
  if (user) {
    if (!user.isSocial)
      return res.status(409).json({
        message: `User with ${data.email} already exists`,
      });
    const { accessToken, refreshToken } = signTokens({
      id: user._id.toString(),
      type: 'USER',
      isPartner: user.isPartner,
    });
    await setUserRefreshToken(user._id.toString(), refreshToken!);
    return res.status(200).json({ user: omit(user.toJSON(), privateFields), accessToken });
  } else {
    try {
      const user = await createUser(data);
      const { accessToken, refreshToken } = signTokens({
        id: user._id.toString(),
        type: 'USER',
        isPartner: user.isPartner,
      });
      await setUserRefreshToken(user._id.toString(), refreshToken!);
      return res.status(201).json({ user: omit(user.toJSON(), privateFields), accessToken });
    } catch (err: any) {
      console.log(err);
      if (err.code === 11000)
        return res.status(409).json({
          message: `User with ${err.keyValue.phoneNumber || err.keyValue.email} already exists`,
        });
    }
  }
};

export const getUserProfileHandler = async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const user = await findUserById(id);
  if (!user) return res.sendStatus(404).json({ message: 'User not found' });
  return res.status(200).json({ user: omit(user.toJSON(), privateFields) });
};

export const updateUserHandler = async (req: Request<{}, {}, updateUserInput>, res: Response) => {
  const { id } = res.locals.user;
  const body = req.body;
  const isUpdated = await updateUserInfo(id, body);
  if (!isUpdated.modifiedCount) return res.status(400).json({ message: 'Could not update user info' });
  return res.sendStatus(204);
};

export const getEstablishmentsHandler = async (req: Request<{}, {}, getEstablishmentsInput>, res: Response) => {
  const { types } = req.body;
  const establishments = !!types ? await findEstablishmentByType(types) : await getAllEstablishments();
  if (!establishments.length) return res.status(404).json({ message: 'No establishments found' });
  return res.status(200).json({ establishments: establishments.map((e) => omit(e.toJSON(), privateFields)) });
};

export const getEstablishmentHandler = async (req: Request<getEstablishmentInput>, res: Response) => {
  const { id } = req.params;
  const establishment = await findEstablishmentById(id);
  if (!establishment) return res.status(404).json({ message: 'Establishment not found' });
  return res.status(200).json({ establishment: omit(establishment.toJSON(), privateFields) });
};
