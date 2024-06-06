import { NightLifeModel, RestaurantModel, StayModel } from '@models';
import { IPayload, PropertyType } from '@types';
import { signJWT } from '@utils';

interface IToken extends IPayload {
  token?: 'access' | 'refresh' | 'both';
}

export const signTokens = ({ id, type, isPartner, token = 'both' }: IToken) => {
  let accessToken, refreshToken;
  if (token !== 'refresh') {
    accessToken = signJWT({ id, type, isPartner }, 'access', {
      expiresIn: process.env.ACCESSTOKENTTL,
    });
  }
  if (token !== 'access') {
    refreshToken = signJWT({ id, type, isPartner }, 'refresh', {
      expiresIn: process.env.REFRESHTOKENTTL,
    });
  }
  return { accessToken, refreshToken };
};

export const isPropertyType = async (_id: string, type: PropertyType) => {
  if (type === PropertyType.STAY) return await StayModel.exists({ _id });
  if (type === PropertyType.RESTAURANT) return await RestaurantModel.exists({ _id });
  if (type === PropertyType.NIGHTLIFE) return await NightLifeModel.exists({ _id });
};
