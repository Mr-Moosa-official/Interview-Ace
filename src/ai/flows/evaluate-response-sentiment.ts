'use server';

/**
 * @fileOverview Analyzes interview responses for sentiment and behavioral cues, providing feedback on communication style and approach.
 *
 * - analyzeResponse - A function that handles the response analysis process.
 * - AnalyzeResponseInput - The input type for the analyzeResponse function.
 * - AnalyzeResponseOutput - The return type for the analyzeResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResponseInputSchema = z.object({
  question: z.string().describe('The interview question asked.'),
  response: z.string().describe('The candidate\'s response to the question.'),
});
export type AnalyzeResponseInput = z.infer<typeof AnalyzeResponseInputSchema>;

const AnalyzeResponseOutputSchema = z.object({
  sentiment: z.string().describe('The overall sentiment of the response (e.g., positive, negative, neutral).'),
  behavioralCues: z.string().describe('Identified behavioral cues in the response (e.g., confidence, hesitation).'),
  communicationStyleFeedback: z.string().describe('Feedback on the candidate\'s communication style (e.g., clarity, conciseness).'),
  approachFeedback: z.string().describe('Feedback on the candidate\'s approach to answering the question (e.g., problem-solving, teamwork).'),
});
export type AnalyzeResponseOutput = z.infer<typeof AnalyzeResponseOutputSchema>;

export async function analyzeResponse(input: AnalyzeResponseInput): Promise<AnalyzeResponseOutput> {
  return analyzeResponseFlow(input);
}

const analyzeResponsePrompt = ai.definePrompt({
  name: 'analyzeResponsePrompt',
  input: {schema: AnalyzeResponseInputSchema},
  output: {schema: AnalyzeResponseOutputSchema},
  prompt: `You are an AI-powered interview coach. Analyze the candidate's response to the interview question and provide feedback.

Question: {{{question}}}
Response: {{{response}}}

Analyze the response for sentiment, behavioral cues, communication style, and approach. Provide specific feedback to help the candidate improve their interview technique.`,
});

const analyzeResponseFlow = ai.defineFlow(
  {
    name: 'analyzeResponseFlow',
    inputSchema: AnalyzeResponseInputSchema,
    outputSchema: AnalyzeResponseOutputSchema,
  },
  async input => {
    const {output} = await analyzeResponsePrompt(input);
    return output!;
  }
);
