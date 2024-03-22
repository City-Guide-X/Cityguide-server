import 'dotenv/config';
import { log } from '@utils';
import app from './app';
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(String(process.env.DB_URI));
  } catch (err) {
    process.exit(1);
  }
};
connectDB();

const port = process.env.PORT;

mongoose.connection.once('open', () => {
  app.listen(port, () => log.info(`Server listening on port ${port}...`));
});
