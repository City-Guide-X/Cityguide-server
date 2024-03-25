import {
  findEstablishmentById,
  findUserById,
  setEstablishmentRefreshToken,
  setUserRefreshToken,
  signTokens,
} from '@services';
import { IPayload } from '@types';
import { sendEmail, verifyJWT } from '@utils';
import { Request, Response } from 'express';
import { verifyEmailInput } from 'src/schemas/core.schemas';

export const refreshAccessTokenHandler = async (req: Request, res: Response) => {
  const { id, type } = res.locals.user;
  const user = type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
  if (!user) return res.sendStatus(403);
  const decoded = verifyJWT<IPayload>(user?.refreshToken as string, 'refresh');
  if (!decoded || id !== decoded.id) return res.sendStatus(403);
  const { accessToken } = signTokens({ id, type, token: 'access' });
  return res.status(200).json({ accessToken });
};

export const verifyEmailHandler = async (req: Request<verifyEmailInput>, res: Response) => {
  const { otp } = req.params;
  const { id, type } = res.locals.user;
  const message = 'Verification failed';
  const user = type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
  if (!user) return res.status(404).json({ message });
  if (user.emailIsVerified) return res.sendStatus(204);
  if (user.otp === +otp) {
    user.emailIsVerified = true;
    await user.save();
    return res.sendStatus(204);
  }
  return res.status(400).json({ message });
};

export const resendVerifyEmailHandler = async (req: Request, res: Response) => {
  const { id, type } = res.locals.user;
  if (type === 'USER') {
    const user = await findUserById(id);
    if (!user) return res.sendStatus(404);
    await sendEmail({
      to: user.email,
      template: 'verifyUser',
      locals: { name: `${user.firstName} ${user.lastName}`, verifyCode: user.otp },
    });
  } else {
    const user = await findEstablishmentById(id);
    if (!user) return res.sendStatus(404);
    await sendEmail({
      to: user.email,
      template: 'verifyUser',
      locals: { name: user.name, verifyCode: user.otp },
    });
  }
  return res.sendStatus(204);
};

export const uploadImageHandler = async (req: Request, res: Response) => {
  const imgUrl = req.file?.path;
  if (!imgUrl) return res.status(400).json({ message: 'Upload failed' });
  return res.status(200).json({ imgUrl });
};

export const logoutHandler = async (req: Request, res: Response) => {
  const { id, type } = res.locals.user;
  const user = type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
  if (!user) return res.sendStatus(204);
  if (type === 'USER') await setUserRefreshToken(id, null);
  else await setEstablishmentRefreshToken(id, null);
  return res.sendStatus(204);
};

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).json({ message: "This route doesn't exist" });
};
