# 🚀 AI-Powered Resume Screener — Backend

**Node.js + TypeScript + Express + MongoDB + Redis + Python RQ Workers**

A production-grade backend for intelligently screening resumes, ranking candidates against job descriptions, and processing large resume batches using a distributed worker architecture.

This backend is **feature-complete up to Stage 4 – Phase 6** and is now **frontend-ready**.

---

## 🧠 What This System Does

- Recruiters create jobs
- Upload resumes (metadata-only)
- Trigger batch processing
- Get instant embedding-based ranking
- Receive progressive enrichment via deep AI analysis (on-demand)
- Review transparent explanations for every resume (pass or fail)

This system is designed as a **real ATS-grade backend**, not a demo or toy project.

---

## 🏗️ Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- Redis (queue broker)

### Workers / Async Processing

- Python RQ Workers
- Redis queues + retry scheduler
- Exponential backoff + idempotency

### AI / Intelligence

- Gemini API (parsing + deep analysis)
- Local embedding model (MiniLM)
- Deterministic ranking + scoring pipeline

### Security

- JWT (access + refresh tokens)
- OTP-based email verification
- bcrypt password hashing

### File Storage

- Cloudinary (resume uploads – frontend owned)

---

## 🧠 System Architecture (Stage 4 – Final)

```
Client (Frontend)
   ↓
Node API (Orchestrator)
   ↓
MongoDB (Source of Truth)
   ↓
Redis Queues
   ↓
Python RQ Workers
   ↓
Node Callback Handlers
   ↓
Atomic MongoDB Updates
```

### Architectural Principles

- Job-centric design (Job is the primary aggregation unit)
- ResumeProcessing is the single source of truth per resume × job
- Workers own all AI logic
- Node owns orchestration and data exposure
- No joins or aggregations on read paths

---

## 🔥 Core Functional Areas

### 1️⃣ Authentication & User Management

- Signup with OTP verification
- Secure login with JWT
- Refresh token rotation
- Recruiter-scoped authorization

---

### 2️⃣ Resume Upload & Metadata Registration

- Resumes uploaded directly from frontend to Cloudinary
- Backend only registers metadata
- Duplicate prevention at job level
- No processing triggered at upload time

---

### 3️⃣ Job Management

- Create and manage job descriptions
- Required skills, preferred skills, experience criteria
- Job is the primary unit for dashboard and ranking

---

## ⚡ Stage 4 — High-Performance Resume Processing Pipeline

### ✔ Batch-Oriented Processing

- Recruiter selects resumes and triggers a batch
- Batch is the **only entry point** to processing
- Each resume becomes an independent background job

### ✔ Distributed Workers

- Multiple Python workers process resumes concurrently
- Parsing, embeddings, pre-filtering, ranking handled by workers
- Retries with exponential backoff

### ✔ Atomic Callbacks

- Workers call back Node when a resume finishes
- Node updates Mongo using atomic `$inc` and `$set`
- Safe under high concurrency

---

## 🧩 Phase 4.4–5 Summary (Brain of the System)

- Deterministic embedding text generation
- Resume & job embeddings stored per ResumeProcessing
- Pre-filtering with pass/fail reasons
- Weighted ranking with finalScore + finalRank
- Transparent explanations (Phase 5A)
- On-demand deep LLM analysis (Phase 5B)

---

## 🚦 Phase 6 — Recruiter Dashboard APIs (FINAL)

Phase 6 exposes a **frontend-ready API surface**. Backend is now frozen.

### Job / Dashboard APIs

| Method | Endpoint                 | Description                                 |
| ------ | ------------------------ | ------------------------------------------- |
| GET    | /api/jobs                | Recruiter dashboard (all jobs)              |
| GET    | /api/jobs/:jobId         | Job metadata                                |
| GET    | /api/jobs/:jobId/resumes | Ranked resume table (paginated, filterable) |

---

### Resume APIs

| Method | Endpoint                       | Description                                   |
| ------ | ------------------------------ | --------------------------------------------- |
| GET    | /api/resumes/:resumeId         | Resume detail (scores, explanation, analysis) |


---

### Processing Trigger

| Method | Endpoint     | Description                        |
| ------ | ------------ | ---------------------------------- |
| POST   | /api/batches | Create batch & enqueue resume jobs |

This is the **only API that starts processing**.

---

## 📊 Dashboard Performance Optimizations

### Denormalized Job Counters

Stored directly on Job:

- totalResumes
- completedResumes
- failedResumes
- lastUpdatedAt

Updated during:

- Batch creation
- Resume processing callbacks

No joins. No aggregation queries.

---

### ResumeProcessing Enhancements

- Added top-level `passFail` field (passed / failed)
- Derived once by worker
- Used for clean filtering and UI display

---

## 🔄 Progressive UX Policy

- Polling-based updates (no WebSockets)
- Embedding-based ranking is canonical
- LLM analysis is enrichment only
- Resume rows update in-place

---

## 🧪 Testing Status

- End-to-end pipeline tested with large batches
- Multiple workers verified
- Retry + backoff validated
- Atomic updates confirmed under concurrency

---

## 📌 Project Status

✅ Stage 4 complete up to Phase 6
✅ Backend feature-frozen
✅ Frontend development can proceed
⏸ Phase 8–11 deferred (cost controls, observability, hardening)

---

## 🔮 Roadmap (Deferred)

- Phase 8: Cost controls, quotas, telemetry
- Phase 9: Metrics, alerts, observability dashboards
- Phase 10: Security hardening & staged rollout
- Phase 11: Enterprise & advanced features

---

## 🤝 Contributing

Follow existing architecture and TypeScript conventions.
Backend APIs are frozen; new features should target frontend or later phases.

---

## 👨‍💻 Developed By

### $SHEKH$ $AALIM$

- [LinkedIn](https://www.linkedin.com/in/shekh-aalim-467b25240/)
- [Instagram](https://www.linkedin.com/in/shekh-aalim-467b25240/)
- [Mail - sheikhaleem363@gmail.com]()
