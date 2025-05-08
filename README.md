# 🗳️ Live Poll Battle

A real-time poll battle application built using **React** for the frontend and **Node.js with WebSocket** for the backend. Users can create or join poll rooms, vote live, and see the results update in real time.

---

## 🚀 Features Implemented

- ✅ Create and join poll rooms using a unique room code.  
- ✅ Real-time vote updates using WebSocket.  
- ✅ Countdown timer for voting in each room.  
- ✅ Responsive and clean UI with separate CSS Modules.  
- ✅ Error handling for invalid room codes.  
- ✅ Modular structure following best practices (components, pages, utils).  
- ✅ Socket.io-based bidirectional communication between frontend and backend.

---

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/live-poll-battle.git
cd live-poll-battle
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev   # or: nodemon server.js
```

### 3. Frontend Setup (React)
```bash
cd frontend
npm install
npm start
```

---

## 🌐 Deployment Instructions

- Update `cors` settings in the backend (`server.js`) to allow requests from the deployed frontend URL.
- Update WebSocket URL in `frontend/src/utils/socket.js`:
  ```js
  const socket = io("https://your-backend-url.com", {
    transports: ["websocket"],
  });
  ```
- Use `npm run build` in frontend to create production build.
- Serve the frontend `build/` folder with Express or deploy separately (e.g., Vercel for frontend, Railway/Render for backend).

---

## 🧠 Architecture & State Sharing Strategy

### 🔄 Vote State Sharing
The vote state is synchronized using **Socket.IO**. When a user votes, the frontend emits a `vote` event via WebSocket. The backend listens for this event, updates the room's vote count, and broadcasts the updated data back to all users in the room using `io.to(room).emit("updateVotes", data)`.

### 🏠 Room Management
Room creation and joining are handled via WebSocket namespaces or room IDs. When a user joins, they emit a `joinRoom` event with a room code. The server verifies or creates the room, adds the user, and associates their socket with that room using `socket.join(roomCode)`. This isolates vote updates and events to the correct room.

---

## 📁 Folder Structure (Frontend)
```
src/
├── components/
│   ├── Home.jsx
│   ├── PollRoom.jsx
│   └── Timer.jsx
├── pages/
│   ├── HomePage.jsx
│   └── RoomPage.jsx
├── styles/
│   ├── Home.module.css
│   ├── PollRoom.module.css
│   └── Timer.module.css
├── utils/
│   └── socket.js
└── App.jsx
```