// file to crete the routes for the admin side

// importing the required modules
import express from "express";
import { adminController } from "../controller/adminController.js";
import { authenticateAdminJwt } from "../middleware/adminAuthenticate.js";

// setting the router
const router = express.Router();

// router for admin login
router.get("/login", adminController.adminLogin);

// router for retrieving the employees
router.get(
  "/getEmployeeData/:id",
  authenticateAdminJwt,
  adminController.getEmployees
);

// router for editing the employee
router.patch(
  "/editEmployee",
  authenticateAdminJwt,
  adminController.updateEmployee
);

// router for blocking the employee
router.put(
  "/blockEmployee",
  authenticateAdminJwt,
  adminController.employeeBlock
);

// router for deleting the employees
router.delete(
  "/deleteEmployee",
  authenticateAdminJwt,
  adminController.employeeDelete
);

// router for managing the leave
router.put(
  "/manageLeave/:requestId",
  authenticateAdminJwt,
  adminController.leaveStatus
);

// router for assigning the role
router.patch(
  "/assignRole/:id",
  authenticateAdminJwt,
  adminController.assignRole
);

// router for generating reports
router.get("/reports", authenticateAdminJwt, adminController.generateReport);

// router for logout
router.put("/logout", adminController.logout);

export default router;
