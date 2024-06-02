import { IPayload } from '@types';
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
