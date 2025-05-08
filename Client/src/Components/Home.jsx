import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/Home.module.css';
import { toast } from 'react-toastify';

const Home = () => {
    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const createRoom = () => {
        if(name.length===0)return toast.error("Please enter your name");
        const code = Math.random().toString(36).substring(2, 8);
        navigate(`/poll/${code}`);
    };

    const joinRoom = () => {
        if(roomCode.length===0)return toast.error("Please enter room code");
        navigate(`/poll/${roomCode}`);
    };

    return (
        <div className={styles.container}>
            <h1>Live Poll Battle</h1>
            <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={createRoom}>Create Room</button>
            <input type="text" placeholder="Enter room code" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
            <button onClick={joinRoom}>Join Room</button>
        </div>
    );
};

export default Home;
