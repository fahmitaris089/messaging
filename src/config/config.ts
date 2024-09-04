import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3003,
  mongoUri: process.env.URL_MONGODB || "mongodb://root:pass123@103.127.97.52:27017/dhumall?authSource=admin",
};
