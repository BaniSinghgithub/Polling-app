import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../Styles/PollRoom.module.css';
import Timer from './Timer';
import socket from '../Utils/socket';

const PollRoom = () => {
  const { roomCode } = useParams();
  const [votes, setVotes] = useState({ optionA: 0, optionB: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [voteDisabled, setVoteDisabled] = useState(false);

  useEffect(() => {
    socket.emit('joinRoom', roomCode);

    socket.on('updateVotes', updatedVotes => {
      setVotes(updatedVotes);
    });

    const storedVote = localStorage.getItem(`voted_${roomCode}`);
    if (storedVote) setHasVoted(true);

    return () => {
      socket.off('updateVotes');
    };
  }, [roomCode]);

  const handleVote = (option) => {
    if (hasVoted || voteDisabled) return;
    socket.emit('vote', { roomCode, option });
    localStorage.setItem(`voted_${roomCode}`, option);
    setHasVoted(true);
  };

  return (
    <div className={styles.container}>
      <h2 className='question'>Cats vs Dogs?</h2>
      <div className={styles.options}>
        <button disabled={hasVoted || voteDisabled} onClick={() => handleVote('optionA')}>
          Cats ({votes.optionA})
        </button>
        <button disabled={hasVoted || voteDisabled} onClick={() => handleVote('optionB')}>
          Dogs ({votes.optionB})
        </button>
      </div>
      {hasVoted && <p className={styles.messages}>You have voted!</p>}
      <Timer onExpire={() => setVoteDisabled(true)} />
    </div>
  );
};

export default PollRoom;