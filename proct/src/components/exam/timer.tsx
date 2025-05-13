"use client";

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  durationMinutes: number; // Duration in minutes
  onTimeUp: () => void;
}

export function Timer({ durationMinutes, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60); // Convert to seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const timeColorClass = timeLeft <= 5 * 60 ? 'text-destructive' : 'text-foreground'; // Red if <= 5 mins left

  return (
    <div className={`flex items-center gap-2 font-medium ${timeColorClass}`}>
      <Clock className={`h-5 w-5 ${timeLeft <= 5 * 60 ? 'text-destructive' : 'text-primary'}`} />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      <span className="text-sm text-muted-foreground">remaining</span>
    </div>
  );
}
