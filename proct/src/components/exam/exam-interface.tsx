"use client";

import { useState, useEffect, useCallback } from 'react';
import type { TestPaper, CandidateAnswer } from '@/types';
import { QuestionDisplay } from './question-display';
import { Timer } from './timer';
import { NavigationControls } from './navigation-controls';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Added import for Button

interface ExamInterfaceProps {
  testPaper: TestPaper;
}

export function ExamInterface({ testPaper }: ExamInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CandidateAnswer['answer']>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const totalQuestions = testPaper.questions.length;
  const currentQuestion = testPaper.questions[currentQuestionIndex];

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

  const submitExam = useCallback(async () => {
    setIsSubmitting(true);
    console.log('Submitting exam with answers:', answers);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setExamSubmitted(true);
    setIsSubmitting(false);
    toast({
      title: "Exam Submitted Successfully!",
      description: "Your responses have been recorded. You will be redirected shortly.",
      variant: "default",
      duration: 5000,
    });

    setTimeout(() => {
        router.push('/candidate/dashboard'); // Redirect to dashboard after submission
    }, 3000);

  }, [answers, router, toast]);


  const handleTimeUp = useCallback(() => {
    toast({
      title: "Time's Up!",
      description: "The exam will be submitted automatically.",
      variant: "destructive",
    });
    submitExam();
  }, [submitExam, toast]);

  useEffect(() => {
    // Warn user before leaving page if exam is in progress
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!examSubmitted && totalQuestions > 0) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [examSubmitted, totalQuestions]);


  if (examSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center p-8 shadow-xl">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
            <CardTitle className="text-2xl font-bold mb-3">Exam Submitted!</CardTitle>
            <CardDescription className="text-muted-foreground mb-6">
                Your responses have been successfully recorded. Thank you for taking the test.
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
        <p className="text-muted-foreground">Loading exam questions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row justify-between items-center border-b pb-4">
          <div>
            <CardTitle className="text-2xl">{testPaper.name}</CardTitle>
            <CardDescription>Question {currentQuestionIndex + 1} of {totalQuestions}</CardDescription>
          </div>
          <Timer durationMinutes={testPaper.duration} onTimeUp={handleTimeUp} />
        </CardHeader>
        <CardContent className="pt-6">
            <QuestionDisplay
                key={currentQuestion.id} // Ensure re-render on question change
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                currentAnswer={answers[currentQuestion.id]}
                onAnswerChange={handleAnswerChange}
            />
        </CardContent>
      </Card>
      
      <NavigationControls
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onPrevious={handlePreviousQuestion}
        onNext={handleNextQuestion}
        onSubmit={submitExam}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
