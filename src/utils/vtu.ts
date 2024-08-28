import axios from 'axios';
import { encode } from 'base-64';
import { get, put } from 'memory-cache';

const MAIN_C_SECRET = process.env.QUICKTELLER_CLIENT_SECRET;
const MAIN_C_ID = process.env.QUICKTELLER_CLIENT_ID;

export const getToken = async () => {
  const accessToken = get('quickteller_access_token');
  if (accessToken) return accessToken;
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://passport.k8.isw.la/passport/oauth/token',
      headers: {
        Authorization: `Basic ${encode(`${MAIN_C_ID}:${MAIN_C_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: { grant_type: 'client_credentials', scope: 'profile' },
    });
    const expiresIn = res.data.expires_in * 1000;
    put('quickteller_access_token', res.data.access_token, expiresIn);
    return res.data.access_token;
  } catch (err: any) {
    console.log(err.response);
  }
};
