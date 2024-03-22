import { privateFields } from '@models';
import { createEstablishmentInput } from '@schemas';
import {
  createEstablishment,
  setEstablishmentRefreshToken,
  signAccessToken,
  signRefreshToken,
} from '@services';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createEstablishmentHandler = async (
  req: Request<{}, {}, createEstablishmentInput>,
  res: Response
) => {
  const body = req.body;
  try {
    const establishment = await createEstablishment(body);
    const accessToken = signAccessToken(establishment._id.toString(), 'USER');
    const refreshToken = signRefreshToken(establishment._id.toString(), 'USER');
    await setEstablishmentRefreshToken(
      establishment._id.toString(),
      refreshToken
    );
    res
      .status(201)
      .json({ user: omit(establishment.toJSON(), privateFields), accessToken });
  } catch (err: any) {
    if (err.code === 11000)
      return res.status(409).json({
        message: `Establishment with ${
          err.keyValue.phoneNumber || err.keyValue.email
        } already exists`,
      });
  }
};
