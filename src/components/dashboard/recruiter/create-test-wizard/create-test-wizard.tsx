"use client";

import { useState } from 'react';
import type { TestPaper, TestQuestion, TestSection } from '@/types';
import { StepIndicator } from './step-indicator';
import { Step1Details } from './step-1-details';
import { Step2Questions } from './step-2-questions';
import { Step3Customize } from './step-3-customize';
import { Step4Review } from './step-4-review';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const STEPS = [
  { id: 'details', name: 'Test Details' },
  { id: 'questions', name: 'Upload Questions' },
  { id: 'customize', name: 'Customize & Evaluate' },
  { id: 'review', name: 'Review & Publish' },
];

const initialTestPaperData: TestPaper = {
  name: '',
  duration: 60,
  durationUnit: 'minutes',
  formats: [],
  questions: [],
  sections: [],
  shuffleQuestionsGlobal: false,
  autoEvaluation: {
    mcq: { autoGrade: true, partialCreditMultiSelect: false },
    coding: { testCasesVisibility: 'hidden', timeLimit: 600, memoryLimit: 256 },
    audioVideo: { autoTranscription: false, manualReviewFlag: true },
  },
  status: 'Draft',
};

export function CreateTestWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [testPaperData, setTestPaperData] = useState<TestPaper>(initialTestPaperData);
  const { toast } = useToast();
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateTestData = (data: Partial<TestPaper>) => {
    setTestPaperData((prev) => ({ ...prev, ...data }));
  };

  const addQuestion = (question: TestQuestion) => {
    setTestPaperData((prev) => ({
      ...prev,
      questions: [...prev.questions, question],
    }));
  };

  const updateQuestion = (updatedQuestion: TestQuestion) => {
    setTestPaperData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)),
    }));
  };

  const deleteQuestion = (questionId: string) => {
     setTestPaperData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const addSection = (section: TestSection) => {
    setTestPaperData(prev => ({
      ...prev,
      sections: [...(prev.sections || []), section]
    }));
  };

   const updateSection = (updatedSection: TestSection) => {
    setTestPaperData(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s => s.id === updatedSection.id ? updatedSection : s)
    }));
  };

  const deleteSection = (sectionId: string) => {
    setTestPaperData(prev => ({
      ...prev,
      sections: (prev.sections || []).filter(s => s.id !== sectionId)
    }));
  };


  const handlePublish = () => {
    console.log('Publishing test paper:', testPaperData);
    // Simulate API call
    toast({
      title: 'Test Published!',
      description: `${testPaperData.name} has been successfully published.`,
    });
    // Potentially redirect to manage tests page or send invites
    router.push('/recruiter/dashboard'); // Example redirect
  };
  
  const handleSaveDraft = () => {
    console.log('Saving draft:', testPaperData);
    toast({
      title: 'Draft Saved!',
      description: `${testPaperData.name} has been saved as a draft.`,
    });
  }

  return (
    <div className="space-y-8">
      <StepIndicator currentStep={currentStep} steps={STEPS.map(s => s.name)} />

      <div className="min-h-[400px]">
        {currentStep === 0 && (
          <Step1Details
            testData={testPaperData}
            setTestData={updateTestData}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
          />
        )}
        {currentStep === 1 && (
          <Step2Questions
            testData={testPaperData}
            setTestData={updateTestData}
            questions={testPaperData.questions}
            addQuestion={addQuestion}
            updateQuestion={updateQuestion}
            deleteQuestion={deleteQuestion}
            onBack={handleBack}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
          />
        )}
        {currentStep === 2 && (
          <Step3Customize
            testData={testPaperData}
            setTestData={updateTestData}
            sections={testPaperData.sections || []}
            addSection={addSection}
            updateSection={updateSection}
            deleteSection={deleteSection}
            onBack={handleBack}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
          />
        )}
        {currentStep === 3 && (
          <Step4Review
            testData={testPaperData}
            onBack={handleBack}
            onPublish={handlePublish}
            onSaveDraft={handleSaveDraft}
          />
        )}
      </div>
    </div>
  );
}