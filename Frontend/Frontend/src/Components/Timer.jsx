import React, { useEffect, useState } from 'react';
import styles from '../Styles/Timer.module.css';

const Timer = ({ onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire]);

  return (
    <div className={styles.timer}>
      Voting ends in: <span className={styles.countdown}>{timeLeft}s</span>
    </div>
  );
};

export default Timer;