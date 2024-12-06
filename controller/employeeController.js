// file to create the controller for the employee

// importing the required modules
import { pool } from "../config/db.js";
import { generateToken } from "../middleware/generateToken.js";
import bcrypt from "bcrypt";
import validation from "../utils/validation.js";

// creating the controller
export const employeeController = {
  // for login
  employeeLogin: async (req, res) => {
    const client = await pool.connect();
    try {
      const { email, password } = req.body;
      const existingUser = "SELECT * FROM employees WHERE  email = $1";
      const result = await client.query(existingUser, [email]);

      const user = result.rows[0];
      if (!user) {
        return res.status(400).json({ message: "user not found" });
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res.status(400).json({ message: "invalid password" });
      }

      const token = generateToken(email);

      res.status(202).json({ data: user, token: token });
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  },

  // for signup
  employeeSignup: async (req, res) => {
    const client = await pool.connect();
    try {
      const { username, email, password, gender, role, age } = req.body;

      // for name validation
      const nameError = validation.nameValidation(username);
      if (nameError) {
        return res.status(400).json({ message: nameError });
      }

      // for email
      const emailError = validation.emailValidation(email);
      if (emailError) {
        return res.status(400).json({ message: emailError });
      }

      // for password
      const passwordError = validation.passwordValidation(password);
      if (passwordError) {
        return res.status(400).json({ message: passwordError });
      }

      // for gender
      const genderError = validation.genderValidation(gender);
      if (genderError) {
        return res.status(400).json({ message: genderError });
      }

      // for role
      const roleError = validation.roleValidation(role);
      if (roleError) {
        return res.status(400).json({ message: roleError });
      }

      // for age
      const ageError = validation.ageValidation(age);
      if (ageError) {
        return res.status(400).json({ message: ageError });
      }

      const existingUser = "SELECT * FROM employees WHERE email = $1";
      const exist = await client.query(existingUser, [email]);

      if (exist.rows.length > 0) {
        return res.status(400).json("user already exists");
      }

      const query = `
      INSERT INTO employees(username, email, password, gender, role, age)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
      `;

      const hashPassword = await bcrypt.hash(password, 10);

      const result = await client.query(query, [
        username,
        email,
        hashPassword,
        gender,
        role,
        age,
      ]);
      res.status(201).json({ employee: result.rows[0] });
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  },

  // controller for updating the password
  updatePassword: async (req, res) => {
    const client = await pool.connect();
    try {
      const { email, password, newPassword } = req.body;
      const existingUser = "SELECT * FROM employees WHERE email = $1";
      const result = await client.query(existingUser, [email]);

      const user = result.rows[0];
      if (!user) {
        return res.status(400).json({ message: "user not found" });
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res.status(400).json({ message: "invalid password" });
      }

      // validate the newPassword
      const passwordError = validation.passwordValidation(newPassword);
      if (passwordError) {
        return res.status(400).json({ message: passwordError });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // update query
      const updateQuery = `
      UPDATE employees
      SET password = $1
      WHERE email = $2
      RETURNING *;
      `;

      const updatedUser = await client.query(updateQuery, [
        hashedNewPassword,
        email,
      ]);
      res
        .status(200)
        .json({ message: "password updated successfully", user: updatedUser });
      client.release();
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  },

  // for getting the of a specific employee for the profile
  employeeProfile: async (req, res) => {
    const client = await pool.connect();
    try {
      const email = req.user;

      const existingUser = "SELECT * FROM employees WHERE email = $1";

      const result = await client.query(existingUser, [email]);

      const user = result.rows[0];
      if (!user) {
        return res.status(400).json({ message: "user not found" });
      }
      res.status(202).json({ message: "user data fetched", data: user });
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  },

  // for updating the employee db
  updateEmployee: async (req, res) => {
    const client = await pool.connect();
    try {
      const { username, password, age, gender, role } = req.body;
      const email = req.user;

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
        updates.push(`password = $${counter}`);
        values.push(password);
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
};
