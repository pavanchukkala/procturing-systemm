"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/dashboard/recruiter/stat-card';
import { InviteCandidatesForm } from '@/components/dashboard/recruiter/invite-candidates-form';
import { ManageInterviewsTable } from '@/components/dashboard/recruiter/manage-interviews-table';
import { ManageTemplates } from '@/components/dashboard/recruiter/manage-templates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, CheckSquare, FileText, Loader2, Mail, BarChart3, ListChecks, FilePlus2 } from 'lucide-react';
import type { QuickStat } from '@/types';
import { Button } from '@/components/ui/button';

const mockQuickStats: QuickStat[] = [
  { label: 'Total Candidates Invited', value: 1250, icon: Users },
  { label: 'Active Interviews/Tests', value: 78, icon: ListChecks },
  { label: 'Completed This Month', value: 152, icon: CheckSquare },
  { label: 'Templates Available', value: 12, icon: FileText },
];

export default function RecruiterDashboardPage() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
        title="Recruiter Dashboard" 
        description="Oversee your recruitment pipeline, manage assessments, and invite candidates." 
        icon={BarChart3}
        actions={
          <div className="flex gap-2">
            <InviteCandidatesForm />
            <Button asChild>
              <Link href="/recruiter/tests/create">
                <FilePlus2 className="mr-2 h-4 w-4" /> Create New Test
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockQuickStats.map((stat) => (
          <StatCard
            key={stat.label}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="manage">Manage Tests</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="invitations">Invitations Log</TabsTrigger>
        </TabsList>
        <TabsContent value="manage" className="mt-6">
          <ManageInterviewsTable />
        </TabsContent>
        <TabsContent value="templates" className="mt-6">
          <ManageTemplates />
        </TabsContent>
        <TabsContent value="invitations" className="mt-6">
          <div className="text-center py-10 border border-dashed rounded-lg bg-card">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-xl font-semibold">Invitations Log</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Track the status of all sent invitations. (Feature coming soon)
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}