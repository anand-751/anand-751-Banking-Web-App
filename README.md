# anand-751-Banking-Web-App
Developed a secure online banking platform enabling users to manage accounts, view balances, transfer funds, and access personalized dashboards.
# 💳 Banking Web App

A secure, full-stack **online banking platform** that allows users to manage accounts, check balances, transfer funds, and access personalized dashboards. Built with **authentication, authorization**, and role-specific panels (Admin & User), this project demonstrates a complete and secure banking solution using modern web technologies.

---

## 🚀 Features

- 🔐 **Authentication using JSON Web Tokens (JWT)**
- 🧑‍💼 **Role-based access** (User & Admin)
- 🏦 **Account management** (view balances, transaction history)
- 💸 **Secure fund transfers** between accounts
- 📊 **Admin panel** for user management and system oversight
- 🧑‍💻 **User dashboard** with personalized account data
- 🗄️ **SQLite** for lightweight, fast database management
- 🧱 **RESTful API** for frontend-backend communication

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (or optionally React)
- **Backend**: Node.js, Express.js
- **Authentication**: JWT (JSON Web Token)
- **Database**: SQLite (with `sqlite3` Node package)
- **Security**: Bcrypt for password hashing, CORS protection, input sanitization

---

## Setup Instructions
1️⃣ **Clone the Repo**
git clone [https://github.com/yourusername/Banking-WebApp.git](https://github.com/anand-751/anand-751-Banking-Web-App.git)
cd Banking-WebApp

2️⃣ **Install Backend Dependencies**
cd server -> 
npm install

3️⃣ **Create .env** file in /server

4️⃣ **Start the Server** : 
npm start

5️⃣ **start frontend** server : 
cd client ->
npm run dev

🔒 **Security Highlights** : 
1. Passwords hashed with bcrypt
2. JWT for token-based auth, stored securely
3. Role-based middleware for protected routes

👨‍💻 **Made by**
Anand Choudhary






