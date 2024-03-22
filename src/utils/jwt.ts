import { sign, SignOptions, verify } from 'jsonwebtoken';

export const signJWT = (
  payload: Object,
  keyName: 'access' | 'refresh',
  options?: SignOptions | undefined
) => {
  const key =
    keyName === 'access'
      ? process.env.ACCESS_TOKEN_SECRET_KEY
      : process.env.REFRESH_TOKEN_SECRET_KEY;
  return sign(payload, String(key), { ...options, algorithm: 'HS512' });
};

export const verifyJWT = <T>(token: string, keyName: 'access' | 'refresh') => {
  const key =
    keyName === 'access'
      ? process.env.ACCESS_TOKEN_SECRET_KEY
      : process.env.REFRESH_TOKEN_SECRET_KEY;
  try {
    const decoded = verify(token, String(key)) as T;
    return decoded;
  } catch (err) {
    return null;
  }
};
