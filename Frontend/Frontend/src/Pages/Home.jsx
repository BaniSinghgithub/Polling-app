import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import styles from "../styles/Home.module.css";

function HomePage() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    socket.emit("createRoom", { username: name }, ({ roomCode }) => {
      localStorage.setItem("username", name);
      navigate(`/room/${roomCode}`);
    });
  };

  const joinRoom = () => {
    socket.emit("joinRoom", { roomCode, username: name }, (res) => {
      if (res.error) return alert(res.error);
      localStorage.setItem("username", name);
      navigate(`/room/${roomCode}`);
    });
  };

  return (
    <div className={styles.container}>
      <h1>Live Poll Battle</h1>
      <input placeholder="Enter name" onChange={(e) => setName(e.target.value)} />
      <button onClick={createRoom}>Create Room</button>
      <input placeholder="Room code" onChange={(e) => setRoomCode(e.target.value)} />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
}

export default HomePage;
