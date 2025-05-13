"use client";
// This is a placeholder for a more detailed question editing form,
// potentially used within a modal or an expandable card in Step 2.
// For now, Step 2 uses a simpler dialog.

import type { TestQuestion, TestFormat } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuestionCardFormProps {
  question?: TestQuestion;
  availableFormats: TestFormat[];
  onSave: (question: TestQuestion) => void;
  onCancel: () => void;
}

export function QuestionCardForm({ question, availableFormats, onSave, onCancel }: QuestionCardFormProps) {
  // Form state and logic would go here using react-hook-form or simple state.
  // This is a simplified example.
  const handleSubmit = () => {
    // Dummy save
    const newQuestion: TestQuestion = {
      id: question?.id || `q-${Date.now()}`,
      text: (document.getElementById('q-text-full') as HTMLTextAreaElement)?.value || 'New Question',
      type: (document.getElementById('q-type-full') as HTMLSelectElement)?.value as TestFormat || 'MCQ',
      tags: (document.getElementById('q-tags-full') as HTMLInputElement)?.value.split(',') || [],
    };
    onSave(newQuestion);
  };
  
  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h4 className="font-medium">{question ? 'Edit Question' : 'Add New Question'}</h4>
      <div>
        <Label htmlFor="q-text-full">Question Text</Label>
        <Textarea id="q-text-full" defaultValue={question?.text} />
      </div>
      <div>
        <Label htmlFor="q-type-full">Type</Label>
        <Select defaultValue={question?.type || availableFormats[0]}>
          <SelectTrigger id="q-type-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {availableFormats.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="q-tags-full">Tags (comma-separated)</Label>
        <Input id="q-tags-full" defaultValue={question?.tags?.join(', ')} />
      </div>
      {/* More fields for options, correct answers, test cases etc. based on type */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Save Question</Button>
      </div>
    </div>
  );
}