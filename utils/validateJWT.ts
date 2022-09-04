import { JWT_SIGNATURE } from "./keys"
import JWT from 'jsonwebtoken';

export const validateJWT = (authorization: string | null) => {
  let payload;
  if (!authorization || !(authorization && (payload = JWT.verify(authorization, JWT_SIGNATURE))))
    return null;

  return payload as {
    userId: number
  };
}