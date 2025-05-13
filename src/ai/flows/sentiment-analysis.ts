'use server';
/**
 * @fileOverview Sentiment analysis of candidate interview responses.
 *
 * - analyzeSentiment - Analyzes the sentiment of a given text.
 * - SentimentAnalysisInput - The input type for the analyzeSentiment function.
 * - SentimentAnalysisOutput - The return type for the analyzeSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SentimentAnalysisInputSchema = z.object({
  text: z
    .string()
    .describe('The text to analyze for sentiment and communication skills.'),
});
export type SentimentAnalysisInput = z.infer<typeof SentimentAnalysisInputSchema>;

const SentimentAnalysisOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The overall sentiment of the text (e.g., positive, negative, neutral).'
    ),
  communicationSkillsAssessment: z
    .string()
    .describe(
      'An assessment of the communication skills demonstrated in the text.'
    ),
  isGoodQuality: z
    .boolean()
    .describe('Whether the sentiment of the response is of good quality.'),
});
export type SentimentAnalysisOutput = z.infer<typeof SentimentAnalysisOutputSchema>;

export async function analyzeSentiment(input: SentimentAnalysisInput): Promise<SentimentAnalysisOutput> {
  return analyzeSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sentimentAnalysisPrompt',
  input: {schema: SentimentAnalysisInputSchema},
  output: {schema: SentimentAnalysisOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing the sentiment and
communication skills demonstrated in interview responses.

Analyze the following text and provide:
1.  The overall sentiment.
2.  An assessment of the communication skills, and
3.  A boolean representing whether the sentiment of the response is of good quality.

Text: {{{text}}}`,
});

const analyzeSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeSentimentFlow',
    inputSchema: SentimentAnalysisInputSchema,
    outputSchema: SentimentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
