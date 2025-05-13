"use client";

import { useState } from 'react';
import type { TestTemplate } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, PlusCircle, FileText } from 'lucide-react';
import { CreateTemplateForm } from './create-template-form'; // To be created
import { format } from 'date-fns';

const mockTestTemplates: TestTemplate[] = [
  { id: 'tmpl1', name: 'Frontend Developer Basics', description: 'Assesses basic HTML, CSS, and JavaScript skills.', duration: '60 minutes', totalQuestions: 20, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'tmpl2', name: 'React Mid-Level Challenge', description: 'In-depth React concepts and problem-solving.', duration: '90 minutes', totalQuestions: 5, createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'tmpl3', name: 'General Aptitude Test', description: 'Logical reasoning and quantitative aptitude.', duration: '45 minutes', totalQuestions: 30, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
];


export function ManageTemplates() {
  const [templates, setTemplates] = useState<TestTemplate[]>(mockTestTemplates);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleTemplateCreated = () => {
    // Here you would typically refetch templates or add the new one to the list
    // For now, just close the dialog. A real implementation would update `templates` state.
    setIsCreateDialogOpen(false);
    // To simulate, we could add a mock template if needed, or rely on a toast message from the form.
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl">Test Templates</CardTitle>
            <CardDescription>Create, view, and manage your test and interview templates.</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Create New Test Template</DialogTitle>
                <DialogDescription>
                  Define the structure and content for your new assessment template.
                </DialogDescription>
              </DialogHeader>
              <CreateTemplateForm 
                onSuccess={handleTemplateCreated}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {templates.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-lg bg-muted/30">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-xl font-semibold">No Templates Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Click "Create New Template" to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-center">Questions</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium whitespace-nowrap">{template.name}</TableCell>
                    <TableCell className="whitespace-nowrap">{template.duration}</TableCell>
                    <TableCell className="text-center">{template.totalQuestions}</TableCell>
                    <TableCell className="whitespace-nowrap">{format(new Date(template.updatedAt), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Template Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem disabled>
                            <Eye className="mr-2 h-4 w-4" /> View/Edit Questions
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive" disabled>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Template
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
