# 🤝 Sahay — Community Relief Platform

> **Connecting citizens, NGOs, and volunteers to solve real local problems.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-sahay--dsqw.onrender.com-brightgreen?style=for-the-badge)](https://sahay-dsqw.onrender.com)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)](#-tech-stack)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 📖 What is Sahay?

**Sahay** (meaning *"help"* in Hindi) is a full-stack community relief web platform that bridges the gap between people facing local problems and those willing to act on them. Citizens report issues, NGOs and admins coordinate responses, and volunteers get assigned actionable tasks — all in one transparent workflow.

> *Why are local issues still unresolved despite having people willing to help?*

Sahay exists to answer that question.

---

## 🎯 Problem Statement

Everyday local problems — waste management, road damage, water shortages — often remain unresolved due to:

- **No central visibility** — issues go unreported or unnoticed
- **Poor coordination** — helpers don't know where to show up
- **No accountability** — no way to track progress or resolution

Sahay provides a **structured digital ecosystem** where every issue is logged, assigned, and resolved with full transparency.

---

## ✨ Features

### 🔐 Authentication & Role-Based Access
- Secure signup and login system
- Role-based access control — different views and permissions for Citizens, Volunteers, and Admins/NGOs

### 📝 Issue Reporting (Citizens)
- Easily create and submit local issues
- Add detailed descriptions to ensure clarity for responders

### 🏢 Admin / NGO Dashboard
- View all reported issues in a unified dashboard
- Assign issues to specific volunteers
- Track the status of ongoing tasks

### 🙋 Volunteer Management
- Volunteers can view tasks assigned to them
- Status tracking so progress is always visible to all parties

### ⚡ Unified Deployment
- React frontend served directly through Express — no separate hosting needed
- Clean, scalable single-deployment architecture

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (MongoDB Atlas) |
| **Deployment** | Render |
| **Languages** | JavaScript (74.9%), CSS (23%), HTML (2.1%) |

---

## 🏗️ Architecture

```
React (Client)
      ↓
Node.js + Express (API Server)
      ↓
MongoDB Atlas (Cloud Database)
```

The React app is built and served through Express, enabling a unified, single-process deployment on Render.

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/Himeshkar11/sahay--dark-and-prototype.git
cd sahay--dark-and-prototype
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `/backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### 4. Run the Application

```bash
# Start the backend server
cd backend
npm run dev

# In a separate terminal, start the frontend
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (API).

---

## 🚀 Deployment

This project is deployed on **Render** using a unified setup where Express serves the built React app.

```bash
# Build the React frontend
cd frontend && npm run build

# Express serves static build files
app.use(express.static("frontend/build"));
```

**Live URL:** [https://sahay-dsqw.onrender.com](https://sahay-dsqw.onrender.com)

---

## 📂 Project Structure

```
sahay--dark-and-prototype/
│
├── frontend/          # React.js application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
│
├── backend/           # Node.js + Express API
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API route definitions
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth & other middleware
│   └── server.js
│
├── package.json       # Root config
└── .gitignore
```

---

## 🔮 Upcoming Features

- 💳 **Payment Integration** — accept donations and payments directly within the platform
- 📊 **Live Data Pulling from Google Sheets / Excel** — sync real-time data from spreadsheets to keep issue records and reports up to date automatically

---

## 🤝 Contributing

Contributions are welcome and encouraged!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add: your feature description"`
4. Push the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code is clean and well-commented before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 💡 Vision

To build a future where **technology empowers communities to solve their own problems — efficiently, transparently, and together.**

---

## 👨‍💻 Author

**Himeshkar**
B.Tech CSE Student | Full Stack Developer | AI Enthusiast

[![GitHub](https://img.shields.io/badge/GitHub-Himeshkar11-black?style=flat-square&logo=github)](https://github.com/Himeshkar11)

---

⭐ If Sahay inspires you, give it a star — it means a lot!
