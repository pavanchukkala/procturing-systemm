// File: src/app/(app)/candidate/dashboard/page.tsx

"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, Loader2, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DisplayItemsGrid } from '@/components/dashboard/candidate/display-items-grid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CandidateInterview, InterviewStatus, MockStatus } from '@/types';

const mockItems: CandidateInterview[] = [ /* … your mock data … */ ];

type MainTabValue = 'interviews' | 'exams' | 'mock';
type SubTabStatusValue = 'ongoing' | 'completed';
type MockSubTabStatusValue = 'practiceNew' | 'reviewed';

export default function CandidateDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  // Show loading spinner while auth state initializes or redirecting
  if (loading || !user) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Client-only UI state
  const [activeMainTab, setActiveMainTab] = useState<MainTabValue>('interviews');
  const [activeInterviewSubTab, setActiveInterviewSubTab] = useState<SubTabStatusValue>('ongoing');
  const [activeExamSubTab, setActiveExamSubTab] = useState<SubTabStatusValue>('ongoing');
  const [activeMockSubTab, setActiveMockSubTab] = useState<MockSubTabStatusValue>('practiceNew');
  const [clientCurrentTime, setClientCurrentTime] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('date-desc');

  useEffect(() => {
    setClientCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  // Filtered data
  const interviews = mockItems.filter(i => i.type === 'Interview');
  const ongoingInterviews = interviews.filter(i => ['Pending','Upcoming','In Progress'].includes(i.status as InterviewStatus));
  const completedInterviews = interviews.filter(i => ['Submitted','Completed','Missed'].includes(i.status as InterviewStatus));

  const exams = mockItems.filter(i => i.type === 'Exam');
  const ongoingExams = exams.filter(i => ['Pending','Upcoming','In Progress'].includes(i.status as InterviewStatus));
  const completedExams = exams.filter(i => ['Submitted','Completed','Missed'].includes(i.status as InterviewStatus));

  const mockAssessments = mockItems.filter(i => i.type.startsWith('Mock'));
  const mockPracticeNewItems = mockAssessments.filter(i => i.status === 'Not Taken');
  const mockReviewedItems = mockAssessments.filter(i => ['Taken','Reviewed'].includes(i.status as MockStatus));

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

      <Tabs value={activeMainTab} onValueChange={(v) => setActiveMainTab(v as MainTabValue)}>
        <TabsList className="flex border-b mb-6 overflow-x-auto">
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="mock">Mock Sessions</TabsTrigger>
        </TabsList>

        {/* Interviews Tab */}
        <TabsContent value="interviews">
          <Tabs value={activeInterviewSubTab} onValueChange={(v) => setActiveInterviewSubTab(v as SubTabStatusValue)}>
            <TabsList className="inline-flex p-1 mb-6 bg-muted rounded-md">
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="ongoing">
              <DisplayItemsGrid items={ongoingInterviews} title="Ongoing Interviews" emptyContext="ongoing interviews" />
            </TabsContent>
            <TabsContent value="completed">
              <DisplayItemsGrid items={completedInterviews} title="Completed Interviews" emptyContext="completed interviews" />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams">
          <Tabs value={activeExamSubTab} onValueChange={(v) => setActiveExamSubTab(v as SubTabStatusValue)}>
            <TabsList className="inline-flex p-1 mb-6 bg-muted rounded-md">
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="ongoing">
              <DisplayItemsGrid items={ongoingExams} title="Ongoing Exams" emptyContext="ongoing exams" />
            </TabsContent>
            <TabsContent value="completed">
              <DisplayItemsGrid items={completedExams} title="Completed Exams" emptyContext="completed exams" />
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Mock Sessions Tab */}
        <TabsContent value="mock">
          <Tabs value={activeMockSubTab} onValueChange={(v) => setActiveMockSubTab(v as MockSubTabStatusValue)}>
            <TabsList className="inline-flex p-1 mb-6 bg-muted rounded-md">
              <TabsTrigger value="practiceNew">Practice New</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
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
              <DisplayItemsGrid items={mockReviewedItems} title="Reviewed Mock Sessions" emptyContext="reviewed mock sessions" />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
