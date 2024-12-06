// file to set the employees routes

// importing the required modules
import express from "express";
import { employeeController } from "../controller/employeeController.js";
import { authenticateUserJwt } from "../middleware/authenticate.js";
import { leaveController } from "../controller/leaveController.js";

// setting the router
const router = express.Router();

// router for login
router.post("/login", employeeController.employeeLogin);

// router for signup
router.post("/signup", employeeController.employeeSignup);

// router for password updating
router.patch(
  "/updatePassword",
  authenticateUserJwt,
  employeeController.updatePassword
);

// router for viewing the employees profile
router.get(
  "/getSelfData",
  authenticateUserJwt,
  employeeController.employeeProfile
);

// router for requesting leave
router.post("/requestLeave", authenticateUserJwt, leaveController.requestLeave);

// router for viewing the status
router.get(
  "/viewLeaveStatus",
  authenticateUserJwt,
  leaveController.leaveStatus
);

// router for editing the employee
router.patch(
  "/editEmployeeData",
  authenticateUserJwt,
  employeeController.updateEmployee
);

export default router;
