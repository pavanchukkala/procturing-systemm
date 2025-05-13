"use client";

import type { ChangeEvent } from 'react';
import { useState, useCallback } from 'react';
import type { TestPaper, TestQuestion, TestFormat } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, UploadCloud, Trash2, Edit, Save, ArrowLeft, ArrowRight, FileJson, FileText, Type, Tag, ListOrdered } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Step2QuestionsProps {
  testData: TestPaper;
  setTestData: (data: Partial<TestPaper>) => void; // Specifically for question array updates
  questions: TestQuestion[];
  addQuestion: (question: TestQuestion) => void;
  updateQuestion: (question: TestQuestion) => void;
  deleteQuestion: (questionId: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

interface QuestionFormState extends Partial<TestQuestion> {
  text?: string;
  type?: TestFormat;
  tagsInput?: string; // For handling comma-separated tags
}


const testFormatIcons = {
  MCQ: <ListOrdered className="h-4 w-4" />,
  Coding: <Type className="h-4 w-4" />,
  'Audio/Video': <FileText className="h-4 w-4" />,
};


export function Step2Questions({
  testData,
  setTestData,
  questions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  onBack,
  onNext,
  onSaveDraft,
}: Step2QuestionsProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionFormState | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      // Simulate upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({ title: "File Uploaded", description: `${file.name} processed (simulation).` });
          // Here you would parse the file and add questions
          // For demo, let's add a mock question:
          addQuestion({
            id: `csv-${Date.now()}`,
            text: `Parsed question from ${file.name}`,
            type: 'MCQ',
            tags: ['csv-upload'],
            options: ['Option A', 'Option B'],
            correctAnswer: 'Option A',
          });
        }
      }, 300);
    }
  };
  
  const openAddQuestionDialog = () => {
    setEditingQuestion({ text: '', type: testData.formats[0] || 'MCQ', tagsInput: '' });
    setIsQuestionDialogOpen(true);
  };

  const openEditQuestionDialog = (question: TestQuestion) => {
    setEditingQuestion({ ...question, tagsInput: question.tags?.join(', ') || '' });
    setIsQuestionDialogOpen(true);
  };

  const handleQuestionFormSubmit = () => {
    if (!editingQuestion || !editingQuestion.text || !editingQuestion.type) {
      toast({ variant: "destructive", title: "Error", description: "Question text and type are required." });
      return;
    }
    
    const questionData: TestQuestion = {
      id: editingQuestion.id || `q-${Date.now()}`,
      text: editingQuestion.text,
      type: editingQuestion.type,
      tags: editingQuestion.tagsInput?.split(',').map(tag => tag.trim()).filter(tag => tag) || [],
      // Add more fields based on type (options, correctAnswer etc.)
      ...(editingQuestion.type === 'MCQ' && { options: editingQuestion.options || [], correctAnswer: editingQuestion.correctAnswer || ''}),
    };

    if (editingQuestion.id) {
      updateQuestion(questionData);
      toast({ title: "Question Updated" });
    } else {
      addQuestion(questionData);
      toast({ title: "Question Added" });
    }
    setIsQuestionDialogOpen(false);
    setEditingQuestion(null);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Upload &amp; Manage Questions</CardTitle>
        <CardDescription>Add questions manually or bulk upload via CSV/JSON.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bulk Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bulk Upload Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
              <UploadCloud className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="mb-2 text-sm text-muted-foreground">
                Drag &amp; drop CSV/JSON files here, or click to select.
              </p>
              <Input type="file" accept=".csv,.json" onChange={handleFileUpload} className="hidden" id="bulk-upload-input" />
              <Button type="button" variant="outline" onClick={() => document.getElementById('bulk-upload-input')?.click()}>
                Select Files
              </Button>
            </div>
            {isUploading && <Progress value={uploadProgress} className="w-full h-2 mt-2" />}
            <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>CSV Schema:</strong> <code>text,type,option1,option2,...,correctAnswer,tags</code></p>
                <p><strong>JSON Schema:</strong> <code>[{`{text:"...", type:"...", options:[], correctAnswer:"...", tags:[]}`}]</code></p>
            </div>
          </CardContent>
        </Card>

        {/* Manual Add Button */}
        <div className="text-center">
          <Button type="button" onClick={openAddQuestionDialog}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Question Manually
          </Button>
        </div>

        {/* Question List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Questions ({questions.length})</h3>
          {questions.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No questions added yet.</p>
          ) : (
            <ul className="space-y-3">
              {questions.map((q, index) => (
                <li key={q.id} className="p-4 border rounded-lg bg-card flex justify-between items-start shadow-sm">
                  <div>
                    <p className="font-medium text-sm">{index + 1}. {q.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                            {testFormatIcons[q.type]}
                            <span className="ml-1">{q.type}</span>
                        </Badge>
                        {q.tags?.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1"/>{tag}
                            </Badge>
                        ))}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-4">
                    <Button variant="ghost" size="icon" onClick={() => openEditQuestionDialog(q)} title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteQuestion(q.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {/* Duplicate button can be added here */}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div>
          <Button type="button" variant="outline" onClick={onSaveDraft} className="mr-2">
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button type="button" onClick={onNext}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>

      {/* Question Dialog (Add/Edit) */}
      <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingQuestion?.id ? 'Edit Question' : 'Add New Question'}</DialogTitle>
            <DialogDescription>
              Fill in the details for the question.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="q-text">Question Text</Label>
              <Textarea 
                id="q-text" 
                value={editingQuestion?.text || ''} 
                onChange={(e) => setEditingQuestion(prev => ({...prev, text: e.target.value}))}
                placeholder="Enter the question text..."
                rows={4}
              />
            </div>
             <div>
              <Label htmlFor="q-type">Question Type</Label>
              <Select 
                value={editingQuestion?.type || ''}
                onValueChange={(value: TestFormat) => setEditingQuestion(prev => ({...prev, type: value}))}
              >
                <SelectTrigger id="q-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {testData.formats.map(format => (
                    <SelectItem key={format} value={format}>{format}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="q-tags">Tags (comma-separated)</Label>
              <Input 
                id="q-tags" 
                value={editingQuestion?.tagsInput || ''}
                onChange={(e) => setEditingQuestion(prev => ({...prev, tagsInput: e.target.value}))}
                placeholder="e.g., easy, arrays, problem-solving"
              />
            </div>
            {/* TODO: Add fields for options, correct answer etc. based on type */}
            {editingQuestion?.type === 'MCQ' && (
              <>
                <div>
                  <Label>Options (one per line)</Label>
                  <Textarea
                    value={(editingQuestion.options || []).join('\n')}
                    onChange={(e) => setEditingQuestion(prev => ({...prev, options: e.target.value.split('\n')}))}
                    placeholder="Option A&#x0a;Option B&#x0a;Option C"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Correct Answer(s) (comma-separated for multiple)</Label>
                  <Input
                    value={Array.isArray(editingQuestion.correctAnswer) ? editingQuestion.correctAnswer.join(',') : editingQuestion.correctAnswer || ''}
                    onChange={(e) => setEditingQuestion(prev => ({...prev, correctAnswer: e.target.value}))}
                    placeholder="e.g., Option A or Option A,Option C"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuestionDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleQuestionFormSubmit}>
              {editingQuestion?.id ? 'Save Changes' : 'Add Question'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </Card>
  );
}