'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { analyzeResponse, AnalyzeResponseOutput } from '@/ai/flows/evaluate-response-sentiment';
import { analyzeVoiceAndProvideFeedback, AnalyzeVoiceAndProvideFeedbackOutput } from '@/ai/flows/analyze-voice-feedback';
import { generateInterviewQuestions } from '@/ai/flows/generate-interview-questions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/components/app-layout';
import { AudioRecorder } from '@/components/audio-recorder';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, Wand2, Sparkles, MessageSquare, Ear, Smile, Meh, Frown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

type Feedback = {
  voiceAnalysis: AnalyzeVoiceAndProvideFeedbackOutput;
  behavioralAnalysis: AnalyzeResponseOutput;
};

function InterviewClientPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [answers, setAnswers] = useState<Record<number, { text: string; audio: string }>>({});
  const [feedbacks, setFeedbacks] = useState<Record<number, Feedback>>({});
  
  const jobRole = searchParams.get('jobRole') || 'Software Engineer';
  const seniorityLevel = searchParams.get('seniorityLevel') || 'Mid-Level';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const { questions } = await generateInterviewQuestions({ jobRole, seniorityLevel, numberOfQuestions: 5 });
        setQuestions(questions);
      } catch (error) {
        console.error("Failed to generate questions:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not generate interview questions. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [jobRole, seniorityLevel, toast]);

  const handleTextAnswerChange = (text: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: { ...prev[currentQuestionIndex], text } }));
  };

  const handleRecordingComplete = (audioDataUri: string) => {
     setAnswers(prev => ({ ...prev, [currentQuestionIndex]: { ...prev[currentQuestionIndex], audio: audioDataUri } }));
  };

  const analyzeCurrentAnswer = async () => {
    const currentAnswer = answers[currentQuestionIndex];
    if (!currentAnswer?.text || !currentAnswer?.audio) {
      toast({
        variant: "destructive",
        title: "Missing input",
        description: "Please record your voice and type your answer before submitting.",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const [voiceAnalysis, behavioralAnalysis] = await Promise.all([
        analyzeVoiceAndProvideFeedback({ audioDataUri: currentAnswer.audio }),
        analyzeResponse({ question: questions[currentQuestionIndex], response: currentAnswer.text })
      ]);
      setFeedbacks(prev => ({ ...prev, [currentQuestionIndex]: { voiceAnalysis, behavioralAnalysis } }));
    } catch (error) {
      console.error("Failed to analyze answer:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing your response. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentFeedback = feedbacks[currentQuestionIndex];

  const renderSentimentIcon = (sentiment: string) => {
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment.includes('positive')) return <Smile className="size-5 text-green-500" />;
    if (lowerSentiment.includes('negative')) return <Frown className="size-5 text-red-500" />;
    return <Meh className="size-5 text-yellow-500" />;
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Interview Session</h1>
          <p className="text-muted-foreground">
            Role: <span className="font-semibold text-primary">{jobRole}</span> | Level: <span className="font-semibold text-primary">{seniorityLevel}</span>
          </p>
        </header>
        
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-48" />
            </CardContent>
          </Card>
        ) : (
          questions.length > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                  <CardDescription className="text-lg text-foreground pt-2">
                    {questions[currentQuestionIndex]}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">1. Record your verbal answer</h3>
                        <AudioRecorder onRecordingComplete={handleRecordingComplete} disabled={isAnalyzing}/>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">2. Provide your answer in text</h3>
                        <Textarea
                            placeholder="Type your response here... The AI will analyze this text for content and structure."
                            value={answers[currentQuestionIndex]?.text || ''}
                            onChange={(e) => handleTextAnswerChange(e.target.value)}
                            rows={5}
                            disabled={isAnalyzing}
                        />
                    </div>
                  <Button onClick={analyzeCurrentAnswer} disabled={isAnalyzing || !answers[currentQuestionIndex]?.audio || !answers[currentQuestionIndex]?.text}>
                    {isAnalyzing ? "Analyzing..." : "Submit & Analyze Answer"}
                    <Wand2 className="ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {isAnalyzing && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>AI Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-1/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-1/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </CardContent>
                 </Card>
              )}

              {currentFeedback && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>AI Feedback</CardTitle>
                        <CardDescription>Here is the analysis of your response.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2"><Ear className="text-primary"/>Voice Analysis</h3>
                            <Alert>
                                <AlertTitle>Tone</AlertTitle>
                                <AlertDescription>{currentFeedback.voiceAnalysis.toneFeedback}</AlertDescription>
                            </Alert>
                             <Alert>
                                <AlertTitle>Clarity</AlertTitle>
                                <AlertDescription>{currentFeedback.voiceAnalysis.clarityFeedback}</AlertDescription>
                            </Alert>
                             <Alert>
                                <AlertTitle>Pace</AlertTitle>
                                <AlertDescription>{currentFeedback.voiceAnalysis.paceFeedback}</AlertDescription>
                            </Alert>
                        </div>
                         <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="text-primary"/>Behavioral Analysis</h3>
                            <Alert>
                                <div className="flex justify-between items-center">
                                    <AlertTitle>Sentiment</AlertTitle>
                                    <Badge variant="secondary" className="flex gap-2">
                                        {renderSentimentIcon(currentFeedback.behavioralAnalysis.sentiment)}
                                        {currentFeedback.behavioralAnalysis.sentiment}
                                    </Badge>
                                </div>
                                <AlertDescription>{currentFeedback.behavioralAnalysis.communicationStyleFeedback}</AlertDescription>
                            </Alert>
                             <Alert>
                                <AlertTitle>Behavioral Cues</AlertTitle>
                                <AlertDescription>{currentFeedback.behavioralAnalysis.behavioralCues}</AlertDescription>
                            </Alert>
                             <Alert>
                                <AlertTitle>Approach Feedback</AlertTitle>
                                <AlertDescription>{currentFeedback.behavioralAnalysis.approachFeedback}</AlertDescription>
                            </Alert>
                        </div>
                    </CardContent>
                 </Card>
              )}

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setCurrentQuestionIndex(p => p - 1)} disabled={currentQuestionIndex === 0}>
                  <ChevronLeft className="mr-2" /> Previous
                </Button>
                <Button onClick={() => setCurrentQuestionIndex(p => p + 1)} disabled={currentQuestionIndex === questions.length - 1}>
                  Next <ChevronRight className="ml-2" />
                </Button>
              </div>
            </>
          )
        )}
         { !isLoading && questions.length === 0 && (
             <Card className="text-center p-8">
                <CardTitle>Something went wrong</CardTitle>
                <CardDescription className="mt-2">We couldn't generate interview questions. Please go back and try again.</CardDescription>
                <Button asChild className="mt-4"><a href="/interview">Try Again</a></Button>
            </Card>
        )}
      </div>
    </AppLayout>
  );
}

export default function InterviewStartPage() {
    return (
        <Suspense fallback={
            <AppLayout>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-6 w-1/4" />
                    <Card>
                        <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                        <CardContent><Skeleton className="h-40 w-full" /></CardContent>
                    </Card>
                </div>
            </AppLayout>
        }>
            <InterviewClientPage />
        </Suspense>
    )
}
