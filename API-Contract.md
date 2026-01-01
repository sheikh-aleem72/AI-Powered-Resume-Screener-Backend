# 🔒 API Contracts — Recruiter Dashboard Backend

**Status: FROZEN (Phase 6 Complete)**

This document defines the **authoritative API contracts** for the AI‑Powered Resume Screener backend.
These contracts are frozen and must not change during frontend development.

---

## 🧠 Design Principles

- Job‑centric APIs (Job is the primary aggregation unit)
- ResumeProcessing is the single source of truth per resume × job
- No joins or aggregations on read paths
- Deterministic ranking (embedding‑based) is canonical
- LLM analysis is enrichment only
- Polling‑based progressive updates (no WebSockets)

---

## 🔐 Authentication

All APIs require authentication via JWT (Access Token).
Recruiter ownership is enforced on all job and resume‑scoped endpoints.

---

## 📊 Job / Dashboard APIs

### 1️⃣ Get Recruiter Jobs

**GET** `/api/job/`

**Response**

```json
[
  {
    "jobDescriptionId": "job_123",
    "title": "Backend Engineer",
    "totalResumes": 120,
    "completedResumes": 95,
    "failedResumes": 5,
    "lastUpdatedAt": "2025-01-02T09:40:00Z"
  }
]
```

---

### 2️⃣ Get Job Metadata

**GET** `/api/job/:jobDescriptionId`

**Response**

```json
{
  "jobDescriptionId": "job_123",
  "title": "Backend Engineer",
  "description": "...",
  "requiredSkills": ["Node.js", "MongoDB"],
  "preferredSkills": ["Redis"],
  "experience": {
    "minYears": 2
  },
  "totalResumes": 120,
  "completedResumes": 95,
  "failedResumes": 5,
  "createdAt": "2025-01-01T10:00:00Z",
  "lastUpdatedAt": "2025-01-02T09:40:00Z"
}
```

---

### 3️⃣ Get Ranked Resumes for Job (Main Dashboard Table)

**GET** `/api/job/:jobDescriptionId/resumes`

**Query Params (optional)**

- `page` (default: 1)
- `limit` (default: 20)
- `passFail` → `passed | failed`
- `status` → `queued | processing | completed | failed`

**Response**

```json
{
  "page": 1,
  "limit": 20,
  "total": 120,
  "resumes": [
    {
      "resumeId": "res_101",
      "externalResumeId": "RESUME_20250101_0001",
      "rank": 1,
      "finalScore": 0.87,
      "status": "completed",
      "passFail": "passed",
      "analysisStatus": "completed",
      "explanation": "Strong skills match; experience meets requirement"
    }
  ]
}
```

**Notes**

- Sorted strictly by `rank`
- Ranking never changes after completion
- LLM analysis does not reorder resumes

---

### 4️⃣ Progressive Updates (Polling)

**GET** `/api/job/:jobDescriptionId/updates?since=<ISO_TIMESTAMP>`

**Response**

```json
{
  "jobDescriptionId": "job_123",
  "serverTime": "2025-01-02T09:45:00Z",
  "updates": [
    {
      "resumeId": "res_101",
      "status": "completed",
      "analysisStatus": "completed",
      "passFail": "passed",
      "rank": 1,
      "finalScore": 0.87,
      "updatedAt": "2025-01-02T09:44:58Z"
    }
  ]
}
```

---

## 📄 Resume APIs

### 5️⃣ Get Resume Detail

**GET** `/api/processing/:resumeProcessingId`

**Response**

```json
{
  "resumeId": "res_101",
  "resumeUrl": "https://...",
  "externalResumeId": "RESUME_20250101_0001",

  "status": "completed",
  "passFail": "passed",
  "rank": 1,
  "finalScore": 0.87,

  "explanation": {
    "matchedSkills": ["Node.js", "MongoDB"],
    "missingSkills": ["Kafka"]
  },

  "analysisStatus": "completed",
  "analysis": {
    "summary": "Candidate is a strong backend fit..."
  },

  "createdAt": "2025-01-01T10:05:00Z",
  "updatedAt": "2025-01-02T09:44:58Z"
}
```

---

### 6️⃣ Register Uploaded Resumes (Metadata Only)

**POST** `/api/resume/save-meta`

**Request**

```json
{
  "jobDescriptionId": "job_123",
  "resumes": [
    {
      "resumeUrl": "https://...",
      "filename": "john_doe.pdf",
      "size": 345678
    }
  ]
}
```

**Response**

```json
{
  "registered": [
    {
      "resumeObjectId": "resObj_001",
      "resumeUrl": "https://...",
      "filename": "john_doe.pdf"
    }
  ],
  "skipped": 0
}
```

---

### 7️⃣ Trigger Deep Analysis (Manual)

**POST** `/api/processing/:resumeProcessingId/analyze`

**Request**

```json
{ "force": false }
```

**Response**

```json
{
  "resumeId": "res_101",
  "analysisStatus": "queued",
  "message": "Analysis queued successfully"
}
```

**Rules**

- Recruiters cannot force re‑analysis
- Analysis is on‑demand only

---

## ⚙️ Processing Trigger

### 8️⃣ Create Batch (Start Processing)

**POST** `/api/batch/create`

**Request**

```json
{
  "jobDescriptionId": "job_123",
  "resumes": [
    {
      "resumeObjectId": "resObj_001",
      "resumeUrl": "https://..."
    }
  ],
  "size": 345678
}
```

**Response**

```json
{
  "batchId": "BATCH_20250102_0001",
  "acceptedCount": 10,
  "status": "queued"
}
```

---

## 🚫 Explicitly Out of Scope

- WebSockets / SSE
- Auto LLM analysis
- Batch‑level UI
- Real‑time ranking changes
- Forced re‑analysis by recruiters

---

## ✅ Contract Status

✔ Phase 6 complete
✔ Backend APIs frozen
✔ Safe for frontend development
✔ Any change requires explicit version bump

---

**Owner:** Backend (Stage 4)
**Last Updated:** Phase 6 completion
