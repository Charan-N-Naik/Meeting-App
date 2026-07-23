# 🎥 MeetingApp - Real-Time Video Conferencing & Chat Platform

MeetingApp is a full-stack, real-time video conferencing and instant messaging application built with **React**, **Node.js**, **Express**, **MongoDB**, **Socket.IO**, and **WebRTC**. It allows users to create video call rooms, stream peer-to-peer audio and video, share screen/camera, exchange real-time chat messages, and maintain a history of their meeting activities.

---

## 🚀 Features

- 🔐 **User Authentication**: Secure user registration and login with encrypted passwords (bcrypt) and session tokens.
- 📹 **Peer-to-Peer Video Calls**: High-quality video & audio streaming powered by WebRTC and Socket.IO signaling.
- 💬 **In-Call Real-Time Chat**: Live room chat allowing participants to send and receive text messages during video calls.
- 🎛️ **Media Controls**: Easily toggle microphone (mute/unmute) and camera (video on/off) during calls.
- 💻 **Screen Sharing**: Support for real-time video stream & screen sharing integration.
- 📜 **Meeting History**: Keep track of joined meeting rooms and view past meeting activity log per user account.
- 🚪 **Guest & Instant Join**: Join existing rooms via meeting codes directly from the home or landing page.
- 🎨 **Modern Responsive UI**: Clean and intuitive interface crafted with Material-UI (MUI) and custom styling.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **UI Components**: [Material-UI (@mui/material)](https://mui.com/), `@mui/icons-material`, `@emotion/react`
- **Real-Time Communication**: [Socket.IO Client](https://socket.io/), WebRTC (`RTCPeerConnection`, `navigator.mediaDevices`)
- **HTTP Client**: [Axios](https://axios-http.com/)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js v5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ORM](https://mongoosejs.com/)
- **WebSockets**: [Socket.IO](https://socket.io/) for WebRTC signaling and real-time messaging
- **Authentication & Security**: `bcrypt` password hashing, `crypto` token generation, `cors` middleware

---

## 📂 Directory Structure

```
MeetingApp/
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   │   ├── AuthRoutes.js       # Auth & history controllers (login, register, activity log)
│   │   │   └── Socketmaneger.js    # Socket.IO connection & signaling logic
│   │   ├── moduls/
│   │   │   ├── user.model.js       # MongoDB User schema
│   │   │   └── meeting.model.js    # MongoDB Meeting schema
│   │   └── routes/
│   │       └── users.Routes.js     # User API route definitions
│   ├── app.js                      # Express & Socket.IO server entry point
│   ├── package.json
│   └── .env                        # Backend environment variables
│
├── frontend/
│   ├── src/
│   │   ├── contexts/
│   │   │   └── AuthComnntext.js    # Authentication Context Provider
│   │   ├── pages/
│   │   │   ├── landing.jsx         # Landing page component
│   │   │   ├── Authontication.jsx  # Login / Register page
│   │   │   ├── Home.jsx            # User dashboard page
│   │   │   ├── histrory.jsx        # User meeting history page
│   │   │   └── videoMeet.jsx       # Video conference room component (WebRTC & Socket.IO)
│   │   ├── App.js                  # Main application routes setup
│   │   └── index.js                # React DOM render entry point
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── README.md                       # Root documentation (this file)
```

---

## ⚙️ Environment Setup

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
DB_URL=your_mongodb_connection_string
```

---

## 📥 Installation & Running Locally

### **1. Prerequisites**
- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB cluster or local instance

---

### **2. Backend Setup**

Navigate to the `backend` folder and install dependencies:

```bash
cd backend
npm install
```

Start the backend server in development mode (using Nodemon):

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`.

---

### **3. Frontend Setup**

Open a new terminal window, navigate to the `frontend` folder, and install dependencies:

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`.

---

## 📡 API Endpoints Reference

### **User Routes** (`/api/v1/users`)

| Method | Endpoint | Description | Request Body / Parameters |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user | `{ "name": "...", "username": "...", "password": "..." }` |
| `POST` | `/login` | Authenticate existing user | `{ "username": "...", "password": "..." }` |
| `POST` | `/add_to_activity` | Add meeting code to user history | `{ "token": "...", "meeting_code": "..." }` |
| `GET` | `/get_all_activity` | Retrieve all meetings for a user | `?token=...` (Query Parameter) |
| `GET` | `/home` | Health check route | None |

---

## ⚡ Socket.IO Signaling Events

| Event Name | Direction | Description |
| :--- | :--- | :--- |
| `join-call` | Client ➔ Server | Emitted when a user enters a meeting room |
| `user-joined` | Server ➔ Client | Broadcasted to room members when a new participant joins |
| `signal` | Bidirectional | Exchanging WebRTC SDP offer, answer, and ICE candidates |
| `chat-message` | Bidirectional | Real-time text message exchange between room members |
| `user-left` | Server ➔ Client | Broadcasted when a participant disconnects from the call |

---

## 🧑‍💻 Author

- **Charan N Naik**

---

## 📄 License

This project is licensed under the **ISC License**.
