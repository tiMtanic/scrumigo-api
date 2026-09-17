import jwt from "jsonwebtoken";

export function verifyJwt(token) {
  return jwt.verify(token, process.env.TOKEN_SECRET);
}
