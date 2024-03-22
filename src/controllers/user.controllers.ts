import { privateFields } from '@models';
import { createUserInput, loginUserInput } from '@schemas';
import {
  createUser,
  findUserByEmail,
  setUserRefreshToken,
  signAccessToken,
  signRefreshToken,
} from '@services';
import { log } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createUserHandler = async (
  req: Request<{}, {}, createUserInput>,
  res: Response
) => {
  const body = req.body;
  try {
    const user = await createUser(body);
    const accessToken = signAccessToken(user._id.toString(), 'USER');
    const refreshToken = signRefreshToken(user._id.toString(), 'USER');
    await setUserRefreshToken(user._id.toString(), refreshToken);
    res
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
  const isUser = await user?.validatePassword(password);
  if (!isUser) return res.status(401).json({ message });
  const accessToken = signAccessToken(user._id.toString(), 'USER');
  const refreshToken = signRefreshToken(user._id.toString(), 'USER');
  await setUserRefreshToken(user._id.toString(), refreshToken);
  res
    .status(200)
    .json({ user: omit(user.toJSON(), privateFields), accessToken });
};
