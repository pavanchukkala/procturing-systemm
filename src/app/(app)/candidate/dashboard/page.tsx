// src/app/(app)/candidate/dashboard/page.tsx
"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader2, ClipboardList, Clock, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DisplayItemsGrid } from "@/components/dashboard/candidate/display-items-grid";
import type { CandidateInterview, InterviewStatus, MockStatus } from "@/types";

// Your 9 mock items here...
const mockItems: CandidateInterview[] = [
  { id: '1', companyLogoUrl: 'https://picsum.photos/seed/Google/40/40', companyName: 'Google', role: 'Frontend Engineer – Intern', lpa: '₹12 LPA', duration: '30 min', questions: '2 Video Qs + Discussion', scheduledDate: 'June 10, 2025 at 2:00 PM', status: 'Upcoming', type: 'Interview' },
  /* ...rest of mocks... */
];

type MainTabValue = 'interviews' | 'exams' | 'mock';
type SubTabStatusValue = 'ongoing' | 'completed';
type MockSubTabStatusValue = 'practiceNew' | 'reviewed';
const SUB_TAB_LIST_CLASSES = "inline-flex h-9 items-center justify-start rounded-md bg-muted p-1 mb-6";

export default function CandidateDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dashLoading, setDashLoading] = useState(true);

  // redirect if not logged in
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/");
      } else {
        setDashLoading(false);
      }
    }
  }, [user, loading, router]);

  // dashboard UI state
  const [activeMainTab, setActiveMainTab] = useState<MainTabValue>('interviews');
  const [activeInterviewSubTab, setActiveInterviewSubTab] = useState<SubTabStatusValue>('ongoing');
  const [activeExamSubTab, setActiveExamSubTab] = useState<SubTabStatusValue>('ongoing');
  const [activeMockSubTab, setActiveMockSubTab] = useState<MockSubTabStatusValue>('practiceNew');
  const [clientTime, setClientTime] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('date-desc');

  useEffect(() => {
    setClientTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  if (loading || dashLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // filter data
  const interviews = mockItems.filter(i => i.type === 'Interview');
  const ongoingInterviews = interviews.filter(i => ['Pending','Upcoming','In Progress'].includes(i.status as InterviewStatus));
  const completedInterviews = interviews.filter(i => ['Submitted','Completed','Missed'].includes(i.status as InterviewStatus));
  const exams = mockItems.filter(i => i.type === 'Exam');
  const ongoingExams = exams.filter(i => ['Pending','Upcoming','In Progress'].includes(i.status as InterviewStatus));
  const completedExams = exams.filter(i => ['Submitted','Completed','Missed'].includes(i.status as InterviewStatus));
  const mocks = mockItems.filter(i => i.type === 'Mock Interview' || i.type === 'Mock Exam');
  const practiceNew = mocks.filter(i => i.status === 'Not Taken');
  const reviewed = mocks.filter(i => ['Taken','Reviewed'].includes(i.status as MockStatus));

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Assessments"
        icon={ClipboardList}
        actions={
          <div className="flex gap-2 items-center">
            {clientTime && (
              <div className="flex items-center gap-2 text-sm p-2 border rounded-md">
                <Clock className="h-4 w-4" />
                <span>{clientTime}</span>
              </div>
            )}
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
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

      <Tabs value={activeMainTab} onValueChange={setActiveMainTab}>
        <TabsList className="border-b mb-4">
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="mock">Mock Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="interviews">
          <Tabs value={activeInterviewSubTab} onValueChange={setActiveInterviewSubTab}>
            <TabsList className={SUB_TAB_LIST_CLASSES}>
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

        <TabsContent value="exams">
          <Tabs value={activeExamSubTab} onValueChange={setActiveExamSubTab}>
            <TabsList className={SUB_TAB_LIST_CLASSES}>
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

        <TabsContent value="mock">
          <Tabs value={activeMockSubTab} onValueChange={setActiveMockSubTab}>
            <TabsList className={SUB_TAB_LIST_CLASSES}>
              <TabsTrigger value="practiceNew">Practice New</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
            </TabsList>
            <TabsContent value="practiceNew">
              <DisplayItemsGrid items={practiceNew} title="Available Mock Sessions" emptyContext="mock sessions to practice" actionButton={<Button>Explore Mock</Button>} />
            </TabsContent>
            <TabsContent value="reviewed">
              <DisplayItemsGrid items={reviewed} title="Reviewed Mock Sessions" emptyContext="reviewed mock sessions" />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}
