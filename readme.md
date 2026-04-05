***

# CareerConnect API (Milestone 3 - Backend Implementation)

CareerConnect is a comprehensive web-based university recruitment and mentorship platform. This repository contains the backend implementation built with the MERN stack (Node.js, Express.js, MongoDB), providing fully linked RESTful APIs for resume generation, job applications, and automated interview scheduling.

## 🚀 Setup & Installation Instructions

Follow these steps to set up and run the backend server locally.

### 1. Prerequisites
* **Node.js** (v14 or higher)
* **MongoDB** (Local instance or MongoDB Atlas cluster)

### 2. Installation
Clone the repository and install the required dependencies:
```bash
git clone https://github.com/Zain-Chinoy/Web-Based-Application-Development-Project.git
cd Web-Based-Application-Development-Project
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and configure the following variables:
```env
PORT=5000
MONGO_URI=mongodb+srv://admin:mongodbclusterpass@cluster0.auribn3.mongodb.net/
```

### 4. Running the Server
Start the development server using Nodemon:
```bash
npm run dev
```
You should see the following terminal output:
* `MongoDB Connected: <host>`
* `Server running on port 5000`
* `Background cron job initialized: Checking for expired interviews...`

---

## 🏗️ Core Architecture & Features
* **Automated Background Tasks (`node-cron`):** A cron job sweeps the database every minute to automatically cancel any pending interview requests that exceed the 24-hour confirmation window.
* **Dynamic PDF Generation (`pdfkit`):** Converts stored JSON resume profiles into highly formatted, downloadable PDF documents.
* **Relational Data Mapping:** All MongoDB models (`User`, `Resume`, `Job`, `Application`, `Interview`) are strongly linked using `mongoose.Schema.Types.ObjectId` to allow complex `.populate()` queries.

---

## 📖 API Endpoint Documentation

### User Authentication & Management
Handles the creation of Student and Recruiter accounts to generate valid IDs for the workflows.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register a new Student or Recruiter account. |
| `POST` | `/api/users/login` | Authenticate a user and receive their profile ID/Token. |

**Example Request Body (`POST /api/users/register`):**
```json
{
    "name": "Muhammad Zain Chinoy",
    "email": "zain@khi.iba.edu.pk",
    "password": "securepassword123",
    "role": "Student"
}
```

*Note: In the request formats below, all ID fields (e.g., `studentId`, `jobId`) expect valid MongoDB ObjectIds.*

### Workflow 1: Standardized Resume Builder
Handles the creation, retrieval, and dynamic PDF generation of student profiles.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/resumes` | Create or update (upsert) a student's resume profile. |
| `GET` | `/api/resumes/:studentId` | Fetch the raw JSON data of a student's resume for live preview. |
| `GET` | `/api/resumes/:studentId/pdf` | Generate and download the resume as a formatted PDF. |

**Example Request Body (`POST /api/resumes`):**
```json
{
    "studentId": "648a12345678901234567890",
    "personalInfo": {
        "fullName": "John Doe",
        "email": "john.doe@university.edu",
        "phone": "+1234567890",
        "address": "123 Campus Dr"
    },
    "education": {
        "degree": "BS Computer Science",
        "university": "State University",
        "gpa": "3.8",
        "startDate": "Aug 2023",
        "endDate": "May 2027"
    },
    "skills": ["JavaScript", "React", "Node.js"],
    "projects": [
        { "title": "Project Alpha", "description": "A web application." }
    ]
}
```

### Workflow 2: Job Application Cycle
Handles job postings by recruiters and one-click applications by students.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/jobs` | Post a new job listing (Recruiter). |
| `GET` | `/api/jobs` | Get all open job listings (Student Job Board). |
| `POST` | `/api/applications` | Apply for a job using a saved resume profile (One-Click Apply). |
| `GET` | `/api/applications/student/:studentId`| View application history and statuses (Student Dashboard). |
| `GET` | `/api/applications/job/:jobId` | View all applicants for a specific posting (Recruiter View). |
| `PUT` | `/api/applications/:id/status` | Update an application status to Shortlisted/Rejected. |

**Example Request Body (`POST /api/jobs`):**
```json
{
    "recruiterId": "648b98765432109876543210",
    "title": "Software Engineer Intern",
    "company": "Tech Corp",
    "description": "Summer internship for CS students.",
    "requirements": ["Node.js", "Express"],
    "location": "Remote",
    "type": "Internship",
    "deadline": "2026-05-15"
}
```

**Example Request Body (`POST /api/applications`):**
```json
{
    "jobId": "648c11112222333344445555",
    "studentId": "648a12345678901234567890",
    "resumeId": "648d55556666777788889999"
}
```

### Workflow 3: Time-Bound Interview Cycle
Handles the proposal, confirmation, and automatic expiration of interview slots.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/interviews` | Propose an interview slot (starts 24-hour expiration clock). |
| `GET` | `/api/interviews/student/:studentId` | View all pending and confirmed interviews (Student). |
| `PUT` | `/api/interviews/:id/confirm` | Confirm an interview slot (generates meeting link). |

**Example Request Body (`POST /api/interviews`):**
```json
{
    "jobId": "648c11112222333344445555",
    "studentId": "648a12345678901234567890",
    "recruiterId": "648b98765432109876543210",
    "scheduledDate": "2026-06-01T14:00:00Z"
}
```

***