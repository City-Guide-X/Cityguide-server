import { v4 as uuidV4 } from 'uuid';

export const verifyCode = (): number => {
  let code = Math.floor(Math.random() * 9) + 1;
  for (let i = 1; i < 6; i++) code = code * 10 + Math.floor(Math.random() * 10);
  return code;
};

export const refCode = (): string => {
  const [code] = uuidV4().split('-');
  return `RES-${code.toUpperCase()}`;
};
