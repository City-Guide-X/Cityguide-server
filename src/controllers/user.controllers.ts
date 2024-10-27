import { AuthenticationError, BadRequestError, ConflictError, NotFoundError } from '@errors';
import { privateFields, privatePaymentAuthFields, User } from '@models';
import {
  addCardInput,
  addFavouritePropertyInput,
  createUserInput,
  loginUserInput,
  removeFavouritePropertyInput,
  updateUserInput,
  upgradeUserToPartnerInput,
} from '@schemas';
import {
  addFavouriteProperties,
  createUser,
  findUserByEmail,
  findUserById,
  removeFavouriteProperty,
  setUserRefreshToken,
  signTokens,
  updateUserInfo,
  verifyPayment,
} from '@services';
import { EntityType } from '@types';
import { asyncWrapper, sanitize, sendEmail } from '@utils';
import { Request, Response } from 'express';

export const createUserHandler = asyncWrapper(async (req: Request<{}, {}, createUserInput>, res: Response) => {
  const body = req.body;
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
    type: EntityType.USER,
    isPartner: user.isPartner,
  });
  await setUserRefreshToken(user._id.toString(), refreshToken!);
  return res.status(201).json({ user: sanitize(user.toJSON(), privateFields), accessToken, refreshToken });
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
    type: EntityType.USER,
    isPartner: user.isPartner,
  });
  await setUserRefreshToken(user._id.toString(), refreshToken!);
  return res.status(200).json({
    user: sanitize(user.toJSON(), privateFields, [{ field: 'paymentAuth', fields: privatePaymentAuthFields }]),
    accessToken,
    refreshToken,
  });
});

export const socialAuthHandler = asyncWrapper(async (req: Request, res: Response) => {
  const data = req.user as Partial<User>;
  if (!data) throw new AuthenticationError('Invalid social login data');
  let user = await findUserByEmail(data.email!);
  if (user) {
    if (!user.isSocial) throw new ConflictError();
  } else user = await createUser(data);
  const { accessToken, refreshToken } = signTokens({
    id: user._id.toString(),
    type: EntityType.USER,
    isPartner: user.isPartner,
  });
  await setUserRefreshToken(user._id.toString(), refreshToken!);
  return res.status(200).json({
    user: sanitize(user.toJSON(), privateFields, [{ field: 'paymentAuth', fields: privatePaymentAuthFields }]),
    accessToken,
    refreshToken,
  });
});

export const getUserProfileHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const user = await findUserById(id);
  if (!user) throw new NotFoundError();
  return res.status(200).json({
    user: sanitize(user.toJSON(), privateFields, [{ field: 'paymentAuth', fields: privatePaymentAuthFields }]),
  });
});

export const updateUserHandler = asyncWrapper(async (req: Request<{}, {}, updateUserInput>, res: Response) => {
  const { id } = res.locals.user;
  const body = req.body;
  const isUpdated = await updateUserInfo(id, body);
  if (!isUpdated.modifiedCount) throw new BadRequestError('Could not update user info');
  return res.sendStatus(204);
});

export const addCardHandler = asyncWrapper(async (req: Request<{}, {}, addCardInput>, res: Response) => {
  const { id } = res.locals.user;
  const { reference } = req.body;
  const paymentAuth = await verifyPayment(reference);
  const { matchedCount, modifiedCount } = await updateUserInfo(id, { paymentAuth });
  if (!matchedCount) throw new NotFoundError('User not found');
  if (!modifiedCount) throw new BadRequestError('Could not add card');
  return res.sendStatus(204);
});

export const upgradeUserToPartnerHandler = asyncWrapper(
  async (req: Request<{}, {}, upgradeUserToPartnerInput>, res: Response) => {
    const { id, type } = res.locals.user;
    const body = req.body;
    const isUpdated = await updateUserInfo(id, { ...body, isPartner: true });
    if (!isUpdated.modifiedCount) throw new BadRequestError('Could not upgrade user to partner');
    const { accessToken } = signTokens({ id, type, isPartner: true, token: 'access' });
    return res.status(200).json({ accessToken });
  }
);

export const addFavouritePropertyHandler = asyncWrapper(
  async (req: Request<{}, {}, addFavouritePropertyInput>, res: Response) => {
    const { id } = res.locals.user;
    const property = req.body;
    const isUpdated = await addFavouriteProperties(id, property);
    if (!isUpdated.modifiedCount) throw new BadRequestError('Could not add favourite property');
    return res.sendStatus(204);
  }
);

export const removeFavouritePropertyHandler = asyncWrapper(
  async (req: Request<{}, {}, removeFavouritePropertyInput>, res: Response) => {
    const { id } = res.locals.user;
    const { propertyId } = req.body;
    const isUpdated = await removeFavouriteProperty(id, propertyId);
    if (!isUpdated.modifiedCount) throw new BadRequestError('Could not remove favourite property');
    return res.sendStatus(204);
  }
);
