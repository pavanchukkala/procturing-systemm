"use client";

import type { TestQuestion, CandidateAnswer, TestFormat } from '@/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Mic, Video, UploadCloud } from 'lucide-react';

interface QuestionDisplayProps {
  question: TestQuestion;
  questionNumber: number;
  currentAnswer?: CandidateAnswer['answer'];
  onAnswerChange: (answer: CandidateAnswer['answer']) => void;
}

export function QuestionDisplay({ question, questionNumber, currentAnswer, onAnswerChange }: QuestionDisplayProps) {
  
  const renderMCQ = () => {
    const isMultiSelect = Array.isArray(question.correctAnswer); // Heuristic, better to have explicit flag
    const currentSelectedOptions = Array.isArray(currentAnswer) ? currentAnswer : (typeof currentAnswer === 'string' ? [currentAnswer] : []);

    if (isMultiSelect) {
      return (
        <div className="space-y-3">
          {(question.options || []).map((option, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <Checkbox
                id={`q${question.id}-option${index}`}
                checked={currentSelectedOptions.includes(option)}
                onCheckedChange={(checked) => {
                  let newAnswers;
                  if (checked) {
                    newAnswers = [...currentSelectedOptions, option];
                  } else {
                    newAnswers = currentSelectedOptions.filter(o => o !== option);
                  }
                  onAnswerChange(newAnswers);
                }}
              />
              <Label htmlFor={`q${question.id}-option${index}`} className="text-base cursor-pointer flex-1">{option}</Label>
            </div>
          ))}
        </div>
      );
    }

    // Single-select MCQ
    return (
      <RadioGroup
        value={typeof currentAnswer === 'string' ? currentAnswer : undefined}
        onValueChange={(value) => onAnswerChange(value)}
        className="space-y-2"
      >
        {(question.options || []).map((option, index) => (
          <Label 
            key={index} 
            htmlFor={`q${question.id}-option${index}`}
            className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
          >
            <RadioGroupItem value={option} id={`q${question.id}-option${index}`} />
            <span className="text-base">{option}</span>
          </Label>
        ))}
      </RadioGroup>
    );
  };

  const renderCoding = () => {
    return (
      <div className="space-y-4">
        {question.defaultCode && (
          <div>
            <Label className="text-sm font-medium">Default Code Snippet ({question.language || 'plaintext'}):</Label>
            <pre className="p-3 bg-muted rounded-md text-sm overflow-x-auto">
              <code>{question.defaultCode}</code>
            </pre>
          </div>
        )}
        <Label htmlFor={`q${question.id}-code`} className="text-lg">Your Code:</Label>
        <Textarea
          id={`q${question.id}-code`}
          value={typeof currentAnswer === 'string' ? currentAnswer : ''}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder={`Write your ${question.language || 'code'} solution here...`}
          rows={15}
          className="font-mono text-sm bg-card border-input focus:border-primary"
        />
        {/* Placeholder for test cases and run button */}
        <div className="flex justify-end">
            <Button variant="outline" size="sm" disabled>Run Code (Coming Soon)</Button>
        </div>
      </div>
    );
  };

  const renderAudioVideo = () => {
    return (
      <div className="space-y-6 text-center p-6 border rounded-lg bg-card">
        <p className="text-lg text-muted-foreground mb-4">{question.prompt || "Please record your response."}</p>
        {question.type === 'Audio/Video' || question.type === 'Audio' ? (
            <div className="space-y-3">
                <Button size="lg" variant="outline" disabled className="w-full sm:w-auto">
                    <Mic className="mr-2 h-5 w-5" /> Record Audio (Coming Soon)
                </Button>
                 <p className="text-xs text-muted-foreground">Max duration: {question.maxDuration || 120} seconds</p>
            </div>
        ): null}
         {question.type === 'Audio/Video' || question.type === 'Video' ? (
             <div className="space-y-3">
                <Button size="lg" variant="outline" disabled className="w-full sm:w-auto">
                    <Video className="mr-2 h-5 w-5" /> Record Video (Coming Soon)
                </Button>
                <p className="text-xs text-muted-foreground">Max duration: {question.maxDuration || 180} seconds</p>
            </div>
        ) : null}

        <div className="mt-4">
            <Label htmlFor={`q${question.id}-upload`} className="text-sm">Or upload existing file:</Label>
            <Input id={`q${question.id}-upload`} type="file" className="mt-1" disabled/>
            <p className="text-xs text-muted-foreground mt-1">Max file size: 50MB. Supported formats: MP3, MP4, WAV, WebM.</p>
        </div>
         {typeof currentAnswer === 'string' && currentAnswer.startsWith('blob:') && (
          <div className="mt-4 p-2 bg-green-100 border border-green-300 rounded-md text-green-700 text-sm">
            Response recorded/uploaded.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 rounded-lg shadow-md bg-card">
      <div className="flex justify-between items-start">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
          Question {questionNumber}:
        </h2>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
          {question.type}
        </span>
      </div>
      <p className="text-base sm:text-lg text-muted-foreground whitespace-pre-wrap">{question.text}</p>
      
      <div className="mt-4">
        {question.type === 'MCQ' && renderMCQ()}
        {question.type === 'Coding' && renderCoding()}
        {(question.type === 'Audio/Video' || (question.type as string) === 'Audio' || (question.type as string) === 'Video') && renderAudioVideo()}
      </div>
    </div>
  );
}
