// file to create the database for the leave

// importing the required modules
import { pool } from "../config/db.js";

// creating the schema
export const leaveTable = async () => {
  const createEnumQuery = `
    DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'leave_type') THEN
            CREATE TYPE leave_type AS ENUM ('Casual', 'Sick', 'Annual');
        END IF;
    END $$;
  `;

  const createStatusEnumQuery = `
    DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'leave_status') THEN
            CREATE TYPE leave_status AS ENUM ('Pending', 'Approved', 'Rejected');
        END IF;
    END $$;
  `;

  const query = `
    CREATE TABLE IF NOT EXISTS leaveData (
     leave_id SERIAL PRIMARY KEY,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      reason TEXT NOT NULL,
     status leave_status NOT NULL DEFAULT 'Pending',
      type leave_type NOT NULL,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createEnumQuery);
    await client.query(createStatusEnumQuery);
    await client.query(query);
    console.log("leave table created");
    client.release();
  } catch (error) {
    console.error("error", error);
    throw new Error(error);
  }
};
