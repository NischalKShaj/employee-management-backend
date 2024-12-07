// file to check whether the user is blocked or not

// importing the required modules
import { pool } from "../config/db.js";

// creating the middleware
export const userBlock = async (req, res, next) => {
  try {
    const email = req.user.email;
    const client = await pool.connect();

    const query = "SELECT * FROM employees WHERE email = $1";
    const result = await client.query(query, [email]);

    if (result.rowCount == 0) {
      return res.status(404).json({ message: "user not found" });
    }

    const { is_blocked } = result.rows[0];
    if (is_blocked) {
      return res.status(403).json({ message: "user is blocked" });
    }
    client.release();
    next();
  } catch (error) {
    throw new Error(error);
  }
};
