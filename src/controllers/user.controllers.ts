import { AuthenticationError, BadRequestError, ConflictError, NotFoundError } from '@errors';
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
import { asyncWrapper } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createUserHandler = asyncWrapper(async (req: Request<{}, {}, createUserInput>, res: Response) => {
  const body = req.body;
  const user = await createUser(body);
  // await sendEmail({
  //   to: user.email,
  //   template: 'verificationCode',
  //   locals: {
  //     name: `${user.firstName} ${user.lastName}`,
  //     verifyCode: user.otp,
  //   },
  // });
  const { accessToken, refreshToken } = signTokens({
    id: user._id.toString(),
    type: 'USER',
    isPartner: user.isPartner,
  });
  await setUserRefreshToken(user._id.toString(), refreshToken!);
  return res.status(201).json({ user: omit(user.toJSON(), privateFields), accessToken });
});

export const loginUserHandler = asyncWrapper(async (req: Request<{}, {}, loginUserInput>, res: Response) => {
  const { email, password } = req.body;
  const message = 'Invalid email or password';
  const user = await findUserByEmail(email);
  if (!user) throw new AuthenticationError(message);
  const isUser = await user.validatePassword(password);
  if (!isUser) throw new AuthenticationError(message);
  const { accessToken, refreshToken } = signTokens({
    id: user._id.toString(),
    type: 'USER',
    isPartner: user.isPartner,
  });
  await setUserRefreshToken(user._id.toString(), refreshToken!);
  return res.status(200).json({ user: omit(user.toJSON(), privateFields), accessToken });
});

export const socialAuthHandler = asyncWrapper(async (req: Request, res: Response) => {
  const data = req.user as Partial<User>;
  if (!data) throw new AuthenticationError('Invalid social login data');
  const user = await findUserByEmail(data.email!);
  if (user) {
    if (!user.isSocial) throw new ConflictError();
    const { accessToken, refreshToken } = signTokens({
      id: user._id.toString(),
      type: 'USER',
      isPartner: user.isPartner,
    });
    await setUserRefreshToken(user._id.toString(), refreshToken!);
    return res.status(200).json({ user: omit(user.toJSON(), privateFields), accessToken });
  } else {
    const user = await createUser(data);
    const { accessToken, refreshToken } = signTokens({
      id: user._id.toString(),
      type: 'USER',
      isPartner: user.isPartner,
    });
    await setUserRefreshToken(user._id.toString(), refreshToken!);
    return res.status(201).json({ user: omit(user.toJSON(), privateFields), accessToken });
  }
});

export const getUserProfileHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const user = await findUserById(id);
  if (!user) throw new NotFoundError();
  return res.status(200).json({ user: omit(user.toJSON(), privateFields) });
});

export const updateUserHandler = asyncWrapper(async (req: Request<{}, {}, updateUserInput>, res: Response) => {
  const { id } = res.locals.user;
  const body = req.body;
  const isUpdated = await updateUserInfo(id, body);
  if (!isUpdated.modifiedCount) throw new BadRequestError('Could not update user info');
  return res.sendStatus(204);
});

export const getEstablishmentsHandler = asyncWrapper(
  async (req: Request<{}, {}, getEstablishmentsInput>, res: Response) => {
    const { types } = req.body;
    const establishments = !!types ? await findEstablishmentByType(types) : await getAllEstablishments();
    if (!establishments.length) throw new NotFoundError('No establishments found');
    return res.status(200).json({ establishments: establishments.map((e) => omit(e.toJSON(), privateFields)) });
  }
);

export const getEstablishmentHandler = asyncWrapper(async (req: Request<getEstablishmentInput>, res: Response) => {
  const { id } = req.params;
  const establishment = await findEstablishmentById(id);
  if (!establishment) throw new NotFoundError('Establishment not found');
  return res.status(200).json({ establishment: omit(establishment.toJSON(), privateFields) });
});
