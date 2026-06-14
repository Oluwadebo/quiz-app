export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  topic: string;
  isActive: boolean;
  order: number;
}

export interface Test {
  _id: string;
  courseId: string;
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  questionCount: number;
  timeLimit: number;
  passMark: number;
  maxAttemptsPerWeek: number;
  isActive: boolean;
  unlocked?: boolean;
}

export interface Question {
  id: string;
  questionId: string;
  question: string;
  shuffledOptions: { key: string; value: string }[];
}

export interface TestSession {
  _id: string;
  testId: string;
  courseId: string;
  questions: Question[];
  timeLimit: number;
  startTime: string;
  status: "ongoing" | "completed" | "expired";
  attemptNumber: number;
  timeRemaining?: number;
}

export interface SessionResult {
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  passMark: number;
}

export interface HistoryItem {
  _id: string;
  testId: { title: string; level: string; passMark: number };
  courseId: { title: string; topic: string };
  score: number;
  passed: boolean;
  status: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  bestScore: number;
  attempts: number;
}

export interface Settings {
  platformName: string;
  platformDescription: string;
}