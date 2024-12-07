# Employee Management System

## Overview
This is a Node.js-based Employee Management System with separate APIs for employees and administrators. It features user authentication, employee data management, leave requests, and administrative functions.

## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- JWT for authentication

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- PostgreSQL

### Installation
1. Clone the repository:
   ```
   git clone git@github.com:NischalKShaj/employee-management-backend.git
   cd employee-management-backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Set up the PostgreSQL database:
- Create a new database named `employee_management`
- Update the database configuration in `config/db.js` with your PostgreSQL credentials

4. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
     ```
    PORT=4000
    JWT_SECRET=your_jwt_secret_key
    ADMIN_EMAIL=your_admin_email
    ADMIN_PASSWORD=your_admin_password
    ```
5. Start the server:
   ```
   npm run start
   ```

   
The server should now be running on `http://localhost:4000`.

## API Endpoints

### Employee Endpoints
- POST `/employee/signup`: Register a new employee
- GET `/employee/login`: Employee login
- PATCH `/employee/updatePassword`: Update employee password
- GET `/employee/getSelfData`: Get employee's own profile
- GET `/employee/requestLeave`: Request leave
- GET `/employee/viewLeaveStatus`: View leave request status
- PATCH `/employee/editEmployeeData`: Edit employee data

### Admin Endpoints
- GET `/admin/login`: Admin login
- GET `/admin/getEmployeeData/:id`: Get employee data (single or all)
- PATCH `/admin/editEmployee`: Edit employee data
- PUT `/admin/blockEmployee`: Block an employee
- DELETE `/admin/deleteEmployee`: Soft delete an employee
- PUT `/admin/manageLeave/:requestId`: Manage leave requests
- PATCH `/admin/assignRole/:id`: Assign role to an employee
- GET `/admin/reports`: Generate various reports
- PUT `/admin/logout`: Admin logout

## Additional Notes
- All data validations are implemented manually without external libraries.
- Passwords are hashed before storing in the database.
- Admin endpoints are protected by middleware to ensure admin-only access.

   
