const verifyCode = (): number => {
  let code = Math.floor(Math.random() * 9) + 1;
  for (let i = 1; i < 6; i++) code = code * 10 + Math.floor(Math.random() * 10);
  return code;
};

export default verifyCode;
