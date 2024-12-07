// file to handle the leave of the employees

// importing the required modules
import { pool } from "../config/db.js";

// controller
export const leaveController = {
  // for requesting leave
  requestLeave: async (req, res) => {
    const client = await pool.connect();
    try {
      const { startDate, endDate, username, email, reason, leave_type } =
        req.body;

      const existingUser = "SELECT * FROM employee WHERE email = $1";
      const exist = await client.query(existingUser, [email]);

      const user = exist.rows[0];
      if (!user) {
        return res.status(400).json({ message: "user not found" });
      }

      // for adding the leave to the leave db
      const query = `
      INSERT INTO leaveData(startDate,endDate, username, email,reason, leave_type, status)
      VALUES($1, $2,$3, $4,$5,$6,$7)
      RETURNING *;
      `;

      const status = "pending";

      const result = await client.query(query, [
        startDate,
        endDate,
        username,
        email,
        reason,
        leave_type,
        status,
      ]);
      res.status(201).json({ data: result.rows[0] });
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  },

  // for viewing the status of the leave of a particular employee
  leaveStatus: async (req, res) => {
    const client = await pool.connect();
    try {
      const email = req.user.email;

      const query = `
            SELECT leave_id, startDate, endDate, reason, status,type
            from leaveData
            WHERE email = $1 
            ORDER BY startDate DESC;
        `;

      const result = await client.query(query, [email]);

      if (result.rows.length === 0) {
        return res.status(400).json({ message: "no leaves applied" });
      }
      res.status(200).json({
        message: "Leave requests fetched successfully",
        leaves: result.rows,
      });
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  },
};
