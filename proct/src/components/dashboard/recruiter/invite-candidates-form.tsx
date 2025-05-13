"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MailPlus, Send } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const inviteFormSchema = z.object({
  emails: z.string().min(1, { message: 'Please enter at least one email.' }),
  testTemplate: z.string().min(1, { message: 'Please select a test template.' }),
  scheduleDate: z.string().min(1, { message: 'Please select a schedule date.' }), 
  customMessage: z.string().optional(),
  csvFile: z.any().optional(),
});

export function InviteCandidatesForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      emails: '',
      testTemplate: '',
      scheduleDate: '',
      customMessage: '',
    },
  });

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast({ title: "Success", description: `${file.name} uploaded successfully.` });
        }
      }, 300);
    }
  }

  async function onSubmit(values: z.infer<typeof inviteFormSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setOpen(false);
    form.reset();
    toast({
      title: 'Invitations Sent!',
      description: `Candidates have been invited for the ${values.testTemplate} test.`,
      variant: 'default',
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <MailPlus className="mr-2 h-4 w-4" /> Invite Candidates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Invite Candidates</DialogTitle>
          <DialogDescription>
            Fill in the details below to send out interview or test invitations.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate Emails</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter email addresses, separated by commas or new lines"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-sm text-muted-foreground text-center my-2">OR</div>
            <FormField
              control={form.control}
              name="csvFile"
              render={() => ( 
                <FormItem>
                  <FormLabel>Upload CSV</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                       <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileUpload} className="cursor-pointer"/>
                    </div>
                  </FormControl>
                  {isUploading && <Progress value={uploadProgress} className="w-full mt-2 h-2" />}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="testTemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test/Interview Template</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="frontend-dev-test">Frontend Developer Test</SelectItem>
                      <SelectItem value="backend-dev-test">Backend Developer Test</SelectItem>
                      <SelectItem value="data-analyst-mcq">Data Analyst MCQ</SelectItem>
                      <SelectItem value="managerial-interview">Managerial Round Interview</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scheduleDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a personal message to the invitation" {...field} rows={2}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || isUploading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Send Invitations
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
