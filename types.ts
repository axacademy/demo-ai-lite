
export interface Question {
  id: string;
  text: string;
}

export interface Category {
  title: string;
  questions: Question[];
  description: string;
}

export interface SurveyData {
  [questionId: string]: number;
}

export interface Persona {
  name: string;
  description: string;
}

export interface CategoryScore {
  category: string;
  score: number; // Normalized 0-100
}

export interface GeminiAnalysis {
  persona: Persona;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface AnalysisResult {
  scores: CategoryScore[];
  analysis: GeminiAnalysis;
}

export enum AppState {
  WELCOME = 'welcome',
  SURVEY = 'survey',
  LOADING = 'loading',
  RESULTS = 'results',
  SAMPLE_SURVEY = 'sample_survey',
}

// FIX: Add global type declarations for jspdf and html2canvas to resolve TypeScript errors.
declare global {
  interface Window {
    jspdf: any;
  }
  const html2canvas: any;
}
