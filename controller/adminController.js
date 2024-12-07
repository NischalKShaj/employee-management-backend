// file for admin controller

// importing the required modules
import { pool } from "../config/db.js";
import { generateToken } from "../middleware/generateToken.js";

// creating the admin controller
export const adminController = {
  // for admin login
  adminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
      ) {
        return res.status(400).json({ message: "incorrect credentials" });
      }
      const token = generateToken(email, "admin");
      res
        .cookie("admin_access_token", token, { httpOnly: true, secure: true })
        .status(200)
        .json({ message: "admin logged in", token: token, data: email });
    } catch (error) {
      throw new Error(error);
    }
  },

  // for retrieving the employee
  getEmployees: async (req, res) => {
    const client = await pool.connect();
    try {
      let response;
      const { id } = req.params;
      if (id) {
        const existingUser = "SELECT * FROM employees WHERE id = $1";
        const exist = await client.query(existingUser, [id]);
        const user = exist.rows[0];
        if (!user) {
          return res.status(404).json({ message: "user not found" });
        }
        response = user;
      } else {
        const allEmployees = "SELECT * FROM employees";
        const result = await client.query(allEmployees);
        const employees = result.rows;
        if (employees.length === 0) {
          return res.status(404).json({ message: "no users found" });
        }
        response = employees;
      }
      res.status(200).json({ message: "retrieved data", data: response });
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  },

  // updating the employees
  updateEmployee: async (req, res) => {
    const client = await pool.connect();
    try {
      const { username, password, email, age, gender, role } = req.body;

      const existingUser = "SELECT * FROM employees WHERE email = $1";
      const exist = await client.query(existingUser, [email]);

      const user = exist.rows[0];
      if (!user) {
        return res.status(400).json({ message: "user not found" });
      }

      // for dynamic querying
      const updates = [];
      const values = [];
      let counter = 1;

      // for the updated username
      if (username) {
        const usernameError = validation.nameValidation(username);
        if (usernameError) {
          return res.status(400).json({ message: usernameError });
        }
        updates.push(`username = $${counter}`);
        values.push(username);
        counter++;
      }

      // for updated password
      if (password) {
        const passwordError = validation.passwordValidation(password);
        if (passwordError) {
          return res.status(400).json({ message: passwordError });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.push(`password = $${counter}`);
        values.push(hashedPassword);
        counter++;
      }

      // for gender
      if (gender) {
        const genderError = validation.genderValidation(gender);
        if (genderError) {
          return res.status(400).json({ message: genderError });
        }
        updates.push(`gender = $${counter}`);
        values.push(gender);
        counter++;
      }

      // for age
      if (age) {
        const ageError = validation.ageValidation(age);
        if (ageError) {
          return res.status(400).json({ message: ageError });
        }
        updates.push(`age = $${counter}`);
        values.push(age);
        counter++;
      }

      // for role
      if (role) {
        const roleError = validation.roleValidation(role);
        if (roleError) {
          return res.status(400).json({ message: roleError });
        }
        updates.push(`role = $${counter}`);
        values.push(role);
        counter++;
      }

      values.push(email);

      const updateQuery = `
      UPDATE employee
      SET ${updates.join(", ")}
      WHERE email = $${counter}
      RETURNING *;
    `;

      const result = await client.query(updateQuery, values);
      if (result.rowCount == 0) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res
        .status(200)
        .json({ message: "employee details updated", data: result.rows[0] });
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  },

  // for blocking the particular user
  employeeBlock: async (req, res) => {
    const client = await pool.connect();
    try {
      const { email, is_blocked } = req.query;

      if (!email || is_blocked === undefined) {
        return res
          .status(400)
          .json({ message: "email and the block status is required" });
      }
      const existingUser = "SELECT * FROM employees WHERE email = $1";
      const result = await client.query(existingUser, [email]);
      const user = result.rows[0];
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      const updateQuery =
        "UPDATE employees SET is_blocked = $1 WHERE email = $2 RETURNING *";
      const updatedUser = await client.query(updateQuery, [
        is_blocked === "true",
        email,
      ]);

      const action = is_blocked === "true" ? "blocked" : "unblocked";
      res.status(200).json({
        message: `User is now ${action} successfully`,
        data: updatedUser,
      });
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  },

  // for soft delete the particular user
  employeeDelete: async (req, res) => {
    const client = await pool.connect();
    try {
      const { email, is_deleted } = req.query;

      if (!email || is_deleted === undefined) {
        return res
          .status(400)
          .json({ message: "email and the block status is required" });
      }
      const existingUser = "SELECT * FROM employees WHERE email = $1";
      const result = await client.query(existingUser, [email]);
      const user = result.rows[0];
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      const updateQuery =
        "UPDATE employees SET is_deleted = $1 WHERE email = $2";
      await client.query(updateQuery, [is_deleted === "true", email]);

      const action = is_deleted === "true" ? "deleted" : "reactivated";
      res.status(200).json({ message: `User is now ${action} successfully` });
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  },

  // for updating the status of the leave
  leaveStatus: async (req, res) => {
    const client = await pool.connect();
    try {
      const status = req.body.status;
      const id = req.params.requestId;

      const existingLeave = "SELECT * FROM leaveData WHERE  id = $1";
      const result = await client.query(existingLeave, [id]);

      const leave = result.rows[0];
      if (!leave) {
        return res
          .status(404)
          .json({ message: "requested leave data is not available" });
      }

      const updateQuery =
        "UPDATE leaveData SET leave_status = $1 WHERE id = $2 RETURNING *";

      const updatedLeave = await client.query(updateQuery, [status, id]);
      res
        .status(200)
        .json({ message: "leave status updated", data: updatedLeave.rows[0] });
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  },

  // controller for assigning the role for the user
  assignRole: async (req, res) => {
    const client = await pool.connect();
    try {
      const { id } = req.params;
      const { role } = req.body;

      const checkUserQuery = "SELECT * FROM employees WHERE id = $1";
      const result = await client.query(checkUserQuery, [id]);
      const user = result.rows[0];
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      const updateQuery =
        "UPDATE employees SET role = $1 WHERE id = $2 RETURNING *";

      const updatedUser = await client.query(updateQuery, [role, id]);
      res.status(200).json({
        message: "role of employee updated",
        data: updatedUser.rows[0],
      });
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  },

  // for generating the reports
  generateReport: async (req, res) => {
    const client = await pool.connect();
    try {
      // begin the transaction
      await client.query("BEGIN");
      // for getting the count according to role
      const userCountQuery = `
         SELECT role, COUNT(*) AS employee_count
          FROM employees
          GROUP BY role;
        `;

      // for getting count according to blocked and unblocked count
      const blockedUserCountQuery = `
        SELECT is_blocked, COUNT(*) AS blocked_count
        FROM employees
        GROUP BY is_blocked;
        `;

      // for getting the count of the employees according to the leave
      const leaveCountQuery = `
        SELECT status, count(*) AS leave_count
        FROM leaveData
        GROUP BY status;
      `;

      // committing the transaction
      await client.query("COMMIT");

      // getting the results for the query
      const resultUserRole = await client.query(userCountQuery);
      const resultBlockedUser = await client.query(blockedUserCountQuery);
      const resultLeaveCount = await client.query(leaveCountQuery);

      res.status(200).json({
        message: "generated reports",
        resultUserRole: resultUserRole.rows,
        resultBlockedUser: resultBlockedUser.rows,
        resultLeaveCount: resultLeaveCount.rows,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(error);
    } finally {
      client.release();
    }
  },

  // for the logout
  logout: async (req, res) => {
    try {
      res
        .clearCookie("admin_access_token")
        .status(200)
        .json({ message: "admin logged out" });
    } catch (error) {
      throw new Error(error);
    }
  },
};
