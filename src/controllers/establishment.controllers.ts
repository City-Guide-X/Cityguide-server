import { privateFields } from '@models';
import { createEstablishmentInput, loginEstablishmentInput } from '@schemas';
import { createEstablishment, findEstablishmentByEmail, setEstablishmentRefreshToken, signTokens } from '@services';
import { sendEmail } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createEstablishmentHandler = async (req: Request<{}, {}, createEstablishmentInput>, res: Response) => {
  const body = req.body;
  try {
    const establishment = await createEstablishment(body);
    await sendEmail({
      to: establishment.email,
      template: 'verifyUser',
      locals: {
        name: establishment.name,
        verifyCode: establishment.otp,
      },
    });
    const { accessToken, refreshToken } = signTokens({
      id: establishment._id.toString(),
      type: 'ESTABLISHMENT',
    });
    await setEstablishmentRefreshToken(establishment._id.toString(), refreshToken!);
    return res.status(201).json({ user: omit(establishment.toJSON(), privateFields), accessToken });
  } catch (err: any) {
    if (err.code === 11000)
      return res.status(409).json({
        message: `Establishment with ${err.keyValue.phoneNumber || err.keyValue.email} already exists`,
      });
  }
};

export const loginEstablishmentHandler = async (req: Request<{}, {}, loginEstablishmentInput>, res: Response) => {
  const { email, password } = req.body;
  const message = 'Invalid email or password';
  const establishment = await findEstablishmentByEmail(email);
  if (!establishment) return res.status(401).json({ message });
  const isEstablishment = await establishment.validatePassword(password);
  if (!isEstablishment) return res.status(401).json({ message });
  const { accessToken, refreshToken } = signTokens({
    id: establishment._id.toString(),
    type: 'ESTABLISHMENT',
  });
  await setEstablishmentRefreshToken(establishment._id.toString(), refreshToken!);
  return res.status(201).json({
    user: omit(establishment.toJSON(), privateFields),
    accessToken,
  });
};
