"use client";

import { RealtimeInterviewUI } from '@/components/interview/realtime-interview-ui';
import type { LiveInterviewSessionData, TestQuestion } from '@/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Mock Live Interview Data - In a real app, this would be fetched from a backend
const mockLiveInterviewSessions: Record<string, LiveInterviewSessionData> = {
  '1': { // Corresponds to Google Interview from candidate dashboard (ID '1')
    id: '1',
    title: 'Google Frontend Engineer – Live Interview',
    interviewerName: 'Dr. Emily Carter',
    candidateName: 'Alex Johnson (You)', // Assuming candidate is logged in
    questions: [
      { 
        id: 'live_q1_1', 
        text: 'Welcome! Tell me about yourself and your journey into frontend development.', 
        type: 'Discussion', 
        prompt: 'Focus on key experiences and motivations.'
      },
      { 
        id: 'live_q1_2', 
        text: 'Can you explain the concept of the Virtual DOM in React and its benefits?', 
        type: 'Discussion',
      },
      { 
        id: 'live_q1_3', 
        text: 'Let\'s do a small coding exercise. Please write a JavaScript function to debounce another function. You can use the shared code editor.', 
        type: 'Coding',
        language: 'javascript',
        prompt: 'Consider edge cases and explain your approach as you code.'
      },
      {
        id: 'live_q1_4',
        text: 'Describe a challenging technical problem you faced on a project and how you solved it.',
        type: 'Discussion',
      }
    ],
    durationMinutes: 45,
  },
   '4': { // Corresponds to Netflix UX Designer Interview from candidate dashboard (ID '4')
    id: '4',
    title: 'Netflix UX Designer – Live Portfolio Review',
    interviewerName: 'Sarah Chen',
    candidateName: 'Jamie Lee (You)',
    questions: [
        { id: 'live_q4_1', text: 'Thanks for joining! Could you start by walking us through one of your key portfolio pieces that you are most proud of?', type: 'Discussion', prompt: 'Feel free to share your screen if needed to show your work.' },
        { id: 'live_q4_2', text: 'How do you typically incorporate user feedback into your design iterations?', type: 'Discussion' },
        { id: 'live_q4_3', text: 'What design tools are you most proficient with, and why do you prefer them?', type: 'Discussion'},
    ],
    durationMinutes: 30,
  },
  // Fallback live interview session
  'default_live_interview': {
    id: 'default_live_interview',
    title: 'Standard Live Technical Screen',
    interviewerName: 'Interviewer AI',
    candidateName: 'Candidate X (You)',
    questions: [
      { id: 'dli_q1', text: 'What are your primary strengths as they relate to this role?', type: 'Discussion' },
      { id: 'dli_q2', text: 'Please write a simple function to reverse a string in the shared editor.', type: 'Coding', language: 'python' },
      { id: 'dli_q3', text: 'Do you have any questions for me about the role or the company?', type: 'Discussion' },
    ],
    durationMinutes: 20,
  }
};


export default function LiveInterviewPage() {
  const params = useParams();
  const sessionId = typeof params.sessionId === 'string' ? params.sessionId : 'default_live_interview';
  const [interviewSessionData, setInterviewSessionData] = useState<LiveInterviewSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Simulate API fetch
    setTimeout(() => {
      const fetchedSessionData = mockLiveInterviewSessions[sessionId] || mockLiveInterviewSessions['default_live_interview'];
      if (fetchedSessionData) {
        setInterviewSessionData(fetchedSessionData);
        setError(null);
      } else {
        setError('Live interview session not found. Please check the link or contact support.');
        setInterviewSessionData(null);
      }
      setLoading(false);
    }, 700); // Slightly longer to simulate data fetch
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Preparing your live interview session...</p>
      </div>
    );
  }

  if (error || !interviewSessionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4">
         <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Interview</AlertTitle>
            <AlertDescription>
              {error || "Could not load the interview session data. Please try again later or contact support."}
            </AlertDescription>
          </Alert>
      </div>
    );
  }

  return <RealtimeInterviewUI interviewSession={interviewSessionData} />;
}