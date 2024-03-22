import { signJWT } from '@utils';

export const signAccessToken = (id: string, type: 'USER' | 'ESTABLISHMENT') => {
  const accessToken = signJWT({ id, type }, 'access', {
    expiresIn: process.env.ACCESSTOKENTTL,
  });
  return accessToken;
};

export const signRefreshToken = (
  id: string,
  type: 'USER' | 'ESTABLISHMENT'
) => {
  const refreshToken = signJWT({ id, type }, 'refresh', {
    expiresIn: process.env.REFRESHTOKENTTL,
  });
  return refreshToken;
};
