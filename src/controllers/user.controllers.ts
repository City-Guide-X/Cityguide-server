import { privateFields, User } from '@models';
import { createUserInput, loginUserInput } from '@schemas';
import {
  createUser,
  findUserByEmail,
  setUserRefreshToken,
  signTokens,
} from '@services';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createUserHandler = async (
  req: Request<{}, {}, createUserInput>,
  res: Response
) => {
  const body = req.body;
  try {
    const user = await createUser(body);
    const { accessToken, refreshToken } = signTokens({
      id: user._id.toString(),
      type: 'USER',
    });
    await setUserRefreshToken(user._id.toString(), refreshToken!);
    return res
      .status(201)
      .json({ user: omit(user.toJSON(), privateFields), accessToken });
  } catch (err: any) {
    if (err.code === 11000)
      return res.status(409).json({
        message: `User with ${
          err.keyValue.phoneNumber || err.keyValue.email
        } already exists`,
      });
  }
};

export const loginUserHandler = async (
  req: Request<{}, {}, loginUserInput>,
  res: Response
) => {
  const { email, password } = req.body;
  const message = 'Invalid email or password';
  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message });
  const isUser = await user.validatePassword(password);
  if (!isUser) return res.status(401).json({ message });
  const { accessToken, refreshToken } = signTokens({
    id: user._id.toString(),
    type: 'USER',
  });
  await setUserRefreshToken(user._id.toString(), refreshToken!);
  return res
    .status(200)
    .json({ user: omit(user.toJSON(), privateFields), accessToken });
};

export const socialAuthHandler = async (req: Request, res: Response) => {
  const data = req.user as Partial<User>;
  console.log(data);
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
    });
    await setUserRefreshToken(user._id.toString(), refreshToken!);
    return res
      .status(200)
      .json({ user: omit(user.toJSON(), privateFields), accessToken });
  } else {
    const user = await createUser(data);
    const { accessToken, refreshToken } = signTokens({
      id: user._id.toString(),
      type: 'USER',
    });
    await setUserRefreshToken(user._id.toString(), refreshToken!);
    return res
      .status(201)
      .json({ user: omit(user.toJSON(), privateFields), accessToken });
  }
};
