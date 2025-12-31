export type InterviewHistory = {
  id: string;
  date: string;
  role: string;
  seniority: string;
  overallScore: number;
};

export type PerformanceMetric = {
  name: string;
  score: number;
};

export type PerformanceOverTime = {
  date: string;
  "Overall Score": number;
  Clarity: number;
  Pace: number;
  Sentiment: number;
};
