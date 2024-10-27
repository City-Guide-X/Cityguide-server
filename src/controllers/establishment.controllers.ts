import { AuthenticationError, BadRequestError, NotFoundError } from '@errors';
import { privateFields } from '@models';
import { createEstablishmentInput, loginEstablishmentInput, updateEstablishmentInput } from '@schemas';
import {
  createEstablishment,
  findEstablishmentByEmail,
  findEstablishmentById,
  setEstablishmentRefreshToken,
  signTokens,
  updateEstablishmentInfo,
} from '@services';
import { EntityType } from '@types';
import { asyncWrapper, sanitize, sendEmail } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createEstablishmentHandler = asyncWrapper(
  async (req: Request<{}, {}, createEstablishmentInput>, res: Response) => {
    const body = req.body;
    const establishment = await createEstablishment(body);
    await sendEmail({
      to: establishment.email,
      template: 'verificationCode',
      locals: {
        name: establishment.name,
        verifyCode: establishment.otp,
      },
    });
    const { accessToken, refreshToken } = signTokens({
      id: establishment._id.toString(),
      type: EntityType.ESTABLISHMENT,
      isPartner: true,
    });
    await setEstablishmentRefreshToken(establishment._id.toString(), refreshToken!);
    return res
      .status(201)
      .json({ establishment: sanitize(establishment.toJSON(), privateFields), accessToken, refreshToken });
  }
);

export const loginEstablishmentHandler = asyncWrapper(
  async (req: Request<{}, {}, loginEstablishmentInput>, res: Response) => {
    const { email, password } = req.body;
    const message = 'Invalid email or password';
    const establishment = await findEstablishmentByEmail(email);
    if (!establishment) throw new AuthenticationError(message);
    const isEstablishment = await establishment.validatePassword(password);
    if (!isEstablishment) throw new AuthenticationError(message);
    const { accessToken, refreshToken } = signTokens({
      id: establishment._id.toString(),
      type: EntityType.ESTABLISHMENT,
      isPartner: true,
    });
    await setEstablishmentRefreshToken(establishment._id.toString(), refreshToken!);
    return res.status(200).json({
      establishment: sanitize(establishment.toJSON(), privateFields),
      accessToken,
      refreshToken,
    });
  }
);

export const getEstablishmentProfileHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const establishment = await findEstablishmentById(id);
  if (!establishment) throw new NotFoundError();
  return res.status(200).json({ establishment: sanitize(establishment.toJSON(), privateFields) });
});

export const updateEstablishmentHandler = asyncWrapper(
  async (req: Request<{}, {}, updateEstablishmentInput>, res: Response) => {
    const { id } = res.locals.user;
    const body = req.body;
    const isUpdated = await updateEstablishmentInfo(id, body);
    if (!isUpdated.modifiedCount) throw new BadRequestError('Could not update establishment info');
    return res.sendStatus(204);
  }
);
