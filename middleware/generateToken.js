// file to generate the token

// importing the required modules
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const generateToken = (email, role = "user") => {
  const secretKey = process.env.JWT_SECRET_KEY;

  if (!secretKey) {
    throw new Error("no secret key is provided");
  }

  const payload = {
    email: email,
    role: role,
  };

  return jwt.sign(payload, secretKey, { expiresIn: "72h" });
};
