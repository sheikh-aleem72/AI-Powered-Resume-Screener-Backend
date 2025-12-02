# AI-Powered Resume Screener - Backend

## Introduction

Welcome to the backend of **AI-Powered Resume Screener**, a robust web application designed to streamline the recruitment process by intelligently analyzing resumes.  
This backend repo provides all the necessary APIs for user management, authentication, authorization, resume handling, job description management, and AI-driven resume analysis.

This project focuses on building a **secure, scalable, and maintainable backend** using **Node.js, Express, TypeScript, and MongoDB**. It is designed to integrate seamlessly with a frontend application and provides a strong foundation for implementing advanced AI features in later stages.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ORM
- **Authentication:** JWT (Access Token & Refresh Token)
- **Email Service:** Nodemailer (OTP Verification)
- **Password Security:** bcryptjs
- **File Storage:** Cloudinary (for resume upload)
- **AI Integration:** Gemini API (for resume parsing and analysis)

---

## Features (Completed Up To Stage 3.3)

1. **User Signup & Login**
   - Signup with email, password, role, and organization.
   - Login with email and password.
   - Passwords are securely hashed before storing in the database.

2. **Authentication & Authorization**
   - JWT-based access tokens (15 min expiry) and refresh tokens (7 days expiry).
   - Protected routes using middleware to verify tokens.
   - Token refresh endpoint to issue new access tokens when expired.

3. **Email-Based OTP Verification**
   - OTP sent to user’s email during signup and password reset.
   - Pending verification stored in database until OTP is verified.
   - Secure password reset flow using OTP.

4. **Refresh Token Management**
   - Refresh tokens securely stored in user records.
   - Token rotation implemented for added security.

5. **Resume Management**
   - Upload resumes (PDF/DOCX) via Cloudinary.
   - Store resume metadata and URL in MongoDB.
   - Parse resumes via AI microservice (Gemini API) to extract structured data.

6. **Job Description Management**
   - Create, update, fetch, and delete job descriptions.
   - Used for mapping candidate resumes to job requirements.

7. **Resume Analysis (AI Stage)**
   - AI-based matching of parsed resume data against job descriptions.
   - Generates compatibility score and insights.

---

## API Documentation

### Auth Routes

| Method | Endpoint              | Description                                 | Request Body                                                 | Response Body                                           |
| ------ | --------------------- | ------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| POST   | `/auth/signup`        | Create pending user & send OTP              | `{ name, email, password, role?, organization? }`            | `{ success: true, message: "OTP sent to email" }`       |
| POST   | `/auth/verify-otp`    | Verify OTP and create user / reset password | `{ email, otp, purpose: "signup" \| "reset", newPassword? }` | `{ success: true, accessToken?, refreshToken?, user? }` |
| POST   | `/auth/signin`        | User login                                  | `{ email, password }`                                        | `{ success: true, accessToken, refreshToken, user }`    |
| POST   | `/auth/refresh-token` | Refresh expired access token                | `{ refreshToken }`                                           | `{ success: true, accessToken, refreshToken }`          |

**Note:** All protected routes require `Authorization: Bearer <accessToken>` header.

---

### Resume Routes

**Base URL:** `/api/v1/resume`

| Method | Endpoint        | Description                                 | Request Body                      | Response Body                          |
| ------ | --------------- | ------------------------------------------- | --------------------------------- | -------------------------------------- |
| POST   | `/save-meta`    | Save resume metadata and Cloudinary URL     | `{ filename, url, size, format }` | `{ success: true, resumeId, message }` |
| POST   | `/parse-resume` | Parse uploaded resume using AI microservice | `{ resumeUrl }`                   | `{ success: true, parsedResume }`      |

---

### Job Description Routes

**Base URL:** `/api/v1/job`

| Method | Endpoint | Description                    | Request Body                                                                                                     | Response Body                   |
| ------ | -------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| POST   | `/`      | Create a new job description   | `{ title, company?, required_skills, prefered_skills?, experience_level?, min_experience_level?, description? }` | `{ success: true, job }`        |
| GET    | `/`      | Get all job descriptions       | —                                                                                                                | `{ success: true, jobs }`       |
| GET    | `/:id`   | Get a job description by ID    | —                                                                                                                | `{ success: true, job }`        |
| PATCH  | `/:id`   | Update a job description by ID | `{ title?, description?, required_skills?, company?, prefered_skills?, min_experience_level? }`                  | `{ success: true, updatedJob }` |
| DELETE | `/:id`   | Delete a job description by ID | —                                                                                                                | `{ success: true, message }`    |

---

### Resume Analysis Routes

**Base URL:** `/api/v1/resume-analysis`

| Method | Endpoint | Description                       | Request Body                                     | Response Body                        |
| ------ | -------- | --------------------------------- | ------------------------------------------------ | ------------------------------------ |
| POST   | `/`      | Create new resume analysis record | `{ jobDescriptionId, resumeId, analysisResult }` | `{ success: true, resumeAnalysis }`  |
| GET    | `/`      | Get all resume analyses           | —                                                | `{ success: true, analyses }`        |
| GET    | `/:id`   | Get resume analysis by ID         | —                                                | `{ success: true, analysis }`        |
| PUT    | `/:id`   | Update resume analysis by ID      | `{ analysisResult?, score? }`                    | `{ success: true, updatedAnalysis }` |
| DELETE | `/:id`   | Delete resume analysis by ID      | —                                                | `{ success: true, message }`         |

---

## Environment Variables

The following environment variables must be set:

- PORT=5000
- MONGODB_URI=<Your MongoDB Connection String>
- JWT_ACCESS_SECRET=<Your JWT Access Secret>
- JWT_REFRESH_SECRET=<Your JWT Refresh Secret>
- SMTP_HOST=<SMTP Host>
- SMTP_PORT=<SMTP Port>
- SMTP_SECURE=<true/false>
- SMTP_USER=<SMTP Email>
- SMTP_PASS=<SMTP Password or App Password>
- EMAIL_FROM=<Sender Email>
- OTP_EXPIRES_MINUTES=5
- CLOUDINARY_CLOUD_NAME=<Cloudinary Cloud Name>
- CLOUDINARY_API_KEY=<Cloudinary API Key>
- CLOUDINARY_API_SECRET=<Cloudinary API Secret>
- PARSER_SERVICE_URL=<Parsing microservice url>

---

## Next Steps

- Implement AI-based candidate-job matching algorithm.
- Add recruiter dashboard and analytics endpoints.
- Extend job filters (skills, location, experience).
- Add pagination and search to job/resume endpoints.
- Integrate structured AI insights visualization.

---

## Contribution

Feel free to contribute by creating pull requests, reporting issues, or suggesting improvements.  
Make sure to follow the **existing code structure and TypeScript practices**.

---

## Developed by **Shekh Aalim**
