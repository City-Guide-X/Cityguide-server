import { VTUTransactionStatus, VTUType } from '@types';

export const airtimeVTUAmounts = [
  { id: 'aitime_50', amount: 50, type: VTUType.AIRTIME, value: '50 NGN' },
  { id: 'aitime_100', amount: 100, type: VTUType.AIRTIME, value: '100 NGN' },
  { id: 'aitime_200', amount: 200, type: VTUType.AIRTIME, value: '200 NGN' },
  { id: 'aitime_500', amount: 500, type: VTUType.AIRTIME, value: '500 NGN' },
  { id: 'aitime_1000', amount: 1000, type: VTUType.AIRTIME, value: '1000 NGN' },
  { id: 'aitime_2000', amount: 2000, type: VTUType.AIRTIME, value: '2000 NGN' },
  { id: 'aitime_5000', amount: 5000, type: VTUType.AIRTIME, value: '5000 NGN' },
  { id: 'aitime_10000', amount: 10000, type: VTUType.AIRTIME, value: '10000 NGN' },
];

export const airtimeDataAmounts = [
  { id: 'data_500', amount: 500, type: VTUType.DATA, value: '500MB' },
  { id: 'data_1000', amount: 1000, type: VTUType.DATA, value: '1GB' },
  { id: 'data_2000', amount: 2000, type: VTUType.DATA, value: '2GB' },
  { id: 'data_5000', amount: 5000, type: VTUType.DATA, value: '5GB' },
  { id: 'data_10000', amount: 10000, type: VTUType.DATA, value: '10GB' },
  { id: 'data_20000', amount: 20000, type: VTUType.DATA, value: '20GB' },
  { id: 'data_50000', amount: 50000, type: VTUType.DATA, value: '50GB' },
  { id: 'data_100000', amount: 100000, type: VTUType.DATA, value: '100GB' },
];

export const defaultStatusProgress: Record<VTUTransactionStatus, Date | null> = {
  [VTUTransactionStatus.CREATED]: null,
  [VTUTransactionStatus.PROCESSING]: null,
  [VTUTransactionStatus.LOCAL_PROCESSING]: null,
  [VTUTransactionStatus.SUCCESSFUL]: null,
  [VTUTransactionStatus.FAILED]: null,
};
