import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretkey123";

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
};
