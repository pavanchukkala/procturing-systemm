"use client";

import { useState } from 'react';
import type { RecruiterTest } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card as ShadcnCard } from '@/components/ui/card'; // Renamed to avoid conflict
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, Users, MoreHorizontal, Filter, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockRecruiterTests: RecruiterTest[] = [
  { id: 't1', testName: 'Frontend Developer Challenge', companyRole: 'Frontend Engineer', invitedCandidatesCount: 25, scheduledDate: 'June 15, 2025', duration: '90 min', status: 'Active' },
  { id: 't2', testName: 'Backend API Test', companyRole: 'Backend Developer', invitedCandidatesCount: 18, scheduledDate: 'June 20, 2025', duration: '120 min', status: 'Scheduled' },
  { id: 't3', testName: 'Data Science Aptitude', companyRole: 'Data Scientist', invitedCandidatesCount: 30, scheduledDate: 'May 30, 2025', duration: '60 min', status: 'Completed' },
  { id: 't4', testName: 'Product Manager Case Study', companyRole: 'Product Manager', invitedCandidatesCount: 12, scheduledDate: 'July 01, 2025', duration: '48 hours', status: 'Draft' },
];

const getStatusBadgeVariant = (status: RecruiterTest['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Active': return 'default';
    case 'Scheduled': return 'outline';
    case 'Completed': return 'secondary';
    case 'Draft': return 'outline'; // or a more muted variant
    default: return 'outline';
  }
};


export function ManageInterviewsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RecruiterTest['status']>('all');
  
  const filteredTests = mockRecruiterTests.filter(test => {
    const matchesSearch = test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          test.companyRole.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
        <Input
          placeholder="Search tests or roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2 items-center">
            <Filter className="h-5 w-5 text-muted-foreground"/>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>
      <ShadcnCard className="shadow-md overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Test Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-center">Invited</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTests.length > 0 ? filteredTests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium whitespace-nowrap">{test.testName}</TableCell>
              <TableCell className="whitespace-nowrap">{test.companyRole}</TableCell>
              <TableCell className="text-center">{test.invitedCandidatesCount}</TableCell>
              <TableCell className="whitespace-nowrap">{test.scheduledDate}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(test.status)}>{test.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                       <span className="sr-only">Test Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" /> View Candidates
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" /> Edit Test
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Test
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                    No tests match your criteria.
                </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </ShadcnCard>
    </div>
  );
}
