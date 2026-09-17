import { verifyJwt } from "../utils/jwt.js";

function verifyToken(req, res, next) {
  try {
    const authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];
    const payload = verifyJwt(token);
    req.payload = payload;
    next();
  } catch (error) {
    res.status(401).json({ errorMessage: "No valid token" });
  }
}

export { verifyToken };
