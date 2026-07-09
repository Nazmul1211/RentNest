import type { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  }) as SignOptions;

  return token;
};

const verifyToken = (accessToken: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(accessToken, secret as string);
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
