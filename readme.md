# 🌐 CommunityConn8 (Sahay)

A full-stack MERN platform designed to **bridge the gap between communities, NGOs, and volunteers** by enabling seamless issue reporting, volunteer assignment, and real-time collaboration.

---

## 🚀 Overview

CommunityConn8 (Sahay) is a centralized platform where:

* 🧑‍🤝‍🧑 Citizens can report local issues
* 🏢 NGOs/Admins can monitor and manage problems
* 🙋 Volunteers can get assigned and contribute

The goal is to create a **transparent, efficient, and scalable system** for solving real-world community problems.

---

## 🧠 Problem Statement

Many community issues (waste management, road damage, water supply, etc.) go unresolved due to:

* Lack of visibility
* Poor coordination between authorities and volunteers
* No centralized reporting system

👉 CommunityConn8 solves this by providing a **single digital platform** for reporting, tracking, and resolving issues.

---

## ✨ Features

* 🔐 **Authentication System**

  * Secure signup/login
  * Role-based access (Admin / Volunteer / User)

* 📝 **Issue Reporting**

  * Users can create and describe issues
  * Attach details for better clarity

* 📋 **Admin Dashboard**

  * View all reported issues
  * Assign volunteers to tasks

* 🙋 **Volunteer System**

  * Volunteers receive assigned tasks
  * Update progress/status

* 🗺️ **(Planned) Map Integration**

  * Visualize issues geographically

* 📊 **(Planned) Smart Insights**

  * Analytics and AI-based prioritization

---

## 🛠️ Tech Stack

### Frontend

* React.js
* CSS / Tailwind (if used)

### Backend

* Node.js
* Express.js

### Database

* MongoDB (via MongoDB Atlas)

### Deployment

* Backend + Frontend (Single Deployment) on Render

---

## 🏗️ Architecture

```
Client (React)
     ↓
Express Server (Node.js)
     ↓
MongoDB Atlas (Database)
```

👉 The frontend is built and served by the backend for a **single unified deployment**.

---

## ⚙️ Getting Started (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/CommunityConn8.git
cd CommunityConn8
```

---

### 2. Install dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

---

### 3. Setup Environment Variables

Create a `.env` file inside `/server`:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

---

### 4. Run the app

#### Start backend

```bash
cd server
npm run dev
```

#### Start frontend

```bash
cd client
npm run dev
```

---

## 🚀 Deployment

This project uses a **single deployment strategy**:

* React app is built using:

```bash
npm run build
```

* The build is served via Express:

```js
app.use(express.static("client/build"));
```

* Deployed on Render

---

## 📂 Folder Structure

```
CommunityConn8/
│
├── client/        # React frontend
├── server/        # Node + Express backend
├── models/        # MongoDB schemas
├── routes/        # API routes
├── controllers/   # Logic layer
└── .env
```

---

## 🧪 Future Improvements

* 📍 Google Maps integration
* 🤖 AI-based issue prioritization
* 📱 Mobile responsiveness improvements
* 🔔 Notifications system
* 📊 Analytics dashboard

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a PR

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Inspiration

Built with the vision of creating **smarter, connected communities** through technology.

---

## 👨‍💻 Author

Developed by Himeshkar
Passionate about Full Stack Development, AI, and building impactful tech 🚀

---
