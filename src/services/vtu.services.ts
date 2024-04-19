import axios from 'axios';
import { encode } from 'base-64';
import { get, put } from 'memory-cache';

export type Providers = 'AIRTEL' | 'MTN' | 'ETISALAT' | 'GLO';

const MAIN_C_SECRET = process.env.QUICKTELLER_CLIENT_SECRET;
const MAIN_C_ID = process.env.QUICKTELLER_CLIENT_ID;
const DATA = { AIRTEL: 687, MTN: 4444, GLO: 15944, ETISALAT: 120 };
const TOP_UP = { AIRTEL: 17570, ETISALAT: 120, GLO: 402, MTN: 109 };
interface IPurchase {
  PaymentCode: string;
  CustomerId: string;
  CustomerEmail: string;
  CustomerMobile: string;
  Amount: number;
  requestReference: string;
}

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

export const getBillers = async (serviceId: Providers, type: 'data' | 'airtime') => {
  const token = await getToken();
  return axios({
    method: 'GET',
    url: 'https://qa.interswitchng.com/quicktellerservice/api/v5/services/options',
    headers: {
      Authorization: `Bearer ${token}`,
      terminalId: process.env.QUICKTELLER_TERMINAL_ID,
    },
    params: { serviceId: type === 'data' ? DATA[serviceId] : TOP_UP[serviceId] },
  });
};

export const getAllBillers = async () => {
  const token = await getToken();
  return axios({
    method: 'GET',
    url: 'https://qa.interswitchng.com/quicktellerservice/api/v5/services',
    headers: {
      Authorization: `Bearer ${token}`,
      terminalId: process.env.QUICKTELLER_TERMINAL_ID,
    },
    params: { categoryId: 4 },
  });
};

export const validateUser = async () => {
  const token = await getToken();
  return axios({
    method: 'POST',
    url: 'https://qa.interswitchng.com/quicktellerservice/api/v5/Transactions/validatecustomers',
    headers: {
      Authorization: `Bearer ${token}`,
      terminalId: process.env.QUICKTELLER_TERMINAL_ID,
    },
    data: {
      customers: [
        {
          PaymentCode: '48001',
          CustomerId: '08058731812',
        },
      ],
      TerminalID: process.env.QUICKTELLER_TERMINAL_ID,
    },
  });
};

export const initPurchase = async (data: IPurchase) => {
  const token = await getToken();
  return axios({
    method: 'POST',
    url: 'https://qa.interswitchng.com/quicktellerservice/api/v5/Transactions',
    headers: {
      Authorization: `Bearer ${token}`,
      terminalId: process.env.QUICKTELLER_TERMINAL_ID,
    },
    data,
  });
};

export const getTransactionStatus = async (requestRef: string) => {
  const token = await getToken();
  return axios({
    method: 'GET',
    url: 'https://qa.interswitchng.com/quicktellerservice/api/v5/Transactions',
    headers: {
      Authorization: `Bearer ${token}`,
      terminalId: process.env.QUICKTELLER_TERMINAL_ID,
    },
    params: {
      requestRef,
    },
  });
};

export const getAirtimeBillers = () => {
  return axios({
    method: 'GET',
    url: 'https://api.flutterwave.com/v3/top-bill-categories',
    headers: {
      Authorization: `Bearer ${process.env.FW_SECRET_KEY}`,
    },
    params: { country: 'NG' },
  });
};
