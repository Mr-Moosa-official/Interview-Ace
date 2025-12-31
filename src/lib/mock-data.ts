import { PerformanceMetric, PerformanceOverTime, InterviewHistory } from './types';

export const performanceData: PerformanceMetric[] = [
    { name: "Session 1", score: 65 },
    { name: "Session 2", score: 72 },
    { name: "Session 3", score: 78 },
    { name: "Session 4", score: 85 },
    { name: "Session 5", score: 82 },
];

export const performanceOverTimeData: PerformanceOverTime[] = [
    { date: "Jan", "Overall Score": 60, Clarity: 6, Pace: 7, Sentiment: 5 },
    { date: "Feb", "Overall Score": 65, Clarity: 7, Pace: 6, Sentiment: 7 },
    { date: "Mar", "Overall Score": 72, Clarity: 7, Pace: 8, Sentiment: 7 },
    { date: "Apr", "Overall Score": 78, Clarity: 8, Pace: 7, Sentiment: 8 },
    { date: "May", "Overall Score": 85, Clarity: 9, Pace: 8, Sentiment: 9 },
];

export const interviewHistoryData: InterviewHistory[] = [
    { id: "1", date: "2024-05-20", role: "Software Engineer", seniority: "Senior", overallScore: 85 },
    { id: "2", date: "2024-05-15", role: "Software Engineer", seniority: "Senior", overallScore: 78 },
    { id: "3", date: "2024-05-10", role: "Product Manager", seniority: "Mid-Level", overallScore: 82 },
    { id: "4", date: "2024-05-05", role: "UX/UI Designer", seniority: "Junior", overallScore: 75 },
    { id: "5", date: "2024-05-01", role: "Data Scientist", seniority: "Lead", overallScore: 90 },
];
