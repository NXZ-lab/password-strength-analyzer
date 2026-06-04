export interface AnalysisFeedback {
  warning: string;
  suggestions: string[];
}

export interface PasswordAnalysis {
  password: string;
  score: number;
  label: 'Weak' | 'Medium' | 'Strong';
  crackTimeDisplay: string;
  entropy: number;
  length: number;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialCharacters: boolean;
  patternSummary: string[];
  feedback: AnalysisFeedback;
}

export interface ApiMessage {
  message: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    createdAt: string;
  };
}

export interface DashboardSnapshot {
  latestPasswordScore: number;
  latestPasswordLabel: string;
  breachStatus: boolean;
  reuseStatus: boolean;
  updatedAt: string | null;
  historyCount: number;
}

export interface BreachResponse {
  breached: boolean;
  count: number;
}

export interface PasswordSubmissionResponse {
  message: string;
  reused: boolean;
  breached: boolean;
  historyCount: number;
}
