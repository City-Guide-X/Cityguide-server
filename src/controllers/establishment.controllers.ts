import { AuthenticationError, BadRequestError, NotFoundError } from '@errors';
import { privateFields } from '@models';
import {
  // addMenuImgInput,
  // addMenuRoomInput,
  createEstablishmentInput,
  loginEstablishmentInput,
  // removeMenuRoomInput,
  // removeMenyImgInput,
  updateEstablishmentInput,
} from '@schemas';
import {
  // addMenuImg,
  // addMenuItem,
  // addRoom,
  createEstablishment,
  findEstablishmentByEmail,
  findEstablishmentById,
  // removeMenuImg,
  // removeMenuItem,
  // removeRoom,
  setEstablishmentRefreshToken,
  signTokens,
  updateEstablishmentInfo,
} from '@services';
import { PropertyType } from '@types';
import { asyncWrapper, sendEmail } from '@utils';
import { Request, Response } from 'express';
import { omit } from 'lodash';

export const createEstablishmentHandler = asyncWrapper(
  async (req: Request<{}, {}, createEstablishmentInput>, res: Response) => {
    const body = req.body;
    const establishment = await createEstablishment(body);
    // await sendEmail({
    //   to: establishment.email,
    //   template: 'verificationCode',
    //   locals: {
    //     name: establishment.name,
    //     verifyCode: establishment.otp,
    //   },
    // });
    const { accessToken, refreshToken } = signTokens({
      id: establishment._id.toString(),
      type: 'ESTABLISHMENT',
      isPartner: true,
    });
    await setEstablishmentRefreshToken(establishment._id.toString(), refreshToken!);
    return res.status(201).json({ establishment: omit(establishment.toJSON(), privateFields), accessToken });
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
      type: 'ESTABLISHMENT',
      isPartner: true,
    });
    await setEstablishmentRefreshToken(establishment._id.toString(), refreshToken!);
    return res.status(201).json({
      establishment: omit(establishment.toJSON(), privateFields),
      accessToken,
    });
  }
);

export const getEstablishmentProfileHandler = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  const establishment = await findEstablishmentById(id);
  if (!establishment) throw new NotFoundError();
  return res.status(200).json({ establishment: omit(establishment.toJSON(), privateFields) });
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

// export const addMenuRoomHandler = async (req: Request<{}, {}, addMenuRoomInput>, res: Response) => {
//   const { id } = res.locals.user;
//   const { data, type } = req.body;
//   const establishment = await findEstablishmentById(id);
//   if (!establishment) return res.status(404).json({ message: 'Establishment not found' });
//   if (
//     (establishment.type !== EstablishmentType.STAY && type === 'ROOM') ||
//     (establishment.type !== EstablishmentType.RESTAURANT && type === 'MENU')
//   )
//     return res.status(403).json({ message: 'Invalid Operation' });
//   const isUpdated = type === 'MENU' ? await addMenuItem(id, data) : await addRoom(id, data);
//   if (!isUpdated.modifiedCount) return res.status(400).json({ message: 'Operation failed' });
//   return res.sendStatus(204);
// };

// export const removeMenuRoomHandler = async (req: Request<{}, {}, removeMenuRoomInput>, res: Response) => {
//   const { id } = res.locals.user;
//   const { itemIds, type } = req.body;
//   const establishment = await findEstablishmentById(id);
//   if (!establishment) return res.status(404).json({ message: 'Establishment not found' });
//   if (
//     (establishment.type !== EstablishmentType.STAY && type === 'ROOM') ||
//     (establishment.type !== EstablishmentType.RESTAURANT && type === 'MENU')
//   )
//     return res.status(403).json({ message: 'Invalid Operation' });
//   const isUpdated = type === 'MENU' ? await removeMenuItem(id, itemIds) : await removeRoom(id, itemIds);
//   if (!isUpdated.modifiedCount) return res.status(400).json({ message: 'Operation failed' });
//   return res.sendStatus(204);
// };

// export const addMenuImgHandler = async (req: Request<{}, {}, addMenuImgInput>, res: Response) => {
//   const { id } = res.locals.user;
//   const { images } = req.body;
//   const establishment = await findEstablishmentById(id);
//   if (!establishment) return res.status(404).json({ message: 'Establishment not found' });
//   if (establishment.type !== EstablishmentType.RESTAURANT)
//     return res.status(403).json({ message: 'Invalid Operation' });
//   const isUpdated = await addMenuImg(id, images);
//   if (!isUpdated.modifiedCount) return res.status(400).json({ message: 'Operation failed' });
//   return res.sendStatus(204);
// };

// export const removeMenuImgHandler = async (req: Request<{}, {}, removeMenyImgInput>, res: Response) => {
//   const { id } = res.locals.user;
//   const { itemIds } = req.body;
//   const isUpdated = await removeMenuImg(id, itemIds);
//   if (!isUpdated.modifiedCount) return res.status(400).json({ message: 'Operation failed' });
//   return res.sendStatus(204);
// };
