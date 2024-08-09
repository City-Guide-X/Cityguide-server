const verifyCode = (): number => {
  let code = '';
  for (let i = 0; i < 6; i++) code += Math.floor(Math.random() * 10);
  return parseInt(code);
};

export default verifyCode;
