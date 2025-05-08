import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home.jsx';
import PollRoom from './Components/PollRoom.jsx';
import { ToastContainer } from 'react-toastify';

const socketUrl = 'ws://localhost:5000'; // Replace with your backend WebSocket URL if hosted


export const SocketContext = React.createContext();

function App() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
       <ToastContainer position="top-right" autoClose={3000} />
       
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/poll/:roomCode" element={<PollRoom />} />
        </Routes>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;