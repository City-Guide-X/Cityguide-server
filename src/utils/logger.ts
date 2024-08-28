import dayjs from 'dayjs';
import logger from 'pino';

const log = logger({
  transport: {
    target: 'pino-pretty',
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time": "${dayjs().format('hh:mma | ddd, D MMM YYYY')}"`,
});

export default log;
