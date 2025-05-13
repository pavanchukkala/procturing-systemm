
"use client";

import type { RefObject } from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import type { TestPaper, CandidateAnswer } from '@/types';
import { InterviewQuestionDisplay } from './interview-question-display';
import { Timer } from '@/components/exam/timer'; // Reusing Timer component
import { NavigationControls } from '@/components/exam/navigation-controls'; // Reusing NavigationControls
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, VideoOff, Video as VideoIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface InterviewInterfaceProps {
  interviewPaper: TestPaper;
}

export function InterviewInterface({ interviewPaper }: InterviewInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CandidateAnswer['answer']>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewSubmitted, setInterviewSubmitted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const totalQuestions = interviewPaper.questions.length;
  const currentQuestion = interviewPaper.questions[currentQuestionIndex];

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setHasCameraPermission(true);
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera/microphone:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera/Microphone Access Denied',
            description: 'Please enable camera and microphone permissions in your browser settings for the interview.',
            duration: 7000,
          });
        }
      } else {
        setHasCameraPermission(false);
         toast({
            variant: 'destructive',
            title: 'Media Devices Not Supported',
            description: 'Your browser does not support the necessary features for video interviews.',
            duration: 7000,
          });
      }
    };

    getCameraPermission();

    return () => {
      // Clean up stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);


  const handleAnswerChange = (answer: CandidateAnswer['answer']) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion.id]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitInterview = useCallback(async () => {
    setIsSubmitting(true);
    console.log('Submitting interview with answers:', answers);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setInterviewSubmitted(true);
    setIsSubmitting(false);
    toast({
      title: "Interview Submitted Successfully!",
      description: "Your responses have been recorded. You will be redirected shortly.",
      variant: "default",
      duration: 5000,
    });

     // Clean up stream on submission
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }

    setTimeout(() => {
        router.push('/candidate/dashboard');
    }, 3000);

  }, [answers, router, toast]);


  const handleTimeUp = useCallback(() => {
    toast({
      title: "Time's Up!",
      description: "The interview will be submitted automatically.",
      variant: "destructive",
    });
    submitInterview();
  }, [submitInterview, toast]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!interviewSubmitted && totalQuestions > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [interviewSubmitted, totalQuestions]);


  if (interviewSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center p-8 shadow-xl">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
            <CardTitle className="text-2xl font-bold mb-3">Interview Submitted!</CardTitle>
            <CardDescription className="text-muted-foreground mb-6">
                Your responses have been recorded. Thank you for participating.
            </CardDescription>
            <Button onClick={() => router.push('/candidate/dashboard')}>
                Go to Dashboard
            </Button>
        </Card>
      </div>
    );
  }
  
  if (!currentQuestion) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading interview questions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4">
          <div className="flex-grow">
            <CardTitle className="text-2xl">{interviewPaper.name}</CardTitle>
            <CardDescription>Question {currentQuestionIndex + 1} of {totalQuestions}</CardDescription>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
            {hasCameraPermission === null && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            {hasCameraPermission === true && <VideoIcon className="h-5 w-5 text-green-500" />}
            {hasCameraPermission === false && <VideoOff className="h-5 w-5 text-destructive" />}
            <Timer durationMinutes={interviewPaper.duration} onTimeUp={handleTimeUp} />
          </div>
        </CardHeader>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {hasCameraPermission === false && (
                 <Alert variant="destructive" className="mb-4">
                    <VideoOff className="h-4 w-4" />
                    <AlertTitle>Camera/Microphone Access Required</AlertTitle>
                    <AlertDescription>
                        Please enable camera and microphone permissions in your browser settings to proceed with the interview. Refresh the page after granting access.
                    </AlertDescription>
                </Alert>
            )}
            <InterviewQuestionDisplay
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                currentAnswer={answers[currentQuestion.id]}
                onAnswerChange={handleAnswerChange}
                videoStream={hasCameraPermission ? streamRef.current : null}
                isCameraReady={hasCameraPermission === true}
            />
          </div>
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Your Video Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted object-cover" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                    <p className="text-xs text-destructive mt-2 text-center">Camera access is denied or unavailable.</p>
                )}
                 {hasCameraPermission === null && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">Checking camera...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <NavigationControls
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
        onSubmit={submitInterview}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
