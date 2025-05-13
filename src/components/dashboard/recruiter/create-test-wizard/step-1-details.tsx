"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import type { TestPaper, TestFormat } from '@/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, ArrowRight } from 'lucide-react';

const testFormats: { id: TestFormat; label: string }[] = [
  { id: 'MCQ', label: 'Multiple Choice Questions (MCQs)' },
  { id: 'Coding', label: 'Coding Challenges' },
  { id: 'Audio/Video', label: 'Audio/Video Responses' },
];

const detailsSchema = z.object({
  name: z.string().min(5, { message: "Test name must be at least 5 characters." }),
  duration: z.coerce.number().min(1, { message: "Duration must be at least 1." }),
  durationUnit: z.enum(['minutes', 'hours']),
  formats: z.array(z.string()).min(1, { message: "Select at least one test format." }),
});

type DetailsFormData = z.infer<typeof detailsSchema>;

interface Step1DetailsProps {
  testData: TestPaper;
  setTestData: (data: Partial<TestPaper>) => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

export function Step1Details({ testData, setTestData, onNext, onSaveDraft }: Step1DetailsProps) {
  const form = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      name: testData.name,
      duration: testData.duration,
      durationUnit: testData.durationUnit,
      formats: testData.formats,
    },
  });

  const onSubmit = (data: DetailsFormData) => {
    setTestData(data as Partial<TestPaper>);
    onNext();
  };

  const handleSaveDraftClick = () => {
    const values = form.getValues();
    setTestData(values as Partial<TestPaper>);
    onSaveDraft();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Test Details</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Backend Engineer – Level 2" {...field} />
                  </FormControl>
                  <FormDescription>A descriptive name for this test paper.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="formats"
              render={() => (
                <FormItem>
                  <FormLabel>Test Format</FormLabel>
                  <FormDescription>Select all applicable formats for this test.</FormDescription>
                  <div className="space-y-2 pt-2">
                    {testFormats.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="formats"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={handleSaveDraftClick}>
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            <Button type="submit">
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}