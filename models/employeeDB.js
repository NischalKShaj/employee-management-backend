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
      role VARCHAR(15) NOT NULL CHECK (role IN ('Developer', 'Manager', 'HR', 'Tester', 'DevOps', 'Sales')),
      age INT NOT NULL,
      is_blocked BOOLEAN DEFAULT false,
      is_deleted BOOLEAN DEFAULT false
    );
  `;
  try {
    const client = await pool.connect();
    console.log("Attempting to create or validate employee table schema...");
    await client.query(query);
    console.log("Employee table created/validated successfully");
    client.release();
  } catch (error) {
    console.error("Error while creating/validating the employee table:", error);
    throw new Error(error);
  }
};
