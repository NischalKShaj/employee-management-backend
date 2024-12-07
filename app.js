// main server page

// importing the required modules
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connection } from "./config/db.js";
import employeeRoute from "./routes/employeeRoute.js";
import { employeeTable } from "./models/employeeDB.js";
import { leaveTable } from "./models/leaveDB.js";
import adminRoute from "./routes/adminRoutes.js";
dotenv.config();

// setting the app
const app = express();
const port = process.env.PORT;

// for parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// making the db connection
connection();

//creating the table
employeeTable();
leaveTable();

// setting the initial route
app.use("/admin", adminRoute); //for admin
app.use("/employee", employeeRoute); // for employee

app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);

  if (err.statusCode) {
    res.status(err.statusCode).json({
      message: err.message || "Something went wrong!",
      error: err.stack || null,
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.stack || null,
    });
  }
});

// starting the server
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
