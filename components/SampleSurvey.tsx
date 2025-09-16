
import React, { useState } from 'react';
import { SURVEY_CATEGORIES } from '../constants';
import type { SurveyData } from '../types';

const scaleOptions: { value: number; label: string }[] = [
  { value: 1, label: '전혀 그렇지 않다' },
  { value: 2, label: '그렇지 않다' },
  { value: 3, label: '보통이다' },
  { value: 4, label: '그렇다' },
  { value: 5, label: '매우 그렇다' },
];

interface SampleSurveyProps {
  onBack: () => void;
  onViewResults: () => void;
}

export const SampleSurvey: React.FC<SampleSurveyProps> = ({ onBack, onViewResults }) => {
  const category = SURVEY_CATEGORIES[0];
  const [sampleData, setSampleData] = useState<SurveyData>({});
  
  const handleAnswer = (questionId: string, score: number) => {
    setSampleData(prev => ({ ...prev, [questionId]: score }));
  };
  
  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-6 sm:p-10 rounded-2xl shadow-2xl shadow-black/20 animate-fade-in-slide">
        <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">진단 샘플 체험</h2>
            <p className="text-slate-400">실제 진단과 동일한 환경을 체험해볼 수 있습니다. (첫 번째 항목)</p>
        </div>

        <div className="mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-2">{category.title.replace('\n', ' ')}</h3>
            <p className="text-slate-400">{category.description}</p>
        </div>
        
        <div className="space-y-8 mt-8">
          {category.questions.map((q, index) => (
            <div key={q.id} className="border-t border-slate-700 pt-6 first:border-t-0 first:pt-0">
              <p className="text-slate-100 font-semibold mb-4 text-lg">{index + 1}. {q.text}</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {scaleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(q.id, option.value)}
                    className={`p-4 rounded-lg border-2 text-center transition-all duration-200 transform hover:-translate-y-1 ${
                      sampleData[q.id] === option.value
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

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onBack}
            className="w-full sm:w-auto bg-transparent text-slate-300 font-semibold py-3 px-6 rounded-lg hover:bg-slate-700/50 focus:outline-none focus:ring-4 focus:ring-slate-500/50 transition-colors duration-300 border border-slate-600"
          >
            처음으로 돌아가기
          </button>
          <button
            onClick={onViewResults}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/30"
          >
            샘플 결과보기
          </button>
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
}
