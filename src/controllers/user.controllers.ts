import { privateFields } from '@models';
import { createUserInput } from '@schemas';
import {
  createUser,
  setUserRefreshToken,
  signAccessToken,
  signRefreshToken,
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
