import { AuthorizationError, BadRequestError, NotFoundError } from '@errors';
import { User } from '@models';
import {
  changeCancellationPolicyInput,
  changePasswordInput,
  refreshAccessTokenInput,
  verifyEmailInput,
} from '@schemas';
import {
  changeEstablishmentCancellationPolicy,
  changeUserCancellationPolicy,
  deleteEstablishment,
  deleteUser,
  findEstablishmentById,
  findUserById,
  setEstablishmentRefreshToken,
  setUserRefreshToken,
  signTokens,
} from '@services';
import { IPayload } from '@types';
import { asyncWrapper, sendEmail, verifyCode, verifyJWT } from '@utils';
import { Request, Response } from 'express';

export const refreshAccessTokenHandler = asyncWrapper(
  async (req: Request<{}, {}, refreshAccessTokenInput>, res: Response) => {
    const { refreshToken } = req.body;
    const decoded = verifyJWT<IPayload>(refreshToken, 'refresh');
    if (!decoded) throw new AuthorizationError();
    const { id, type } = decoded;
    const user = type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
    if (!user) throw new NotFoundError();
    if (refreshToken !== user.refreshToken) throw new AuthorizationError();
    const isPartner = type === 'USER' ? (user as User).isPartner : true;
    const { accessToken } = signTokens({ id, type, isPartner, token: 'access' });
    return res.status(200).json({ accessToken });
  }
);

export const verifyEmailHandler = asyncWrapper(async (req: Request<verifyEmailInput>, res: Response) => {
  const { otp } = req.params;
  const { id, type } = res.locals.user;
  const message = 'Verification failed';
  const user = type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
  if (!user) throw new NotFoundError(message);
  if (user.emailIsVerified) return res.sendStatus(204);
  if (user.otp === +otp) {
    if (!user.emailIsVerified) user.emailIsVerified = true;
    user.otp = null;
    await user.save();
    return res.sendStatus(204);
  }
  throw new BadRequestError(message);
});

export const sendVerifyEmailHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id, type } = res.locals.user;
  let user, name, otp;
  if (type === 'USER') {
    user = await findUserById(id);
    name = `${user?.firstName} ${user?.lastName}`;
  } else {
    user = await findEstablishmentById(id);
    name = user?.name;
  }
  if (!user) throw new NotFoundError();
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
});

export const changeCancellationPolicyHandler = asyncWrapper(
  async (req: Request<{}, {}, changeCancellationPolicyInput>, res: Response) => {
    const { id, type } = res.locals.user;
    const cancellation = req.body;
    const isUpdated =
      type === 'USER'
        ? await changeUserCancellationPolicy(id, cancellation)
        : await changeEstablishmentCancellationPolicy(id, cancellation);
    if (!isUpdated.modifiedCount) throw new BadRequestError('Could not change cancellation policy');
    return res.sendStatus(204);
  }
);

export const uploadImageHandler = asyncWrapper(async (req: Request, res: Response) => {
  const imgUrls = req.files as Express.Multer.File[];
  if (!imgUrls?.length) throw new BadRequestError('Upload failed');
  res.status(200).json({ imgUrls: imgUrls.map((file: any) => file.path) });
});

export const changePasswordHandler = asyncWrapper(
  async (req: Request<changePasswordInput['params'], {}, changePasswordInput['body']>, res: Response) => {
    const {
      body: { password },
      params: { otp },
    } = req;
    const { id, type } = res.locals.user;
    const user = type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
    if (!user || !user.otp || user.otp !== +otp) throw new BadRequestError('Invalid OTP code');
    if (!user.emailIsVerified) user.emailIsVerified = true;
    user.otp = null;
    user.password = password;
    await user.save();
    return res.sendStatus(204);
  }
);

export const logoutHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id, type } = res.locals.user;
  const user = type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
  if (!user) return res.sendStatus(204);
  if (type === 'USER') await setUserRefreshToken(id, null);
  else await setEstablishmentRefreshToken(id, null);
  return res.sendStatus(204);
});

export const deleteAccountHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id, type } = res.locals.user;
  const user = type === 'USER' ? await findUserById(id) : await findEstablishmentById(id);
  if (!user) return res.sendStatus(204);
  if (type === 'USER') await deleteUser(id);
  else await deleteEstablishment(id);
  return res.sendStatus(204);
});

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).json({ message: "This route doesn't exist" });
};
