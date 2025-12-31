import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-voice-feedback.ts';
import '@/ai/flows/evaluate-response-sentiment.ts';
import '@/ai/flows/generate-interview-questions.ts';