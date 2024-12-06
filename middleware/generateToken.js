// file to generate the token

// importing the required modules
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const generateToken = (email) => {
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    throw new Error("no secret key is provided");
  }

  return jwt.sign(email, secretKey, { expiresIn: "72h" });
};
