// eslint-disable-next-line @typescript-eslint/no-var-requires, prettier/prettier
require('dotenv').config();

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};
