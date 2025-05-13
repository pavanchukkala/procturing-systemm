"use client";

import type { LiveInterviewSessionData, TestQuestion } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Code, ChevronLeft, ChevronRight, Send, UserCircle, Loader2, AlertCircle } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface RealtimeInterviewUIProps {
  interviewSession: LiveInterviewSessionData;
  userRole?: 'candidate' | 'interviewer'; // To adapt UI slightly if needed
}

export function RealtimeInterviewUI({ interviewSession, userRole = 'candidate' }: RealtimeInterviewUIProps) {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState<{ sender: string, text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [codeContent, setCodeContent] = useState('');

  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const currentQuestion = interviewSession.questions[currentQuestionIndex];

  useEffect(() => {
    const getMediaPermissions = async () => {
      if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setHasPermissions(true);
        } catch (error) {
          console.error("Error accessing media devices:", error);
          setHasPermissions(false);
          toast({
            variant: "destructive",
            title: "Media Access Denied",
            description: "Please enable camera and microphone permissions for the interview.",
            duration: 7000,
          });
        }
      } else {
        setHasPermissions(false);
        toast({
          variant: "destructive",
          title: "Media Not Supported",
          description: "Your browser doesn't support features needed for video interviews.",
          duration: 7000,
        });
      }
    };
    getMediaPermissions();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleEndCall = () => {
    toast({ title: "Interview Ended", description: "You have left the interview session." });
    router.push('/candidate/dashboard');
  };

  const handleToggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMicMuted(prev => !prev);
    }
  };
  const handleToggleCamera = () => {
     if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsCameraOff(prev => !prev);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < interviewSession.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSendChatMessage = () => {
    if (chatInput.trim()) {
      setChatMessages(prev => [...prev, { sender: userRole, text: chatInput.trim() }]);
      setChatInput('');
      // In a real app, send this message via WebSocket
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]  bg-background"> {/* Adjusted height */}
      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Video Feeds & Code Editor */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Remote Video (Interviewer) - Placeholder */}
          <Card className="flex-1 flex flex-col items-center justify-center bg-muted/50 min-h-[200px] shadow-md">
             <UserCircle className="h-24 w-24 text-muted-foreground opacity-50" />
             <p className="mt-2 text-muted-foreground">{interviewSession.interviewerName || 'Interviewer'}</p>
             <p className="text-xs text-muted-foreground">(Interviewer's Video Feed)</p>
          </Card>

          {/* Local Video (Candidate/Self) & Shared Code Editor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-2/5 min-h-[250px]">
            <Card className="flex flex-col items-center justify-center relative shadow-md overflow-hidden">
              <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              {hasPermissions === null && <Loader2 className="absolute h-8 w-8 animate-spin text-white/70"/>}
              {hasPermissions === false && <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-2 text-center"><VideoOff className="h-8 w-8 mb-2"/><p className="text-sm">Camera/Mic access denied or unavailable.</p></div>}
              {isCameraOff && hasPermissions && <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-2 text-center"><VideoOff className="h-8 w-8 mb-2"/><p className="text-sm">Your camera is off</p></div>}
              <p className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">
                {interviewSession.candidateName || 'You'}
              </p>
            </Card>
            <Card className="flex flex-col shadow-md">
              <CardHeader className="p-3 border-b">
                <CardTitle className="text-md flex items-center gap-2"><Code className="h-5 w-5 text-primary"/> Shared Code Editor</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <Textarea 
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  placeholder="// Start coding here... Your code is shared in real-time."
                  className="w-full h-full border-0 rounded-none resize-none font-mono text-sm p-2 focus:ring-0"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar: Questions & Chat */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Current Question */}
          <Card className="flex-1 flex flex-col shadow-md min-h-[200px]">
            <CardHeader className="p-3 border-b">
              <CardTitle className="text-md">Question {currentQuestionIndex + 1} of {interviewSession.questions.length}</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              <CardContent className="p-3 text-sm">
                {currentQuestion ? (
                  <>
                    <p className="font-semibold mb-1">{currentQuestion.type} Question:</p>
                    <p className="whitespace-pre-wrap">{currentQuestion.text}</p>
                    {currentQuestion.prompt && <p className="text-xs text-muted-foreground mt-2 italic">{currentQuestion.prompt}</p>}
                  </>
                ) : (
                  <p>No question selected.</p>
                )}
              </CardContent>
            </ScrollArea>
            {interviewSession.questions.length > 1 && (
              <CardContent className="p-2 border-t flex justify-between">
                <Button variant="outline" size="sm" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <Button variant="outline" size="sm" onClick={handleNextQuestion} disabled={currentQuestionIndex === interviewSession.questions.length - 1}>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Chat */}
          <Card className="flex-1 flex flex-col shadow-md min-h-[200px]">
            <CardHeader className="p-3 border-b">
              <CardTitle className="text-md flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary"/> Chat</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1 p-3 space-y-2 text-sm">
              {chatMessages.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Chat history is empty.</p>}
              {chatMessages.map((msg, index) => (
                <div key={index} className={`p-2 rounded-md max-w-[80%] ${msg.sender === userRole ? 'bg-primary/20 ml-auto text-right' : 'bg-muted/70 mr-auto'}`}>
                  <p className="font-semibold text-xs capitalize">{msg.sender === userRole ? 'You' : msg.sender}</p>
                  <p>{msg.text}</p>
                </div>
              ))}
            </ScrollArea>
            <div className="p-2 border-t flex gap-2">
              <input 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                placeholder="Type a message..."
                className="flex-1 h-9 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
              />
              <Button size="sm" onClick={handleSendChatMessage} className="h-9"><Send className="h-4 w-4"/></Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Control Bar */}
      <div className="border-t bg-card p-3 flex justify-center items-center gap-3 sm:gap-4">
        <Button variant={isMicMuted ? "destructive" : "outline"} size="icon" onClick={handleToggleMic} title={isMicMuted ? "Unmute" : "Mute"}>
          {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Button variant={isCameraOff ? "destructive" : "outline"} size="icon" onClick={handleToggleCamera} title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}>
          {isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </Button>
        <Button variant="destructive" size="lg" onClick={handleEndCall} className="px-6">
          <PhoneOff className="h-5 w-5 mr-2" /> End Call
        </Button>
        {/* Placeholder for Screen Share */}
         <Button variant="outline" size="icon" disabled title="Screen Share (Coming Soon)">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v bestimmte Höhe unterschreiten."/><path d="m10 13- effizientesten Weg in die Cloud gehen soll."/><path d="M22 13v4a2 2 0 0 1-2 2h-4"/><path d="M16 13l6 6"/><path d="M16 19h6"/></svg>
        </Button>
      </div>
    </div>
  );
}