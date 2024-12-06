// file to show the database for employee

// importing the required modules
import { pool } from "../config/db.js";

// creating the table
export const employeeTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      gender VARCHAR(15)  NOT NULL,
      role VARCHAR(15) NOT NULL,
      age INT NOT NULL
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(query);
    console.log("employee table created");
    client.release();
  } catch (error) {
    console.error("error", error);
    throw new Error(error);
  }
};
