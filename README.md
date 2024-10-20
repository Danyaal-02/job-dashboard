# Job Posting Board with Email Automation

This project is a Full-Stack Job Posting Board built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It allows companies to register, verify their accounts via email, post job listings, and send automated job alert emails to candidates.

## 🚀 Features

- **User Registration (Company)**: Companies can register by providing basic details. Email and mobile verification are required for account activation.
- **Company Login**: Login system implemented with JWT for session-based authentication.
- **Job Posting**: Authenticated companies can post jobs with details like title, description, experience level, candidate email, and end date.
- **Candidate Email Automation**: Companies can send automated job alerts or updates to multiple candidates using Nodemailer.
- **Logout**: Secure logout option implemented to clear authentication tokens.

## 📋 Functional Requirements
1. **Company Registration**: Register with name, company details, email, and phone verification.
2. **Login/Authentication**: Use JWT to authenticate users.
3. **Post Job**: Authenticated companies can post job vacancies.
4. **Email Automation**: Send job updates to multiple candidates using automated email services like Nodemailer.
5. **Responsive Design**: UI implemented following the Figma design.

## 📂 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Email Automation**: Nodemailer
- **Authentication**: JWT (JSON Web Tokens)

## 🛠️ Installation and Setup Instructions

Follow these instructions to run the project locally:

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Danyaal-02/job-dashboard.git
   cd job-dashboard
   ```

2. **Backend Setup**:
   Navigate to the `backend` folder and install the necessary dependencies:
   ```bash
   cd backend
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the backend directory with the following placeholder values:

   ```bash
   # Email Configuration (SMTP Settings)
   SMTP_HOST=smtp.your-email-provider.com
   SMTP_PORT=your_smtp_port
   SMTP_USERNAME=your_smtp_username
   SMTP_PASSWORD=your_smtp_password
   EMAIL_FROM=noreply@yourdomain.com

   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number

   # Application Settings
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/your_database_name
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173

   ```

4. **Run Backend**:
   Start the backend server:
   ```bash
   npm run dev
   ```

5. **Frontend Setup**:
   Navigate to the `frontend` folder and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

6. **Environment Variables**:
   Create a `.env` file in the frontend directory with:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

7. **Run Frontend**:
   Start the React frontend:
   ```bash
   npm run dev
   ```

### Local Access
- **Frontend**: Open [http://localhost:5173](http://localhost:5173)
- **Backend**: Open [http://localhost:5000](http://localhost:5000)

## 📧 Email Automation Setup

This project uses **Nodemailer** for sending automated emails to candidates. Ensure that you have the correct email credentials (e.g., Gmail, SendGrid) configured in your `.env` file.

### Example `.env` for Email Automation:
```bash
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=your_smtp_port
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=noreply@yourdomain.com
```

## 📚 API Endpoints

Here are some key API routes for the backend:

- `POST /api/auth/register` - Register a new company.
- `POST /api/auth/login` - Login to a company account.
- `POST /api/jobs` - Post a new job (requires authentication).
                    - Send automated job emails to candidates.

## 💻 Deployment

- **Frontend**: Deployed on [Netlify](https://job-dashboard-02.netlify.app).
- **Backend**: Deployed on [Render](https://job-dashboard-s4pp.onrender.com/api)