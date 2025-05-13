
"use client";

import { InterviewInterface } from '@/components/interview/interview-interface';
import type { TestPaper } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

// Mock Interview Data - In a real app, this would be fetched from a backend
const mockInterviewPapers: Record<string, TestPaper> = {
  '1': { // Corresponds to Google Interview from candidate dashboard mock data
    id: '1',
    name: 'Google Frontend Engineer – Intern Interview',
    duration: 30, // Overall interview duration in minutes
    durationUnit: 'minutes',
    formats: ['Audio/Video'], // Indicates video questions
    questions: [
      { 
        id: 'interview_q1_1', 
        text: 'Tell me about yourself and why you are interested in this role.', 
        type: 'Audio/Video', 
        prompt: 'Please record your answer. You have a maximum of 2 minutes.', 
        maxDuration: 120 // seconds
      },
      { 
        id: 'interview_q1_2', 
        text: 'Describe a challenging project you worked on and how you overcame the obstacles.', 
        type: 'Audio/Video', 
        prompt: 'Share your experience. You have a maximum of 3 minutes for this response.', 
        maxDuration: 180 // seconds
      },
      {
        id: 'interview_q1_3',
        text: 'Why are you interested in working at Google?',
        type: 'Audio/Video',
        prompt: 'Explain your motivation. Max 2 minutes.',
        maxDuration: 120
      }
    ],
    status: 'Published',
  },
   '4': { // Corresponds to Netflix UX Designer Interview
    id: '4',
    name: 'Netflix UX Designer Behavioral Interview',
    duration: 20,
    durationUnit: 'minutes',
    formats: ['Audio/Video'],
    questions: [
        { id: 'interview_q4_1', text: 'Walk us through your design process for a recent project.', type: 'Audio/Video', prompt: 'Record your answer. Max 4 minutes.', maxDuration: 240 },
        { id: 'interview_q4_2', text: 'How do you handle feedback on your designs?', type: 'Audio/Video', prompt: 'Record your answer. Max 3 minutes.', maxDuration: 180 },
    ],
    status: 'Published',
  },
  // Fallback interview paper
  'default_interview': {
    id: 'default_interview',
    name: 'Sample Behavioral Interview',
    duration: 10,
    durationUnit: 'minutes',
    formats: ['Audio/Video'],
    questions: [
      { id: 'di_q1', text: 'What are your strengths?', type: 'Audio/Video', prompt: 'Record your answer. Max 1 minute.', maxDuration: 60 },
      { id: 'di_q2', text: 'Where do you see yourself in 5 years?', type: 'Audio/Video', prompt: 'Record your answer. Max 2 minutes.', maxDuration: 120 },
    ],
    status: 'Published',
  }
};


export default function InterviewPage() {
  const params = useParams();
  const interviewId = typeof params.interviewId === 'string' ? params.interviewId : 'default_interview';
  const [interviewPaper, setInterviewPaper] = useState<TestPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Simulate API fetch
    setTimeout(() => {
      const fetchedInterviewPaper = mockInterviewPapers[interviewId] || mockInterviewPapers['default_interview'];
      if (fetchedInterviewPaper) {
        let durationInMinutes = fetchedInterviewPaper.duration;
        if (fetchedInterviewPaper.durationUnit === 'hours') {
          durationInMinutes = fetchedInterviewPaper.duration * 60;
        }
        setInterviewPaper({...fetchedInterviewPaper, duration: durationInMinutes});
        setError(null);
      } else {
        setError('Interview session not found.');
        setInterviewPaper(null);
      }
      setLoading(false);
    }, 500);
  }, [interviewId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading interview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-destructive text-lg">{error}</p>
      </div>
    );
  }

  if (!interviewPaper) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-muted-foreground">Could not load the interview. Please try again later.</p>
      </div>
    );
  }

  return <InterviewInterface interviewPaper={interviewPaper} />;
}
