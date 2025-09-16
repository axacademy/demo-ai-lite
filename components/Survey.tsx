import React from 'react';
import { SURVEY_CATEGORIES } from '../constants';
import type { SurveyData } from '../types';
import { CheckIcon } from './icons/CheckIcon';

interface SurveyProps {
  currentStep: number;
  surveyData: SurveyData;
  onAnswer: (questionId: string, score: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

const scaleOptions: { value: number; label: string }[] = [
  { value: 1, label: '전혀 그렇지 않다' },
  { value: 2, label: '그렇지 않다' },
  { value: 3, label: '보통이다' },
  { value: 4, label: '그렇다' },
  { value: 5, label: '매우 그렇다' },
];

export const Survey: React.FC<SurveyProps> = ({ currentStep, surveyData, onAnswer, onNext, onPrev, onSubmit }) => {
  const category = SURVEY_CATEGORIES[currentStep];
  const answeredCount = category.questions.filter(q => surveyData[q.id] !== undefined).length;
  const totalQuestions = category.questions.length;
  const allQuestionsAnswered = answeredCount === totalQuestions;
  const isLastStep = currentStep === SURVEY_CATEGORIES.length - 1;

  const getShortCategoryTitle = (title: string) => {
      return title.split('(')[0].trim();
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-6 sm:p-10 rounded-2xl shadow-2xl shadow-black/20 animate-fade-in-slide">
        {/* Stepper */}
        <div className="flex items-start justify-center mb-10">
          {SURVEY_CATEGORIES.map((cat, index) => (
            <React.Fragment key={cat.title}>
              <div className="flex flex-col items-center w-20">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    currentStep > index ? 'bg-blue-600 border-blue-600 text-white' : 
                    currentStep === index ? 'bg-slate-700 border-cyan-400' : 
                    'bg-transparent border-slate-600'
                  }`}
                >
                  {currentStep > index ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${currentStep === index ? 'bg-cyan-400' : 'bg-slate-600'}`}></div>
                  )}
                </div>
                <p className={`mt-2 text-xs text-center font-medium whitespace-pre-line ${currentStep === index ? 'text-cyan-400' : 'text-white'}`}>
                  {getShortCategoryTitle(cat.title)}
                </p>
              </div>
              {index < SURVEY_CATEGORIES.length - 1 && (
                <div className={`flex-1 h-0.5 mt-4 mx-1 transition-colors duration-300 ${currentStep > index ? 'bg-blue-600' : 'bg-slate-700'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Category Header */}
        <div className="mb-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{category.title.replace('\n', ' ')}</h2>
        </div>
        
        {/* Progress Bar */}
        <div className="flex justify-end items-center mb-1">
            <span className="text-sm font-semibold text-cyan-400">{answeredCount} / {totalQuestions}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5 mb-6">
            <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%` }}
            ></div>
        </div>
        
        <p className="text-slate-400 text-center mb-8">각 항목에 대해 현재 나의 수준과 가장 가깝다고 생각하는 단계를 선택해주세요.</p>

        {/* Questions */}
        <div className="space-y-8">
          {category.questions.map((q, index) => (
            <div key={q.id} className="border-t border-slate-700 pt-6 first:border-t-0 first:pt-0">
              <p className="text-slate-100 font-semibold mb-4 text-lg">{index + 1}. {q.text}</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {scaleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onAnswer(q.id, option.value)}
                    className={`p-4 rounded-lg border-2 text-center transition-all duration-200 transform hover:-translate-y-1 ${
                      surveyData[q.id] === option.value
                        ? 'bg-blue-900/60 border-cyan-500 shadow-lg shadow-cyan-900/20'
                        : 'bg-slate-900/50 border-slate-700 hover:border-cyan-400'
                    }`}
                  >
                    <span className="block text-xl font-bold text-slate-100">{option.value}</span>
                    <span className="block text-xs text-slate-400 mt-1">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <button
            onClick={onPrev}
            disabled={currentStep === 0}
            className="bg-transparent text-slate-300 font-semibold py-3 px-6 rounded-lg hover:bg-slate-700/50 focus:outline-none focus:ring-4 focus:ring-slate-500/50 transition-colors duration-300 border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          {isLastStep ? (
            <button
              onClick={onSubmit}
              disabled={!allQuestionsAnswered}
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 px-6 rounded-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-400/50 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              결과 분석하기
            </button>
          ) : (
            <button
              onClick={onNext}
              disabled={!allQuestionsAnswered}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              다음
            </button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-slide {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-slide { animation: fade-in-slide 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};
