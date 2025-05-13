"use client";

import { useState, useEffect, useRef } from 'react';

export function useAnimatedCounter(targetValue: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  const targetRef = useRef(targetValue);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    targetRef.current = targetValue; 
  }, [targetValue]);

  useEffect(() => {
    let startTime: number | null = null;
    const initialCount = 0; 

    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(initialCount + (targetRef.current - initialCount) * percentage));

      if (progress < duration) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(targetRef.current); 
      }
    };

    if (targetRef.current === 0) {
        setCount(0);
    } else {
        animationFrameRef.current = requestAnimationFrame(animate);
    }
    

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [duration, targetValue]); 

  return count;
}
