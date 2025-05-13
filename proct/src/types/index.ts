export type InterviewStatus = 'Pending' | 'In Progress' | 'Submitted' | 'Completed' | 'Upcoming' | 'Missed';
export type ExamStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Graded';
export type MockStatus = 'Not Taken' | 'Taken' | 'Reviewed';

export interface Interview {
  id: string;
  companyLogoUrl: string;
  companyName: string;
  role: string;
  lpa?: string; 
  stipend?: string; 
  duration: string; 
  questions: string; 
  scheduledDate: string; 
  status: InterviewStatus | MockStatus;
  type: 'Interview' | 'Exam' | 'Mock Interview' | 'Mock Exam';
}

export interface CandidateInterview extends Interview {
}

export interface RecruiterTest {
  id: string;
  testName: string;
  companyRole: string;
  invitedCandidatesCount: number;
  scheduledDate: string;
  duration: string;
  status: 'Active' | 'Scheduled' | 'Completed' | 'Draft';
}

export interface QuickStat {
  label: string;
  value: number;
  icon: React.ElementType;
}

export interface TestTemplateQuestion {
  id: string;
  text: string;
  type: 'MCQ' | 'Coding' | 'Video';
  options?: string[]; 
  correctAnswer?: string; 
}
export interface TestTemplate {
  id: string;
  name: string;
  description: string;
  duration: string; 
  totalQuestions: number;
  createdAt: string; 
  updatedAt: string; 
}

// Types for Test Paper Creation Feature
export type TestFormat = 'MCQ' | 'Coding' | 'Audio/Video' | 'Discussion'; // Added 'Discussion'

export interface TestQuestion {
  id: string;
  text: string;
  type: TestFormat;
  tags?: string[]; 
  // For MCQ
  options?: string[];
  correctAnswer?: string | string[]; 
  // For Coding
  defaultCode?: string;
  language?: 'javascript' | 'python' | 'java'; 
  testCases?: { input: string; expectedOutput: string; visible?: boolean }[];
  // For Audio/Video recording (asynchronous) or instructions in live interview
  prompt?: string; 
  maxDuration?: number; // Max recording duration in seconds (for async) or guideline for live
}

export interface TestSection {
  id: string;
  name: string;
  questions: TestQuestion[]; 
  shuffleQuestions?: boolean;
}

export interface TestPaper {
  id: string; 
  name: string;
  duration: number; 
  durationUnit: 'minutes' | 'hours'; 
  formats: TestFormat[];
  questions: TestQuestion[]; 
  sections?: TestSection[];
  shuffleQuestionsGlobal?: boolean;
  autoEvaluation?: {
    mcq?: { autoGrade: boolean; partialCreditMultiSelect?: boolean };
    coding?: { testCasesVisibility?: 'all' | 'hidden' | 'partial'; timeLimit?: number; memoryLimit?: number }; 
    audioVideo?: { autoTranscription?: boolean; manualReviewFlag?: boolean };
  };
  status?: 'Draft' | 'Published';
}

export type CandidateAnswer = {
  questionId: string;
  answer?: string | string[]; // string for coding/audio-video-path/text, string[] for MCQ multi-select
};

export interface ExamSession {
  testPaper: TestPaper;
  startTime: Date;
  endTime: Date;
  answers: CandidateAnswer[];
}

export interface LiveInterviewSessionData {
  id: string;
  title: string;
  interviewerName: string;
  candidateName: string;
  questions: TestQuestion[];
  durationMinutes: number; // Overall session duration
}