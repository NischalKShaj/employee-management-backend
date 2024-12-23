// // file to create the JWT for the user

// importing the required modules
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// creating the authentication middleware
export const authenticateAdminJwt = async (req, res, next) => {
  const token =
    req.cookies.access_token || req.headers["authorization"] || null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const actualToken = token.startsWith("Bearer ")
    ? token.slice(7, token.length)
    : token;

  try {
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access forbidden: Admins only" });
    }
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    return res.status(401).json({ message: "Invalid Token" });
  }
};
