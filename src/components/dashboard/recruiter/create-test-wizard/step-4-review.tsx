"use client";

import type { TestPaper } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, ArrowLeft, Send, CheckCircle2, Shuffle, Settings } from 'lucide-react';

interface Step4ReviewProps {
  testData: TestPaper;
  onBack: () => void;
  onPublish: () => void;
  onSaveDraft: () => void;
}

export function Step4Review({ testData, onBack, onPublish, onSaveDraft }: Step4ReviewProps) {
  const totalQuestions = testData.questions.length + (testData.sections?.reduce((sum, sec) => sum + sec.questions.length, 0) || 0);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Review &amp; Publish Test Paper</CardTitle>
        <CardDescription>Please review all the details of your test paper before publishing or saving as a draft.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">{testData.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span>{testData.duration} {testData.durationUnit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Questions:</span>
              <span>{totalQuestions}</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Formats:</span>
              <div className="flex gap-1 flex-wrap">
                {testData.formats.map(format => <Badge key={format} variant="secondary">{format}</Badge>)}
              </div>
            </div>

            <Separator className="my-3"/>

            <div className="flex items-center gap-2">
                <Shuffle className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Global Question Shuffling:</span>
                <Badge variant={testData.shuffleQuestionsGlobal ? "default" : "outline"}>
                    {testData.shuffleQuestionsGlobal ? "Enabled" : "Disabled"}
                </Badge>
            </div>
            
            {testData.sections && testData.sections.length > 0 && (
                <div className="space-y-2 pt-2">
                    <h4 className="font-medium">Sections ({testData.sections.length}):</h4>
                    <ul className="list-disc list-inside pl-2 text-xs space-y-1">
                    {testData.sections.map(section => (
                        <li key={section.id}>
                        {section.name} ({section.questions.length} questions)
                        - Shuffling: <Badge variant={section.shuffleQuestions ? "default" : "outline"} className="text-xs">{section.shuffleQuestions ? "Enabled" : "Disabled"}</Badge>
                        </li>
                    ))}
                    </ul>
                </div>
            )}

            <Separator className="my-3"/>
            
            <div className="flex items-center gap-2">
                 <Settings className="h-4 w-4 text-primary" />
                 <span className="text-muted-foreground">Auto-Evaluation Rules:</span>
            </div>
            <ul className="list-disc list-inside pl-2 text-xs space-y-1">
                {testData.autoEvaluation?.mcq && <li>MCQs: Auto-grade {testData.autoEvaluation.mcq.autoGrade ? 'ON' : 'OFF'}, Partial credit {testData.autoEvaluation.mcq.partialCreditMultiSelect ? 'ON' : 'OFF'}</li>}
                {testData.autoEvaluation?.coding && <li>Coding: Test cases {testData.autoEvaluation.coding.testCasesVisibility}, Time {testData.autoEvaluation.coding.timeLimit}s, Memory {testData.autoEvaluation.coding.memoryLimit}MB</li>}
                {testData.autoEvaluation?.audioVideo && <li>Audio/Video: Transcription {testData.autoEvaluation.audioVideo.autoTranscription ? 'ON' : 'OFF'}, Manual review {testData.autoEvaluation.audioVideo.manualReviewFlag ? 'FLAGGED' : 'NOT FLAGGED'}</li>}
            </ul>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onSaveDraft}>
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button type="button" onClick={onPublish}>
            <Send className="mr-2 h-4 w-4" /> Publish &amp; Send Invites
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}