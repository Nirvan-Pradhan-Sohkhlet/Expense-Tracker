# **Ledgerly \- Intelligent Personal Finance Tracker**

Ledgerly is a modern, full-stack financial monitoring application designed to simplify expense tracking and budgeting. Built on the **MERN (MongoDB, Express, React, Node.js)** architecture, Ledgerly helps users visualize monthly spending, manage category-specific limits, and gain clear spending insights through a clean, responsive, dark-mode-optimized dashboard.

## **✨ Features**

* **Real-time Dashboard:** Immediate feedback on total spending, transaction summaries, and budget health.  
* **Category spending visualization:** Interactive, high-contrast doughnut charts powered by **Recharts** to prevent color overlap and optimize readability.  
* **Traffic-Light Budgeting:** Dynamic alert status (Blue/Yellow/Red) showing budget usage rates and warns users when reaching 80% and 100% caps.  
* **Mobile-First Responsive UI:** Responsive sidebar navigation featuring an adaptive Hamburger Menu drawer for small screens (md:hidden).  
* **Secure JWT Session Management:** Authorization tokens saved in localStorage and automatically attached to API calls via custom Axios interceptors.  
* **Monthly reset:** Effortless reset mechanism to clear monthly transaction history while preserving persistent budget configurations.

## **🛠️ Tech Stack & Dependencies**

### **Frontend (Client)**

* **React.js** (Functional components with hooks)  
* **Tailwind CSS** (Modern utility-first styling and media layouts)  
* **Recharts** (Interactive SVG graphing)  
* **Lucide React** (Clean design icon library)  
* **Axios** (Centralized HTTP connection instance with request interceptors)

### **Backend (Server)**

* **Node.js** & **Express** (Robust REST API architecture)  
* **Mongoose** (MongoDB Object Document Modeling)  
* **Bcrypt.js** (Industry-standard password salting & hashing)  
* **JSON Web Token (JWT)** (Stateless microservice authorization)  
* **CORS** (Cross-Origin Resource Sharing control)

## **📂 Project Structure**

├── client/                      \# React Frontend Application  
│   ├── public/                  \# Static public assets (Favicon, manifest, index.html)  
│   └── src/  
│       ├── components/          \# Reusable UI Components (Sidebar, Navbar, Chart)  
│       ├── context/             \# Global states (UserContext)  
│       ├── pages/               \# Page Modules (Dashboard, Login, Signup, Budgets)  
│       ├── services/            \# Axios API wrappers (api.js, authService.js)  
│       ├── App.jsx              \# App layout, global routes, & responsive triggers  
│       └── index.js             \# Client mounting point  
│  
└── server/                      \# Express Node.js Backend Application  
    ├── controllers/             \# Express API controllers (auth, expense, budget, ocr)  
    ├── middleware/              \# Authentication security check gates  
    ├── models/                  \# Mongoose MongoDB Document schemas  
    ├── routes/                  \# Express REST Endpoint routers  
    └── server.js                \# Server initialization point

## **💻 Local Installation & Setup**

Ensure you have [Node.js](https://nodejs.org/) and a [MongoDB Atlas](https://www.mongodb.com/) account ready before starting.

### **Step 1: Clone the Repository**

git clone \[https://github.com/Nirvan-Pradhan-Sohkhlet/Expense-Tracker.git\](https://github.com/Nirvan-Pradhan-Sohkhlet/Expense-Tracker.git)  
cd Expense-Tracker

### **Step 2: Configure Backend Environment**

Navigate into the server/ directory and create a .env file:

cd server  
touch .env

Populate your .env with the following variables:

PORT=5000  
MONGO\_URI=mongodb+srv://\<username\>:\<password\>@cluster.mongodb.net/ledgerly?retryWrites=true\&w=majority  
JWT\_SECRET=your\_jwt\_private\_key\_string  
NODE\_ENV=development

*Make sure to replace \<username\> and \<password\> with your secure database credentials.*

### **Step 3: Install Backend Dependencies & Start Server**

npm install  
npm run dev

The server will boot up locally at http://localhost:5000.

### **Step 4: Configure Frontend Environment**

In a new terminal window, navigate to the client/ directory:

cd client

If you need to change your connection points, configure your base URL inside client/src/services/api.js and client/src/services/authService.js. For local development, point them to:

const API\_URL \= 'http://localhost:5000/api';

### **Step 5: Install Frontend Dependencies & Start App**

npm install  
npm start

The React dev server will spin up and launch in your browser at http://localhost:3000.

## **☁️ Deployment (Railway)**

This repository is pre-configured to deploy seamlessly as individual services on [Railway](https://railway.app/).

1. **Server Service Setup:**  
   * Create a new project in your Railway Dashboard and connect your repository pointing to /server.  
   * Add the Environment Variables: MONGO\_URI, JWT\_SECRET, and NODE\_ENV=production.  
   * Generate a custom domain in **Settings** (e.g., https://your-server.up.railway.app).  
2. **Client Service Setup:**  
   * Connect your repository pointing to the /client directory.  
   * Ensure that the client configuration files point to your live backend server URL rather than localhost:5000.  
   * Generate a secure public domain to access Ledgerly.

## **🔒 Security Practices**

* **Zero Keys Contained:** Credentials are kept strictly within ignored local environment configuration files (.env) and managed through secure cloud configuration stores.  
* **Encryption standard:** Plaintext passwords are never stored. The system applies 10 rounds of salt-generation hashing via bcryptjs before committing any profile data.
