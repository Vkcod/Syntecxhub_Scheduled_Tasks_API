# Scheduled Tasks API

A backend API built using **Node.js**, **Express.js**, **MongoDB**, **Mongoose**, **JWT**, **bcryptjs**, and **node-cron**. This project demonstrates how to create and manage scheduled background jobs in a backend system. It includes automatic scheduled tasks, manual job triggering, job listing, and job execution logging with success or failure status.

## Features

- User registration and login
- Password hashing using bcryptjs
- JWT-based authentication
- Role-based access control
- Admin-only scheduled job routes
- Scheduled background jobs using node-cron
- Automatically run jobs based on cron intervals
- Manually trigger jobs using API endpoint
- List all available scheduled jobs
- Log job execution results
- Store job logs in MongoDB
- Track job success and failure
- Track job start time and finish time
- Track job execution duration
- Store error details for failed jobs
- Filter job logs by job name
- Filter job logs by status
- Filter job logs by date range
- Proper error handling using try-catch

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- node-cron
- dotenv
- nodemon

## Project Structure

scheduled-tasks-api/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   └── jobController.js
│
├── jobs/
│   ├── jobRegistry.js
│   └── scheduledJobs.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── models/
│   ├── User.js
│   ├── StaleRecord.js
│   └── JobLog.js
│
├── routes/
│   ├── authRoutes.js
│   └── jobRoutes.js
│
├── utils/
│   └── logJobResult.js
│
├── .env
├── server.js
├── package.json
└── README.md

## Installation

Clone the repository:

git clone https://github.com/your-username/scheduled-tasks-api.git

Go to the project folder:

cd scheduled-tasks-api

Install dependencies:

npm install

Install required packages manually if needed:

npm install express mongoose bcryptjs jsonwebtoken dotenv node-cron

npm install nodemon --save-dev

## Environment Variables

Create a `.env` file in the root directory and add the following:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/scheduled_tasks_api
JWT_SECRET=your_secret_key_here

You can replace the MongoDB URI with your MongoDB Atlas connection string if you are using Atlas.

## Run the Project

For development:

npm run dev

For production:

npm start

The server will run on:

http://localhost:5000

## API Base URL

http://localhost:5000/api

## Authentication Routes

### Register User

POST /api/auth/register

Request Body:

{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}

Success Response:

{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "USER_ID",
    "name": "John",
    "email": "john@example.com",
    "role": "user"
  }
}

### Login User

POST /api/auth/login

Request Body:

{
  "email": "john@example.com",
  "password": "123456"
}

Success Response:

{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "USER_ID",
    "name": "John",
    "email": "john@example.com",
    "role": "user"
  }
}

## Authorization

For protected routes, send the JWT token in the Authorization header:

Authorization: Bearer your_token_here

Example:

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...

## Scheduled Job Routes

These routes can only be accessed by users with the `admin` role.

### List Scheduled Jobs

GET /api/jobs

Headers:

Authorization: Bearer admin_token_here

Success Response:

{
  "success": true,
  "count": 2,
  "jobs": [
    {
      "name": "deleteStaleRecords",
      "description": "Deletes stale records older than 7 days",
      "schedule": "0 0 * * *",
      "interval": "Every day at midnight"
    },
    {
      "name": "sendEmailSummary",
      "description": "Generates daily email summary",
      "schedule": "0 9 * * *",
      "interval": "Every day at 9 AM"
    }
  ]
}

### Manually Trigger Delete Stale Records Job

POST /api/jobs/deleteStaleRecords/trigger

Headers:

Authorization: Bearer admin_token_here

Success Response:

{
  "success": true,
  "message": "Job triggered manually",
  "jobName": "deleteStaleRecords",
  "result": {
    "success": true,
    "message": "3 stale records deleted"
  }
}

### Manually Trigger Email Summary Job

POST /api/jobs/sendEmailSummary/trigger

Headers:

Authorization: Bearer admin_token_here

Success Response:

{
  "success": true,
  "message": "Job triggered manually",
  "jobName": "sendEmailSummary",
  "result": {
    "success": true,
    "message": "Email summary generated. Total users: 5, total job logs: 10"
  }
}

### Get Job Execution Logs

GET /api/jobs/logs

Headers:

Authorization: Bearer admin_token_here

Success Response:

{
  "success": true,
  "count": 2,
  "logs": [
    {
      "_id": "LOG_ID",
      "jobName": "deleteStaleRecords",
      "status": "success",
      "message": "3 stale records deleted",
      "startedAt": "2026-05-25T10:30:00.000Z",
      "finishedAt": "2026-05-25T10:30:01.000Z",
      "durationMs": 1000,
      "error": null,
      "createdAt": "2026-05-25T10:30:01.000Z",
      "updatedAt": "2026-05-25T10:30:01.000Z"
    }
  ]
}

## Job Log Filters

You can filter job logs using query parameters.

### Filter by Job Name

GET /api/jobs/logs?jobName=deleteStaleRecords

Example:

GET /api/jobs/logs?jobName=sendEmailSummary

### Filter by Status

GET /api/jobs/logs?status=success

GET /api/jobs/logs?status=failure

### Filter by Start Date

GET /api/jobs/logs?startDate=2026-05-01

### Filter by End Date

GET /api/jobs/logs?endDate=2026-05-30

### Filter by Date Range

GET /api/jobs/logs?startDate=2026-05-01&endDate=2026-05-30

### Combined Filter

GET /api/jobs/logs?jobName=deleteStaleRecords&status=success&startDate=2026-05-01&endDate=2026-05-30

## Available Scheduled Jobs

### deleteStaleRecords

This job deletes stale records from the database that are older than 7 days.

Job name:

deleteStaleRecords

Cron schedule:

0 0 * * *

Interval:

Every day at midnight

Purpose:

To clean old stale records from the database automatically.

### sendEmailSummary

This job generates a daily summary report. In this project, the email summary is simulated using console output. In a real project, this can be connected with Nodemailer or any email service.

Job name:

sendEmailSummary

Cron schedule:

0 9 * * *

Interval:

Every day at 9 AM

Purpose:

To generate a daily system summary such as total users and total job logs.

## Cron Schedule Examples

* * * * *  
Runs every minute

*/5 * * * *  
Runs every 5 minutes

0 * * * *  
Runs every hour

0 0 * * *  
Runs every day at midnight

0 9 * * *  
Runs every day at 9 AM

0 0 * * 0  
Runs every Sunday at midnight

## User Model

The user model contains the following fields:

{
  name: String,
  email: String,
  password: String,
  role: String,
  isBlocked: Boolean
}

Default user role:

role: "user"

Available roles:

["admin", "user"]

## Stale Record Model

The stale record model is used as an example collection for scheduled cleanup.

{
  title: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}

Available status values:

["active", "stale"]

## Job Log Model

The job log model stores execution details of scheduled jobs.

{
  jobName: String,
  status: String,
  message: String,
  startedAt: Date,
  finishedAt: Date,
  durationMs: Number,
  error: String,
  createdAt: Date,
  updatedAt: Date
}

## Job Log Fields Explanation

jobName:
The name of the scheduled job.

status:
The execution result of the job. It can be success or failure.

message:
A readable message explaining the job result.

startedAt:
The date and time when the job started.

finishedAt:
The date and time when the job finished.

durationMs:
The total time taken by the job in milliseconds.

error:
The error message if the job failed. If the job succeeds, this value will be null.

createdAt:
The date and time when the log was created.

## Example Job Log Document

{
  "_id": "6650abc123456789",
  "jobName": "deleteStaleRecords",
  "status": "success",
  "message": "3 stale records deleted",
  "startedAt": "2026-05-25T10:30:00.000Z",
  "finishedAt": "2026-05-25T10:30:01.000Z",
  "durationMs": 1000,
  "error": null,
  "createdAt": "2026-05-25T10:30:01.000Z",
  "updatedAt": "2026-05-25T10:30:01.000Z"
}

## How Scheduled Jobs Work

The project uses `node-cron` to run jobs automatically.

All jobs are registered inside the job registry file.

Each job contains:

- Job name
- Job description
- Cron schedule
- Interval description
- Job function

When the server starts, scheduled jobs are loaded automatically using the `startScheduledJobs` function.

The job runs automatically at the defined interval.

Admin users can also manually trigger any available job using the API.

Every job execution is saved in the `joblogs` MongoDB collection.

## Error Handling in Jobs

Each job is wrapped inside a safe execution function.

If the job completes successfully:

- Status is saved as success
- Success message is stored
- Start time and finish time are recorded
- Duration is calculated

If the job fails:

- Status is saved as failure
- Error message is stored
- Start time and finish time are recorded
- Duration is calculated
- The API does not crash

## How to Make First Admin

By default, all registered users are created as normal users.

role: "user"

To create the first admin, manually update one user in MongoDB Compass:

{
  "role": "admin"
}

After updating the role, login again with that user account and use the new JWT token.

## Testing Flow in Postman

1. Register a new user using `/api/auth/register`.
2. Login using `/api/auth/login`.
3. Copy the JWT token from the login response.
4. Go to MongoDB Compass.
5. Find the registered user in the users collection.
6. Manually update the user role from `user` to `admin`.
7. Login again to generate a fresh token with admin role.
8. Use this admin token in the Authorization header.
9. Test scheduled job routes:
   - List scheduled jobs
   - Manually trigger delete stale records job
   - Manually trigger email summary job
   - View job execution logs
   - Filter job logs by job name
   - Filter job logs by status
   - Filter job logs by date range

## Example Postman Authorization Header

Authorization: Bearer your_admin_token_here

## Error Responses

### No Token Provided

{
  "success": false,
  "message": "Access denied. No token provided."
}

### Invalid or Expired Token

{
  "success": false,
  "message": "Invalid or expired token"
}

### Admin Only Route

{
  "success": false,
  "message": "Access denied. Admin only route."
}

### Job Not Found

{
  "success": false,
  "message": "Job not found"
}

### Failed Job Example

{
  "success": true,
  "message": "Job triggered manually",
  "jobName": "deleteStaleRecords",
  "result": {
    "success": false,
    "message": "deleteStaleRecords failed",
    "error": "Database connection failed"
  }
}

## Important Notes

- Scheduled job routes are admin only.
- JWT token is required to access job management endpoints.
- `node-cron` starts jobs automatically when the server starts.
- Manual job trigger is useful for testing.
- Job execution logs help track success and failure.
- Failed jobs are logged without crashing the server.
- The email summary job is simulated in this project.
- In a real-world project, Nodemailer can be used to send actual emails.
- The stale record cleanup job deletes old records with status `stale`.
- Job logs are stored permanently unless manually deleted.
- Cron expressions should be tested carefully before production use.

## Sample package.json Scripts

{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}

## Future Improvements

- Add Nodemailer for real email summary
- Add job enable and disable feature
- Add dynamic job scheduling from database
- Add pagination for job logs
- Add search by job name
- Add retry mechanism for failed jobs
- Add email alerts when a job fails
- Add dashboard for job monitoring
- Add soft delete for stale records
- Add automatic cleanup of old job logs
- Add support for multiple cron intervals
- Add role such as scheduler-admin
- Add timezone support for cron jobs
- Add queue system using BullMQ or Agenda
- Add Redis for advanced background job management

## Conclusion

This project demonstrates how to build a scheduled tasks API using Node.js, Express.js, MongoDB, Mongoose, JWT, and node-cron. It shows how to run background jobs automatically, trigger jobs manually, and store execution logs in MongoDB. This project is useful for learning backend automation, cron jobs, admin-only job management, error handling, and real-world scheduled task execution.