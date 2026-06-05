import { useState, useEffect, useCallback } from 'react';

export function useGameStats() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer effect
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (isRunning) {
      intervalId = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [isRunning]);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setTime(0);
    setIsRunning(false);
  }, []);

  const incrementMoveCount = useCallback(() => {
    setMoveCount(prev => prev + 1);
  }, []);

  const completeGame = useCallback(() => {
    setIsCompleted(true);
    setIsRunning(false);
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    time,
    isRunning,
    moveCount,
    isCompleted,
    startTimer,
    pauseTimer,
    resetTimer,
    incrementMoveCount,
    completeGame,
    formatTime
  };
}