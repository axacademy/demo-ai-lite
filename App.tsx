
import React, { useState, useEffect, useCallback } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Survey } from './components/Survey';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultsDashboard } from './components/ResultsDashboard';
import { SURVEY_CATEGORIES } from './constants';
import { SAMPLE_RESULT } from './sampleData';
import type { SurveyData, AnalysisResult, CategoryScore, GeminiAnalysis } from './types';
import { AppState } from './types';
import { SampleSurvey } from './components/SampleSurvey';

// ===================================================================================
// MOCK ANALYSIS FUNCTION - NO API KEY OR API CALLS
// ===================================================================================
// This function simulates an analysis by returning pre-defined sample data.
// This is for demonstration purposes only and does NOT make any external API calls.
// ===================================================================================
const getMockAnalysis = async (scores: CategoryScore[]): Promise<GeminiAnalysis> => {
  console.log("Generating mock analysis using sample data. Scores received:", scores);

  // Simulate a network delay to mimic a real API call.
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return the static sample result. No API is called.
  return SAMPLE_RESULT.analysis;
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({});
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isSampleView, setIsSampleView] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedStep = localStorage.getItem('surveyStep');
      const savedData = localStorage.getItem('surveyData');
      if (savedStep && savedData) {
        const parsedStep = parseInt(savedStep, 10);
        const parsedData = JSON.parse(savedData);
        // If survey was completed, show results directly
        if(localStorage.getItem('analysisResult')) {
          setAnalysisResult(JSON.parse(localStorage.getItem('analysisResult')!));
          setAppState(AppState.RESULTS);
        } else if (parsedStep < SURVEY_CATEGORIES.length) {
            setCurrentStep(parsedStep);
            setSurveyData(parsedData);
            setAppState(AppState.SURVEY);
        }
      }
    } catch (error) {
        console.error("Failed to load saved progress from localStorage", error);
        localStorage.clear();
    }
  }, []);

  const handleViewSample = () => {
    setAnalysisResult(SAMPLE_RESULT);
    setIsSampleView(true);
    setAppState(AppState.RESULTS);
  };

  const handleViewSampleSurvey = () => {
    setAppState(AppState.SAMPLE_SURVEY);
  };

  const handleAnswer = (questionId: string, score: number) => {
    const newData = { ...surveyData, [questionId]: score };
    setSurveyData(newData);
    localStorage.setItem('surveyData', JSON.stringify(newData));
  };

  const handleNext = () => {
    const nextStep = currentStep + 1;
    if (nextStep < SURVEY_CATEGORIES.length) {
      setCurrentStep(nextStep);
      localStorage.setItem('surveyStep', nextStep.toString());
    }
  };

  const handlePrev = () => {
    const prevStep = currentStep - 1;
    if (prevStep >= 0) {
      setCurrentStep(prevStep);
      localStorage.setItem('surveyStep', prevStep.toString());
    }
  };
  
  const handleSurveySubmit = useCallback(async () => {
    setAppState(AppState.LOADING);
    const categoryScores: CategoryScore[] = SURVEY_CATEGORIES.map(category => {
      const numQuestions = category.questions.length;
      const minPossibleScore = numQuestions * 1;
      const maxPossibleScore = numQuestions * 5;

      const totalScore = category.questions.reduce((sum, q) => {
        // Assume all questions are answered as the UI enforces it.
        return sum + (surveyData[q.id] || 0);
      }, 0);

      if (totalScore === 0) {
        return { category: category.title, score: 0 };
      }

      // Normalize the score to a 0-100 scale.
      const normalizedScore = ((totalScore - minPossibleScore) / (maxPossibleScore - minPossibleScore)) * 100;
      
      return { 
          category: category.title, 
          score: Math.round(normalizedScore),
      };
    });

    try {
      // This is a local mock analysis call that returns sample data for demonstration.
      // No actual API call is made and no API key is used.
      const result = await getMockAnalysis(categoryScores);
      
      const newAnalysisResult = { scores: categoryScores, analysis: result };
      setAnalysisResult(newAnalysisResult);
      localStorage.setItem('analysisResult', JSON.stringify(newAnalysisResult));
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error("Error getting analysis:", error);
      const errorMessage = error instanceof Error ? error.message : "분석 결과를 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.";
      alert(errorMessage);
      setAppState(AppState.SURVEY); // Go back to survey on error
    }
  }, [surveyData]);

  const handleRestart = () => {
    setAppState(AppState.WELCOME);
    setCurrentStep(0);
    setSurveyData({});
    setAnalysisResult(null);
    setIsSampleView(false);
    localStorage.removeItem('surveyStep');
    localStorage.removeItem('surveyData');
    localStorage.removeItem('analysisResult');
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.WELCOME:
        return <WelcomeScreen onViewSample={handleViewSample} onViewSampleSurvey={handleViewSampleSurvey} />;
      case AppState.SURVEY:
        return (
          <Survey
            currentStep={currentStep}
            surveyData={surveyData}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrev={handlePrev}
            onSubmit={handleSurveySubmit}
          />
        );
      case AppState.SAMPLE_SURVEY:
        return <SampleSurvey onBack={handleRestart} onViewResults={handleViewSample} />;
      case AppState.LOADING:
        return <LoadingScreen />;
      case AppState.RESULTS:
        return analysisResult && <ResultsDashboard result={analysisResult} onRestart={handleRestart} isSample={isSampleView} />;
      default:
        return <WelcomeScreen onViewSample={handleViewSample} onViewSampleSurvey={handleViewSampleSurvey} />;
    }
  };

  return (
    <div className="antialiased w-full bg-slate-900 text-white min-h-screen">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-900/50 rounded-full blur-3xl opacity-40 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-900/50 rounded-full blur-3xl opacity-40 animate-pulse-slow animation-delay-2000"></div>
      </div>
      <div className="relative z-10">
        {renderContent()}
      </div>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
        .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default App;
