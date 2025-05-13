
"use client";

import type { RefObject} from 'react';
import { useState, useEffect, useRef } from 'react';
import type { TestQuestion, CandidateAnswer } from '@/types';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mic, Video, UploadCloud, Play, Pause, Check, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface InterviewQuestionDisplayProps {
  question: TestQuestion;
  questionNumber: number;
  currentAnswer?: CandidateAnswer['answer'];
  onAnswerChange: (answer: CandidateAnswer['answer']) => void;
  videoStream: MediaStream | null;
  isCameraReady: boolean;
}

export function InterviewQuestionDisplay({
  question,
  questionNumber,
  currentAnswer,
  onAnswerChange,
  videoStream,
  isCameraReady,
}: InterviewQuestionDisplayProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(currentAnswer as string || null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const maxDuration = question.maxDuration || 120; // Default to 2 minutes

  useEffect(() => {
    // Reset state when question changes
    setIsRecording(false);
    setRecordedBlobUrl(currentAnswer as string || null);
    setRecordingTime(0);
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    
    // Clean up previous MediaRecorder if it exists
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    recordedChunksRef.current = [];

  }, [question, currentAnswer]);


  const handleStartRecording = async () => {
    if (!isCameraReady || !videoStream) {
      toast({ variant: "destructive", title: "Camera not ready", description: "Please ensure camera and microphone are enabled." });
      return;
    }

    if (recordedBlobUrl) { // If there's an old recording, clear it
        URL.revokeObjectURL(recordedBlobUrl);
        setRecordedBlobUrl(null);
        onAnswerChange(undefined); // Clear previous answer
    }

    try {
      // Prefer video/webm;codecs=vp9,opus if available, else default.
      const options = { mimeType: 'video/webm; codecs=vp9,opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          delete options.mimeType; // Use default if specific codecs not supported
      }
      mediaRecorderRef.current = new MediaRecorder(videoStream, options);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedBlobUrl(videoUrl);
        onAnswerChange(videoUrl); // Pass the blob URL as the answer
        setIsRecording(false);
        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
        setRecordingTime(0);
      };
      
      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        toast({ variant: "destructive", title: "Recording Error", description: "An error occurred during recording." });
        setIsRecording(false);
        if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
        setRecordingTime(0);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prevTime => {
          if (prevTime >= maxDuration -1) {
            handleStopRecording(); // Auto-stop if max duration reached
            return maxDuration;
          }
          return prevTime + 1;
        });
      }, 1000);

    } catch (error) {
        console.error("Failed to start recording:", error);
        toast({ variant: "destructive", title: "Recording Failed", description: "Could not start recording. Check permissions or device."});
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    // State updates are handled in onstop
  };

  const handleRetake = () => {
    if (recordedBlobUrl) {
      URL.revokeObjectURL(recordedBlobUrl);
    }
    setRecordedBlobUrl(null);
    onAnswerChange(undefined); // Clear answer
    setRecordingTime(0);
    // Automatically start new recording if camera is ready
    if (isCameraReady) {
        handleStartRecording();
    }
  };


  if (question.type !== 'Audio/Video') {
    // Placeholder for other interview question types if any (e.g., text-based behavioral for notes)
    return (
      <div className="space-y-6 p-4 sm:p-6 rounded-lg shadow-sm bg-card">
        <div className="flex justify-between items-start">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            Question {questionNumber}:
          </h2>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            {question.type}
          </span>
        </div>
        <p className="text-base sm:text-lg text-muted-foreground whitespace-pre-wrap">{question.text}</p>
        <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>This question type is for discussion or on-the-spot answers, no recording needed for this interface currently.</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Audio/Video Question Type
  return (
    <div className="space-y-6 p-4 sm:p-6 rounded-lg shadow-sm bg-card">
      <div className="flex justify-between items-start">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
          Question {questionNumber}:
        </h2>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
          Video Response
        </span>
      </div>
      <p className="text-base sm:text-lg text-muted-foreground whitespace-pre-wrap">{question.text}</p>
      {question.prompt && <p className="text-sm text-primary italic">{question.prompt}</p>}

      {!isCameraReady && (
         <Alert variant="destructive">
            <Video className="h-4 w-4" />
            <AlertTitle>Camera Not Ready</AlertTitle>
            <AlertDescription>
                Video recording is unavailable. Please ensure your camera and microphone are enabled and permissions are granted.
            </AlertDescription>
        </Alert>
      )}

      {isCameraReady && (
        <div className="space-y-4">
          {recordedBlobUrl ? (
            <div className="space-y-3">
              <h4 className="font-medium">Your Recorded Answer:</h4>
              <video src={recordedBlobUrl} controls className="w-full rounded-md aspect-video bg-muted" />
              <Button onClick={handleRetake} variant="outline" disabled={isRecording}>
                <RefreshCw className="mr-2 h-4 w-4" /> Retake Answer
              </Button>
            </div>
          ) : (
             <div className="flex flex-col items-center space-y-3 p-4 border-2 border-dashed rounded-md">
                {!isRecording ? (
                    <Button onClick={handleStartRecording} size="lg" disabled={!isCameraReady}>
                        <Play className="mr-2 h-5 w-5" /> Start Recording
                    </Button>
                ) : (
                    <Button onClick={handleStopRecording} size="lg" variant="destructive">
                        <Pause className="mr-2 h-5 w-5" /> Stop Recording
                    </Button>
                )}
                <p className="text-sm text-muted-foreground">Max Duration: {Math.floor(maxDuration / 60)}m {maxDuration % 60}s</p>
             </div>
          )}

          {isRecording && (
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span>Recording: {String(Math.floor(recordingTime/60)).padStart(2,'0')}:{String(recordingTime%60).padStart(2,'0')}</span>
                    <span>Max: {String(Math.floor(maxDuration/60)).padStart(2,'0')}:{String(maxDuration%60).padStart(2,'0')}</span>
                </div>
                <Progress value={(recordingTime / maxDuration) * 100} className="h-2" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
