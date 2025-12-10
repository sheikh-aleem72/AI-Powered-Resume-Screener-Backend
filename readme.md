# AI-Powered Resume Screener - Backend

## Introduction

Welcome to the backend of **AI-Powered Resume Screener**, a robust web application designed to streamline the recruitment process by intelligently analyzing resumes.  
This backend repo provides all the necessary APIs for user management, authentication, authorization, resume handling, job description management, and AI-driven resume analysis.

This project focuses on building a **secure, scalable, and maintainable backend** using **Node.js, Express, TypeScript, and MongoDB**. It is designed to integrate seamlessly with a frontend application and provides a strong foundation for implementing advanced AI features in later stages.

# 🚀 AI-Powered Resume Screener — Backend

**Node.js + TypeScript + Express + MongoDB + Redis + Python RQ Workers**

A scalable, production-grade backend for intelligently analyzing resumes, matching candidates to job descriptions, and processing large resume batches using a distributed worker system.

This repository implements:

- Authentication + Authorization
- Secure resume upload & metadata management
- AI-powered parsing (microservice based)
- Job description management
- Background batch processing (Stage 4)
- Distributed queue workers with retries and backoff
- Atomic MongoDB updates for concurrency safety

This project is designed for **real companies**, **ATS platforms**, and **AI-driven recruiting systems**.

---

# 🏗️ **Tech Stack**

### **Backend**

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- Redis (queue broker)
- BullMQ-style publishing (Node → Redis)
- RQ Workers (Python)

### **AI / Microservices**

- Gemini API (Parsing & Analysis)
- Python Resume Parser Service
- Distributed Worker Architecture

### **Security**

- JWT (Access + Refresh tokens)
- OTP Email Verification (Nodemailer)
- Password hashing (bcryptjs)

### **File Storage**

- Cloudinary (resume uploads)

---

# 🧠 **System Architecture (2025 Upgrade — Stage 4)**

```

Client → Node API → MongoDB
↓
Redis Queue
↓
Python RQ Workers
↓
Node Callback Handler
↓
Atomic DB Update

```

### ⭐ Key Highlights

✔ Fully asynchronous resume processing  
✔ Multi-worker concurrency support  
✔ Atomic DB updates (no lost updates)  
✔ Exponential retry & backoff  
✔ Batch-level tracking & progress APIs  
✔ Resumable job pipeline

This architecture supports both **high throughput (50+ resumes per batch)** and **fault-tolerant processing**.

---

# 🔥 **Core Features**

## 1. **Authentication & User Management**

- Signup with OTP verification
- Secure login with JWT
- Refresh token rotation
- Role & organization support

---

## 2. **Resume Upload + Metadata Management**

- Upload to Cloudinary
- Store metadata: name, URL, size, format
- Resume ID auto-generated (`RESUME_YYYYMMDD_XXXX`)

---

## 3. **Job Description Management**

- Create, update, list, delete
- Required skills, preferred skills, experience

---

## 4. **AI-Powered Resume Parsing & Analysis**

- Microservice architecture
- Uses Gemini API for parsing
- Extracts: education, experience, skills, achievements
- Analysis engine compares resume vs job description

---

# ⚡ **Stage 4: High-Performance Batch Processing Pipeline**

Batch processing allows a recruiter to upload **multiple resumes at once (up to 50)** and process them asynchronously.

## ✔ 1. Batch Creation API

`POST /api/v1/batch/create`

- Generate `batchId` (`BATCH_YYYYMMDD_XXXX`)
- Validate:
  - MAX_RESUMES_PER_BATCH = 50
  - MAX_TOTAL_BYTES_PER_BATCH = 200MB
- Store batch in MongoDB
- Publish per-resume jobs to Redis queue

---

## ✔ 2. Redis Queue (Node → Python)

Node publishes jobs in RQ-compatible format:

```json
{
  "batchId": "BATCH_20251209_0001",
  "jobDescriptionId": "JOB_123",
  "resumeId": "RESUME_20251209_0007",
  "resumeUrl": "https://..."
}
```

Each resume = 1 background job.

---

## ✔ 3. Python RQ Worker

- Fetches job from Redis
- Marks resume as **processing**
- Simulates/executes parsing
- Retries failures automatically
- Sends callback to Node API when done

Features:

- Multi-worker support (4+ workers)
- Exponential backoff
- Retry scheduler

---

## ✔ 4. Callback Handler (Node)

The Node server receives:

```json
{
  "batchId": "...",
  "resumeId": "...",
  "status": "completed" | "failed"
}
```

### 🔒 Uses **atomic MongoDB updates**

This prevents concurrency issues like **lost updates**, especially when 20+ workers push callbacks simultaneously.

```ts
await Batch.updateOne(
  { batchId, 'resumes.resumeId': resumeId },
  {
    $set: { 'resumes.$.status': status },
    $inc: {
      processedResumes: 1,
      completedResumes: status === 'completed' ? 1 : 0,
      failedResumes: status === 'failed' ? 1 : 0,
    },
  },
);
```

Guaranteed correctness even under high concurrency.

---

## ✔ 5. Batch Status API

`GET /api/v1/batch/:batchId`

Returns live status:

```json
{
  "batchId": "...",
  "status": "processing",
  "processedResumes": 13,
  "completedResumes": 13,
  "failedResumes": 0,
  "totalResumes": 25,
  "resumes": [ ... ]
}
```

---

# 📚 **API Documentation (Overview)**

### **Auth**

| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| POST   | /auth/signup        | Create user & send OTP      |
| POST   | /auth/verify-otp    | Verify OTP for signup/reset |
| POST   | /auth/signin        | Login (JWT)                 |
| POST   | /auth/refresh-token | Refresh access token        |

---

### **Resume Mgmt**

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | /resume/save-meta    | Save resume metadata |
| POST   | /resume/parse-resume | Parse resume via AI  |

---

### **Job Description**

| Method | Endpoint | Description            |
| ------ | -------- | ---------------------- |
| POST   | /job     | Create job description |
| GET    | /job     | List all jobs          |
| PATCH  | /job/:id | Update                 |
| DELETE | /job/:id | Delete                 |

---

### **Batch Processing (Stage 4)**

| Method | Endpoint        | Description                     |
| ------ | --------------- | ------------------------------- |
| POST   | /batch/create   | Create batch & enqueue jobs     |
| GET    | /batch/:batchId | Get batch status                |
| POST   | /batch/update   | Worker → Node callback endpoint |

---

# ⚙️ **Environment Variables**

```env
PORT=5000
MONGODB_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Redis
REDIS_URL=redis://127.0.0.1:6379

# Resume Parsing Service
PARSER_SERVICE_URL=http://localhost:9000/parse
```

---

# 🧪 **Testing (E2E Tested 2025)**

A full end-to-end test verifies:

- Node publishes 25+ jobs
- Redis receives all jobs
- Python multi-workers process them concurrently
- Retry logic handles failures
- Node callback handler updates Mongo atomically
- Batch reaches `status=completed`

---

# 📈 **Performance**

- Processes **50 resumes per batch**
- Supports **4–8 workers**
- Zero lost updates
- Queue operations: O(1)
- Mongo concurrency: 100% safe (atomic updates)

---

# 🔮 **Next Steps (Stage 5+)**

- Vector embeddings for resume-job matching
- Global ranking algorithm
- Recruiter dashboards + analytics
- Websocket live updates
- Resume scoring model improvements
- Batch-level summary insights

---

# 🤝 **Contributing**

Contributions are welcome!
Follow TypeScript coding conventions and maintain architectural consistency.

---

# **Developed By**

_Shekh Aalim_
