"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';

const createTemplateFormSchema = z.object({
  name: z.string().min(3, { message: 'Template name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  duration: z.string().min(1, { message: 'Please specify the duration.' }),
});

interface CreateTemplateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateTemplateForm({ onSuccess, onCancel }: CreateTemplateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createTemplateFormSchema>>({
    resolver: zodResolver(createTemplateFormSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: '',
    },
  });

  async function onSubmit(values: z.infer<typeof createTemplateFormSchema>) {
    setIsLoading(true);
    // Simulate API call to save template
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: 'Template Created!',
      description: `The template "${values.name}" has been successfully created.`,
    });
    onSuccess(); 
    form.reset();
  }

  const handleAddQuestion = () => {
    // Placeholder for adding question functionality
    console.log("Add question clicked - further implementation needed");
    toast({
      title: "Add Question",
      description: "Functionality to add questions to the template is not yet implemented.",
      variant: "default"
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Senior Frontend Developer Assessment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the purpose and content of this test template."
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 90 minutes, 2 hours" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Placeholder for adding questions section */}
        <div className="space-y-2 pt-4 border-t">
            <h4 className="font-medium text-md">Questions</h4>
            <p className="text-sm text-muted-foreground">
                Define the questions for this template. (Full question management coming soon)
            </p>
            <Button type="button" variant="outline" onClick={handleAddQuestion} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
            </Button>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Template
          </Button>
        </div>
      </form>
    </Form>
  );
}
