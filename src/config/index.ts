import dotenv from 'dotenv';
import path from 'path';


dotenv.config({path: path.join(process.cwd(), '.env')})

// console.log(process.cwd());

export default {
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    appUrl: process.env.APP_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_secret: process.env.JWT_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expiration: process.env.JWT_ACCESS_EXPIRATION,
    jwt_refresh_expiration: process.env.JWT_REFRESH_EXPIRATION,
}