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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, Smile, Frown, Meh, CheckCircle2, XCircle } from 'lucide-react';
import { analyzeSentiment, type SentimentAnalysisOutput } from '@/ai/flows/sentiment-analysis'; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from 'react';

const formSchema = z.object({
  textToAnalyze: z.string().min(10, { message: 'Please enter at least 10 characters for analysis.' }),
});

export function SentimentAnalysisTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SentimentAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textToAnalyze: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    try {
      const result = await analyzeSentiment({ text: values.textToAnalyze });
      setAnalysisResult(result);
    } catch (err) {
      console.error("Sentiment analysis error:", err);
      setError("Failed to analyze sentiment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }
  
  const getSentimentIcon = (sentiment?: string) => {
    if (!sentiment) return Meh;
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment.includes('positive')) return Smile;
    if (lowerSentiment.includes('negative')) return Frown;
    return Meh;
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Wand2 className="mr-2 h-6 w-6 text-primary" />
          Sentiment & Communication Analyzer
        </CardTitle>
        <CardDescription>
          Paste an interview response below to analyze its sentiment and communication quality.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="textToAnalyze"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="textToAnalyze" className="text-lg">Interview Response Text</FormLabel>
                  <FormControl>
                    <Textarea
                      id="textToAnalyze"
                      placeholder="E.g., 'I am very excited about this opportunity and believe my skills in Next.js align perfectly with the job requirements...'"
                      {...field}
                      rows={8}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-5 w-5" />
              )}
              Analyze Text
            </Button>
          </CardFooter>
        </form>
      </Form>

      {error && (
        <div className="p-6 pt-0">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {analysisResult && (
        <div className="p-6 pt-0 space-y-6">
          <h3 className="text-xl font-semibold border-t pt-6">Analysis Results:</h3>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Overall Sentiment</CardTitle>
              {React.createElement(getSentimentIcon(analysisResult.sentiment), { className: "h-6 w-6 text-primary" })}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{analysisResult.sentiment}</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Communication Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysisResult.communicationSkillsAssessment}</p>
            </CardContent>
          </Card>
           <Alert variant={analysisResult.isGoodQuality ? "default" : "destructive"} className={analysisResult.isGoodQuality ? "bg-green-100/50 border-green-300 dark:bg-green-900/30 dark:border-green-700" : "bg-red-100/50 border-red-300 dark:bg-red-900/30 dark:border-red-700"}>
            {analysisResult.isGoodQuality ? <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" /> : <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
            <AlertTitle className={analysisResult.isGoodQuality ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}>Response Quality</AlertTitle>
            <AlertDescription className={analysisResult.isGoodQuality ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}>
              {analysisResult.isGoodQuality
                ? "The sentiment of the response is considered good quality."
                : "The sentiment of the response may indicate areas for improvement or concern."}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}
