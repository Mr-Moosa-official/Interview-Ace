'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing voice input and providing feedback on tone, clarity, and pace.
 *
 * - analyzeVoiceAndProvideFeedback - The main function that orchestrates the voice analysis and feedback process.
 * - AnalyzeVoiceAndProvideFeedbackInput - The input type for the analyzeVoiceAndProvideFeedback function, including audio data.
 * - AnalyzeVoiceAndProvideFeedbackOutput - The output type for the analyzeVoiceAndProvideFeedback function, providing feedback on voice characteristics.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVoiceAndProvideFeedbackInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Ensure proper documentation
    ),
});
export type AnalyzeVoiceAndProvideFeedbackInput = z.infer<typeof AnalyzeVoiceAndProvideFeedbackInputSchema>;

const AnalyzeVoiceAndProvideFeedbackOutputSchema = z.object({
  toneFeedback: z.string().describe('Feedback on the tone of the voice.'),
  clarityFeedback: z.string().describe('Feedback on the clarity of the voice.'),
  paceFeedback: z.string().describe('Feedback on the pace of the voice.'),
});
export type AnalyzeVoiceAndProvideFeedbackOutput = z.infer<typeof AnalyzeVoiceAndProvideFeedbackOutputSchema>;

export async function analyzeVoiceAndProvideFeedback(
  input: AnalyzeVoiceAndProvideFeedbackInput
): Promise<AnalyzeVoiceAndProvideFeedbackOutput> {
  return analyzeVoiceAndProvideFeedbackFlow(input);
}

const analyzeVoiceAndProvideFeedbackPrompt = ai.definePrompt({
  name: 'analyzeVoiceAndProvideFeedbackPrompt',
  input: {schema: AnalyzeVoiceAndProvideFeedbackInputSchema},
  output: {schema: AnalyzeVoiceAndProvideFeedbackOutputSchema},
  prompt: `You are an AI voice analyst providing feedback on interview performance.

  Analyze the provided audio data for tone, clarity and pace.

  Provide specific feedback for each of these categories based on the audio provided. Focus on actionable advice the user can implement to improve.

  Audio data: {{media url=audioDataUri}}
  `,
});

const analyzeVoiceAndProvideFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeVoiceAndProvideFeedbackFlow',
    inputSchema: AnalyzeVoiceAndProvideFeedbackInputSchema,
    outputSchema: AnalyzeVoiceAndProvideFeedbackOutputSchema,
  },
  async input => {
    const {output} = await analyzeVoiceAndProvideFeedbackPrompt(input);
    return output!;
  }
);
