const { CloudinaryStorage } = require('multer-storage-cloudinary');
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cityguide',
    allowed_formats: ['jpg', 'png', 'webp', 'jpeg', 'svg', 'gif'],
    unique_filename: true,
  },
});
const parser = multer({ storage: storage });

export default parser;
