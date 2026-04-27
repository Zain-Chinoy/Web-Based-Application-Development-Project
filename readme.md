# 🚀 CareerConnect

Welcome to **CareerConnect**, a comprehensive, dual-sided university recruitment platform designed to seamlessly bridge the gap between students seeking opportunities and recruiters hunting for top talent. 

## ✨ Key Features

### 🎓 For Students
* **Interactive Job Board:** Browse active job listings with detailed descriptions, salaries, and deadlines.
* **Flexible Applications:** Apply using a dynamically generated platform profile/resume or upload a custom PDF.
* **Application Tracking:** Monitor the real-time status of applications (Pending, Shortlisted, Rejected).
* **Interview Management:** Receive interview invitations, view scheduled times, and seamlessly confirm or decline. Includes a 24-hour expiration warning for pending invites.
* **Resume Builder:** Construct a professional profile to enable one-click applications.

### 🏢 For Recruiters
* **Job Management:** Post new opportunities with custom requirements, salaries, and deadlines. Easily delete outdated listings.
* **Applicant Review System:** A split-view dashboard to evaluate candidates, view resumes, and seamlessly move them to 'Shortlisted' or 'Rejected' statuses.
* **Interview Scheduling:** Select shortlisted candidates and dispatch time-bound interview invitations.
* **Tabbed Interview Dashboard:** Keep track of candidates pending schedule and review upcoming confirmed interviews.

## 🔄 Core Workflows

This project was developed in distinct milestones, featuring robust workflows:
1. **Resume & Profile Building** *(Areeba)*: Empowering students to build a standardized digital footprint.
2. **Job Application Cycle** *(Zain)*: The end-to-end process of recruiters posting jobs, students applying, and real-time application tracking.
3. **Interview Scheduling Cycle** *(Aafia)*: A time-sensitive scheduling engine featuring an automated `node-cron` background job that automatically expires unconfirmed interviews after 24 hours.

## 🛠️ Tech Stack
* **Frontend:** React.js, React Router, Tailwind CSS, Lucide React (Icons), Axios, React Hot Toast
* **Backend:** Node.js, Express.js
* **Database:** MongoDB & Mongoose
* **Automation:** Node-Cron (for 24-hour automated task expiration)

## 🚀 Getting Started

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) installed and running on your local machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/CareerConnect.git](https://github.com/your-username/CareerConnect.git)
   cd CareerConnect
   ```

2. **Setup the Backend:**
   ```bash
   # Install backend dependencies
   npm install

   # Create a .env file in the root directory and add your variables:
   MONGO_URI=mongodb://localhost:27017/careerconnect
   PORT=5000
   ```

3. **Setup the Frontend:**
   ```bash
   cd frontend
   
   # Install frontend dependencies
   npm install
   ```

### Running the Application

Open two terminal windows/tabs:

**Terminal 1 (Backend):**
```bash
# In the root directory
node server.js
```

**Terminal 2 (Frontend):**
```bash
# In the /frontend directory
npm run dev
```

The application will now be running. The frontend is accessible via `http://localhost:5173` (or your Vite configured port), and the backend API is actively listening on `http://localhost:5000`.
```
