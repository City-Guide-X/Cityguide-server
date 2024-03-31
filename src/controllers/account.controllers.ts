import {
  deleteEstablishment,
  deleteUser,
  findEstablishmentById,
  findUserById,
  setEstablishmentRefreshToken,
  setUserRefreshToken,
  signTokens,
} from '@services';
import { IPayload } from '@types';
import { sendEmail, verifyCode, verifyJWT } from '@utils';
import { Request, Response } from 'express';
import { changePasswordInput, verifyEmailInput } from 'src/schemas/account.schemas';

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
    if (!user.emailIsVerified) user.emailIsVerified = true;
    user.otp = null;
    await user.save();
    return res.sendStatus(204);
  }
  return res.status(400).json({ message });
};

export const sendVerifyEmailHandler = async (req: Request, res: Response) => {
  const { id, type } = res.locals.user;
  let user, name, otp;
  if (type === 'USER') {
    user = await findUserById(id);
    name = `${user?.firstName} ${user?.lastName}`;
  } else {
    user = await findEstablishmentById(id);
    name = user?.name;
  }
  if (!user) return res.sendStatus(404);
  if (!user.otp) {
    user.otp = otp = verifyCode();
    await user.save();
  }
  await sendEmail({
    to: user.email,
    template: 'verificationCode',
    locals: { name, verifyCode: otp ?? user.otp },
  });
  return res.sendStatus(204);
};

export const uploadImageHandler = async (req: Request, res: Response) => {
  const imgUrl = req.file?.path;
  if (!imgUrl) return res.status(400).json({ message: 'Upload failed' });
  return res.status(200).json({ imgUrl });
};

export const changePasswordHandler = async (
  req: Request<changePasswordInput['params'], {}, changePasswordInput['body']>,
  res: Response
) => {
  const {
    body: { password },
    params: { otp },
  } = req;
  const { id, type } = res.locals.user;
  const user = type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
  if (!user || !user.otp || user.otp !== +otp) return res.status(400).json({ message: 'Invalid OTP code' });
  if (!user.emailIsVerified) user.emailIsVerified = true;
  user.otp = null;
  user.password = password;
  await user.save();
  return res.sendStatus(204);
};

export const logoutHandler = async (req: Request, res: Response) => {
  const { id, type } = res.locals.user;
  const user = type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
  if (!user) return res.sendStatus(204);
  if (type === 'USER') await setUserRefreshToken(id, null);
  else await setEstablishmentRefreshToken(id, null);
  return res.sendStatus(204);
};

export const deleteAccountHandler = async (req: Request, res: Response) => {
  const { id, type } = res.locals.user;
  const user = type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
  if (!user) return res.sendStatus(204);
  if (type === 'USER') await deleteUser(id);
  else await deleteEstablishment(id);
  return res.sendStatus(204);
};

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).json({ message: "This route doesn't exist" });
};
