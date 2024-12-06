// file to establish the connection with the database

// importing the required modules
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.PG_SQL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// connecting
export const connection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("database connected successfully", result.rows[0].now);
    client.release();
  } catch (error) {
    console.error("error", error);
  }
};
