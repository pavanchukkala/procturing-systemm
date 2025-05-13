
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CandidateInterview, InterviewStatus, MockStatus } from '@/types';
import { ClipboardList, Loader2, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DisplayItemsGrid } from '@/components/dashboard/candidate/display-items-grid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const mockItems: CandidateInterview[] = [
  { id: '1', companyLogoUrl: 'https://picsum.photos/seed/Google/40/40', companyName: 'Google', role: 'Frontend Engineer – Intern', lpa: '₹12 LPA', duration: '30 min', questions: '2 Video Qs + Discussion', scheduledDate: 'June 10, 2025 at 2:00 PM', status: 'Upcoming', type: 'Interview' },
  { id: '2', companyLogoUrl: 'https://picsum.photos/seed/Microsoft/40/40', companyName: 'Microsoft', role: 'Software Engineer', stipend: '₹50,000/month stipend', duration: '45 min', questions: '20 MCQs', scheduledDate: 'June 12, 2025 at 10:00 AM', status: 'Pending', type: 'Exam' },
  { id: '3', companyLogoUrl: 'https://picsum.photos/seed/Amazon/40/40', companyName: 'Amazon', role: 'Data Analyst Test', duration: '90 min', questions: '3 Coding Problems', scheduledDate: 'June 5, 2025 at 3:00 PM', status: 'Completed', type: 'Exam' },
  { id: '4', companyLogoUrl: 'https://picsum.photos/seed/Netflix/40/40', companyName: 'Netflix', role: 'UX Designer Interview', duration: '20 min', questions: 'Portfolio Review + 2 Behavioral Qs', scheduledDate: 'May 28, 2025 at 11:00 AM', status: 'Upcoming', type: 'Interview' }, // Changed to Interview type
  { id: '5', companyLogoUrl: 'https://picsum.photos/seed/Facebook/40/40', companyName: 'Facebook', role: 'Mock Technical Interview', duration: '60 min', questions: '2 Coding Problems', scheduledDate: 'Practice Anytime', status: 'Not Taken', type: 'Mock Interview' },
  { id: '6', companyLogoUrl: 'https://picsum.photos/seed/Apple/40/40', companyName: 'Apple', role: 'Aptitude Mock Test', duration: '45 min', questions: '30 MCQs', scheduledDate: 'Practice Anytime', status: 'Taken', type: 'Mock Exam' },
  { id: '7', companyLogoUrl: 'https://picsum.photos/seed/Tesla/40/40', companyName: 'Tesla', role: 'Automation Engineer', duration: '75 min', questions: '2 Coding + Logical Qs', scheduledDate: 'June 18, 2025 at 11:00 AM', status: 'In Progress', type: 'Exam' }, // Was 'Interview', changed to 'Exam' for variety
  { id: '8', companyLogoUrl: 'https://picsum.photos/seed/Salesforce/40/40', companyName: 'Salesforce', role: 'CRM Developer Exam', duration: '90 min', questions: '30 MCQs + 1 Scenario', scheduledDate: 'June 1, 2025 at 4:00 PM', status: 'Missed', type: 'Exam' },
  { id: '9', companyLogoUrl: 'https://picsum.photos/seed/Uber/40/40', companyName: 'Uber', role: 'Backend Mock Interview', duration: '45 min', questions: 'System Design + 1 Coding', scheduledDate: 'Practice Anytime', status: 'Reviewed', type: 'Mock Interview' },
];

type MainTabValue = 'interviews' | 'exams' | 'mock';
type SubTabStatusValue = 'ongoing' | 'completed';
type MockSubTabStatusValue = 'practiceNew' | 'reviewed';

const SUB_TAB_LIST_CLASSES = "inline-flex h-9 items-center justify-start rounded-md bg-muted p-1 mb-6";

export default function CandidateDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState<MainTabValue>('interviews');
  const [activeInterviewSubTab, setActiveInterviewSubTab] = useState<SubTabStatusValue>('ongoing');
  const [activeExamSubTab, setActiveExamSubTab] = useState<SubTabStatusValue>('ongoing');
  const [activeMockSubTab, setActiveMockSubTab] = useState<MockSubTabStatusValue>('practiceNew');
  const [clientCurrentTime, setClientCurrentTime] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('date-desc'); 

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    setClientCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    return () => clearTimeout(timer);
  }, []);

  const interviews = mockItems.filter(item => item.type === 'Interview');
  const ongoingInterviews = interviews.filter(item => ['Pending', 'Upcoming', 'In Progress'].includes(item.status as InterviewStatus));
  const completedInterviews = interviews.filter(item => ['Submitted', 'Completed', 'Missed'].includes(item.status as InterviewStatus));

  const exams = mockItems.filter(item => item.type === 'Exam');
  const ongoingExams = exams.filter(item => ['Pending', 'Upcoming', 'In Progress'].includes(item.status as InterviewStatus));
  const completedExams = exams.filter(item => ['Submitted', 'Completed', 'Missed'].includes(item.status as InterviewStatus));

  const mockAssessments = mockItems.filter(item => item.type === 'Mock Interview' || item.type === 'Mock Exam');
  const mockPracticeNewItems = mockAssessments.filter(item => item.status === 'Not Taken');
  const mockReviewedItems = mockAssessments.filter(item => ['Taken', 'Reviewed'].includes(item.status as MockStatus));


  if (loading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Assessments" 
        icon={ClipboardList}
        actions={
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            {clientCurrentTime && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border rounded-md">
                    <Clock className="h-4 w-4" />
                    <span>{clientCurrentTime}</span>
                </div>
            )}
            <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2 opacity-50" />
                    <SelectValue placeholder="Filter / Sort" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                    <SelectItem value="duration-short">Duration (Shortest)</SelectItem>
                    <SelectItem value="duration-long">Duration (Longest)</SelectItem>
                </SelectContent>
            </Select>
          </div>
        }
      />

      <Tabs value={activeMainTab} onValueChange={(value) => setActiveMainTab(value as MainTabValue)} className="w-full">
        <TabsList className="flex border-b mb-6 justify-start sm:justify-center md:justify-start overflow-x-auto">
          <TabsTrigger value="interviews" className="px-4 py-2 sm:px-6 sm:py-3 -mb-px font-medium text-sm sm:text-base border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors whitespace-nowrap">Interviews</TabsTrigger>
          <TabsTrigger value="exams" className="px-4 py-2 sm:px-6 sm:py-3 -mb-px font-medium text-sm sm:text-base border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors whitespace-nowrap">Exams</TabsTrigger>
          <TabsTrigger value="mock" className="px-4 py-2 sm:px-6 sm:py-3 -mb-px font-medium text-sm sm:text-base border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors whitespace-nowrap">Mock Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="interviews" className="mt-0">
          <Tabs value={activeInterviewSubTab} onValueChange={(value) => setActiveInterviewSubTab(value as SubTabStatusValue)} className="w-full">
            <TabsList className={SUB_TAB_LIST_CLASSES}>
              <TabsTrigger value="ongoing" className="px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Ongoing</TabsTrigger>
              <TabsTrigger value="completed" className="px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="ongoing">
              <DisplayItemsGrid 
                items={ongoingInterviews} 
                title="Ongoing Interviews" 
                emptyContext="ongoing interviews" 
              />
            </TabsContent>
            <TabsContent value="completed">
              <DisplayItemsGrid 
                items={completedInterviews} 
                title="Completed Interviews" 
                emptyContext="completed interviews" 
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="exams" className="mt-0">
           <Tabs value={activeExamSubTab} onValueChange={(value) => setActiveExamSubTab(value as SubTabStatusValue)} className="w-full">
            <TabsList className={SUB_TAB_LIST_CLASSES}>
              <TabsTrigger value="ongoing" className="px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Ongoing</TabsTrigger>
              <TabsTrigger value="completed" className="px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="ongoing">
              <DisplayItemsGrid 
                items={ongoingExams} 
                title="Ongoing Exams" 
                emptyContext="ongoing exams" 
              />
            </TabsContent>
            <TabsContent value="completed">
              <DisplayItemsGrid 
                items={completedExams} 
                title="Completed Exams" 
                emptyContext="completed exams" 
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="mock" className="mt-0">
          <Tabs value={activeMockSubTab} onValueChange={(value) => setActiveMockSubTab(value as MockSubTabStatusValue)} className="w-full">
            <TabsList className={SUB_TAB_LIST_CLASSES}>
              <TabsTrigger value="practiceNew" className="px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Practice New</TabsTrigger>
              <TabsTrigger value="reviewed" className="px-3 py-1.5 text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">Reviewed</TabsTrigger>
            </TabsList>
            <TabsContent value="practiceNew">
              <DisplayItemsGrid 
                items={mockPracticeNewItems} 
                title="Available Mock Sessions" 
                emptyContext="mock sessions to practice"
                actionButton={<Button className="mt-4">Explore Mock Sessions</Button>}
              />
            </TabsContent>
            <TabsContent value="reviewed">
              <DisplayItemsGrid 
                items={mockReviewedItems} 
                title="Reviewed Mock Sessions" 
                emptyContext="reviewed mock sessions"
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
