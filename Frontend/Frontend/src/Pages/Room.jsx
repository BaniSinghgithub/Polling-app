import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../utils/socket";
import styles from "../styles/PollRoom.module.css";

function RoomPage() {
  const { roomCode } = useParams();
  const username = localStorage.getItem("username");
  const [votes, setVotes] = useState({ cats: 0, dogs: 0 });
  const [voted, setVoted] = useState(localStorage.getItem(`voted_${roomCode}`));
  const [pollEnded, setPollEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    socket.emit("joinRoom", { roomCode, username }, (res) => {
      if (res.error) return alert(res.error);
      setVotes(res.roomData.votes);
      const endTime = res.roomData.endTime;
      const timer = setInterval(() => {
        const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTimeLeft(diff);
        if (diff <= 0) {
          clearInterval(timer);
          setPollEnded(true);
        }
      }, 1000);
    });

    socket.on("voteUpdate", (data) => setVotes(data));
    socket.on("pollEnded", () => setPollEnded(true));
  }, [roomCode, username]);

  const castVote = (option) => {
    if (voted || pollEnded) return;
    socket.emit("vote", { roomCode, username, option });
    localStorage.setItem(`voted_${roomCode}`, option);
    setVoted(option);
  };

  return (
    <div className={styles.container}>
      <h2>Poll: Cats vs Dogs</h2>
      <p>Time left: {timeLeft} sec</p>
      <div className={styles.votes}>
        <button disabled={!!voted || pollEnded} onClick={() => castVote("cats")}>Cats</button>
        <span>{votes.cats}</span>
        <button disabled={!!voted || pollEnded} onClick={() => castVote("dogs")}>Dogs</button>
        <span>{votes.dogs}</span>
      </div>
      {voted && <p>You voted for {voted}</p>}
      {pollEnded && <p>Voting has ended.</p>}
    </div>
  );
}

export default RoomPage;
