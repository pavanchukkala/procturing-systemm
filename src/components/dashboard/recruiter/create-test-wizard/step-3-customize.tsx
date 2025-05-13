"use client";

import { useState } from 'react';
import type { TestPaper, TestSection, TestQuestion, TestFormat } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Save, ArrowLeft, ArrowRight, PlusCircle, Trash2, Edit, Settings, Eye, Shuffle, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface Step3CustomizeProps {
  testData: TestPaper;
  setTestData: (data: Partial<TestPaper>) => void;
  sections: TestSection[];
  addSection: (section: TestSection) => void;
  updateSection: (section: TestSection) => void;
  deleteSection: (sectionId: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

interface SectionFormState {
  id?: string;
  name: string;
  shuffleQuestions?: boolean;
}

export function Step3Customize({
  testData,
  setTestData,
  sections,
  addSection,
  updateSection,
  deleteSection,
  onBack,
  onNext,
  onSaveDraft,
}: Step3CustomizeProps) {
  const { toast } = useToast();
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionFormState | null>(null);
  
  // Simplified drag-and-drop simulation: move section up/down
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const sectionToMove = newSections[index];
    if (direction === 'up' && index > 0) {
      newSections.splice(index, 1);
      newSections.splice(index - 1, 0, sectionToMove);
    } else if (direction === 'down' && index < newSections.length - 1) {
      newSections.splice(index, 1);
      newSections.splice(index + 1, 0, sectionToMove);
    }
    setTestData({ sections: newSections });
  };

  const openAddSectionDialog = () => {
    setEditingSection({ name: '', shuffleQuestions: false });
    setIsSectionDialogOpen(true);
  };

  const openEditSectionDialog = (section: TestSection) => {
    setEditingSection({ id: section.id, name: section.name, shuffleQuestions: section.shuffleQuestions });
    setIsSectionDialogOpen(true);
  };

  const handleSectionFormSubmit = () => {
    if (!editingSection || !editingSection.name) {
      toast({ variant: "destructive", title: "Error", description: "Section name is required."});
      return;
    }
    
    const sectionData: TestSection = {
      id: editingSection.id || `sec-${Date.now()}`,
      name: editingSection.name,
      questions: editingSection.id ? sections.find(s => s.id === editingSection.id)?.questions || [] : [], // Preserve questions on edit
      shuffleQuestions: editingSection.shuffleQuestions || false,
    };

    if (editingSection.id) {
      updateSection(sectionData);
      toast({ title: "Section Updated" });
    } else {
      addSection(sectionData);
      toast({ title: "Section Added" });
    }
    setIsSectionDialogOpen(false);
    setEditingSection(null);
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Customization &amp; Auto-Evaluation</CardTitle>
        <CardDescription>Organize questions into sections, set shuffling, and configure evaluation rules.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Global Shuffle */}
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center"><Shuffle className="mr-2 h-5 w-5 text-primary"/> Question Shuffling</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="shuffle-global"
                        checked={testData.shuffleQuestionsGlobal}
                        onCheckedChange={(checked) => setTestData({ shuffleQuestionsGlobal: checked })}
                    />
                    <Label htmlFor="shuffle-global">Shuffle all questions globally</Label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">If enabled, all questions (across sections or standalone) will be presented in a random order to each candidate. Section-specific shuffling can override this if sections are used.</p>
            </CardContent>
        </Card>

        {/* Sections Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Sections</CardTitle>
            <Button variant="outline" size="sm" onClick={openAddSectionDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Section
            </Button>
          </CardHeader>
          <CardContent>
            {sections.length === 0 ? (
              <p className="text-muted-foreground text-center py-3">No sections created. Questions will be treated as a single list.</p>
            ) : (
              <div className="space-y-3">
                {sections.map((section, index) => (
                  <Card key={section.id} className="bg-muted/30">
                    <CardHeader className="flex flex-row items-center justify-between p-4">
                        <div className="flex items-center gap-2">
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                            <CardTitle className="text-base">{section.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => moveSection(index, 'up')} disabled={index === 0}><ArrowLeft className="h-4 w-4 rotate-90" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1}><ArrowRight className="h-4 w-4 rotate-90" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditSectionDialog(section)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteSection(section.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="flex items-center space-x-2 mb-2">
                            <Switch
                                id={`shuffle-section-${section.id}`}
                                checked={section.shuffleQuestions}
                                onCheckedChange={(checked) => updateSection({ ...section, shuffleQuestions: checked })}
                            />
                            <Label htmlFor={`shuffle-section-${section.id}`}>Shuffle questions within this section</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">Contains {section.questions.length} questions. (Drag questions here - UI coming soon)</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Auto-Evaluation Settings */}
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center"><Settings className="mr-2 h-5 w-5 text-primary"/> Auto-Evaluation Rules</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" className="w-full">
                    {testData.formats.includes('MCQ') && (
                        <AccordionItem value="mcq-settings">
                            <AccordionTrigger>MCQ Settings</AccordionTrigger>
                            <AccordionContent className="space-y-4 p-2">
                                <div className="flex items-center space-x-2">
                                    <Switch id="mcq-autograde" checked={testData.autoEvaluation?.mcq?.autoGrade} onCheckedChange={c => setTestData({ autoEvaluation: { ...testData.autoEvaluation, mcq: {...testData.autoEvaluation?.mcq, autoGrade: c}}})} />
                                    <Label htmlFor="mcq-autograde">Auto-grade correct answers</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="mcq-partial" checked={testData.autoEvaluation?.mcq?.partialCreditMultiSelect} onCheckedChange={c => setTestData({ autoEvaluation: { ...testData.autoEvaluation, mcq: {...testData.autoEvaluation?.mcq, partialCreditMultiSelect: c}}})} />
                                    <Label htmlFor="mcq-partial">Allow partial credits for multi-select questions</Label>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    {testData.formats.includes('Coding') && (
                         <AccordionItem value="coding-settings">
                            <AccordionTrigger>Coding Challenge Settings</AccordionTrigger>
                            <AccordionContent className="space-y-4 p-2">
                                 <div>
                                    <Label htmlFor="coding-visibility">Test Cases Visibility</Label>
                                    <Select 
                                        value={testData.autoEvaluation?.coding?.testCasesVisibility}
                                        onValueChange={v => setTestData({ autoEvaluation: { ...testData.autoEvaluation, coding: {...testData.autoEvaluation?.coding, testCasesVisibility: v as any}}})}
                                    >
                                        <SelectTrigger id="coding-visibility"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Show all test cases</SelectItem>
                                            <SelectItem value="hidden">Hide all test cases</SelectItem>
                                            <SelectItem value="partial">Show sample/public test cases only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="coding-timelimit">Time Limit (seconds)</Label>
                                        <Input id="coding-timelimit" type="number" value={testData.autoEvaluation?.coding?.timeLimit} onChange={e => setTestData({ autoEvaluation: { ...testData.autoEvaluation, coding: {...testData.autoEvaluation?.coding, timeLimit: parseInt(e.target.value,10) }}})} />
                                    </div>
                                     <div>
                                        <Label htmlFor="coding-memorylimit">Memory Limit (MB)</Label>
                                        <Input id="coding-memorylimit" type="number" value={testData.autoEvaluation?.coding?.memoryLimit} onChange={e => setTestData({ autoEvaluation: { ...testData.autoEvaluation, coding: {...testData.autoEvaluation?.coding, memoryLimit: parseInt(e.target.value,10) }}})} />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    {testData.formats.includes('Audio/Video') && (
                        <AccordionItem value="audiovideo-settings">
                            <AccordionTrigger>Audio/Video Response Settings</AccordionTrigger>
                            <AccordionContent className="space-y-4 p-2">
                               <div className="flex items-center space-x-2">
                                    <Switch id="av-transcription" checked={testData.autoEvaluation?.audioVideo?.autoTranscription} onCheckedChange={c => setTestData({ autoEvaluation: { ...testData.autoEvaluation, audioVideo: {...testData.autoEvaluation?.audioVideo, autoTranscription: c}}})} />
                                    <Label htmlFor="av-transcription">Enable auto-transcription (if available)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch id="av-manualflag" checked={testData.autoEvaluation?.audioVideo?.manualReviewFlag} onCheckedChange={c => setTestData({ autoEvaluation: { ...testData.autoEvaluation, audioVideo: {...testData.autoEvaluation?.audioVideo, manualReviewFlag: c}}})} />
                                    <Label htmlFor="av-manualflag">Flag for manual review by default</Label>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            </CardContent>
        </Card>

        {/* Preview Panel Placeholder */}
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center"><Eye className="mr-2 h-5 w-5 text-primary"/> Candidate Preview (Mock)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="p-4 border rounded-lg bg-muted/50 min-h-[100px] text-sm text-muted-foreground">
                    <p>Candidate view preview will appear here, showing shuffled/customized flow. (UI coming soon)</p>
                    {testData.shuffleQuestionsGlobal && <p className="mt-2 text-xs text-primary">Global shuffle is ON.</p>}
                    {sections.map(s => (
                        <div key={s.id} className="mt-1 text-xs">
                            <strong>Section: {s.name}</strong> ({s.shuffleQuestions ? 'shuffled' : 'ordered'}) - {s.questions.length} questions
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

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

      {/* Section Dialog (Add/Edit) */}
      <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSection?.id ? 'Edit Section' : 'Add New Section'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-3">
            <div>
              <Label htmlFor="section-name">Section Name</Label>
              <Input 
                id="section-name" 
                value={editingSection?.name || ''} 
                onChange={(e) => setEditingSection(prev => ({...prev!, name: e.target.value}))}
                placeholder="e.g., Core MCQs"
              />
            </div>
            <div className="flex items-center space-x-2">
                <Switch
                    id="section-shuffle"
                    checked={editingSection?.shuffleQuestions}
                    onCheckedChange={(checked) => setEditingSection(prev => ({...prev!, shuffleQuestions: checked}))}
                />
                <Label htmlFor="section-shuffle">Shuffle questions within this section</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSectionDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSectionFormSubmit}>
              {editingSection?.id ? 'Save Changes' : 'Add Section'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}