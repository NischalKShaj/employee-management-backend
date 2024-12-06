// main server page

// importing the required modules
import express from "express";
import dotenv from "dotenv";
import { connection } from "./config/db.js";
dotenv.config();

// setting the app
const app = express();
const port = process.env.PORT;

// making the db connection
connection();

// starting the server
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
