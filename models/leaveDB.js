// file to create the database for the leave

// importing the required modules
import { pool } from "../config/db.js";

// creating the schema
export const leaveTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS leaveData (
      leave_id SERIAL PRIMARY KEY,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      reason TEXT NOT NULL,
      status VARCHAR(15) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
      type VARCHAR(15) NOT NULL CHECK (type IN ('Casual', 'Sick', 'Annual')),
      username VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(query);
    console.log("leave table created");
    client.release();
  } catch (error) {
    console.error("error", error);
    throw new Error(error);
  }
};
