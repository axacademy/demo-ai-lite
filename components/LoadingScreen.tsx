
import React, { useState, useEffect } from 'react';
import { LogoIcon } from './icons/LogoIcon';

const loadingMessages = [
    "AI 컨설턴트가 답변을 분석하고 있습니다...",
    "개인 맞춤형 리포트를 생성하는 중입니다...",
    "강점과 개선점을 도출하고 있습니다...",
    "나의 AI 리터러시역량 수준을 진단하고, 맞춤형 성장전략을 설계하는 중입니다...",
    "거의 다 되었습니다. 잠시만 기다려주세요."
];

export const LoadingScreen: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl shadow-2xl shadow-black/20 text-center flex flex-col items-center justify-center h-96">
                <LogoIcon className="h-20 w-20 text-cyan-400 animate-spin" />
                <h2 className="text-2xl font-bold text-white mt-6 mb-4">AI 리터러시 역량 진단 결과를 분석 중</h2>
                <p className="text-slate-300 transition-opacity duration-500 h-12 flex items-center">{loadingMessages[messageIndex]}</p>
                <div className="w-full max-w-xs bg-slate-700 rounded-full h-2.5 mt-8 overflow-hidden">
                    <div className="bg-blue-600 h-2.5 rounded-full animate-loading-bar"></div>
                </div>

                <style>{`
                    @keyframes loading-bar {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-loading-bar {
                        animation: loading-bar 1.5s ease-in-out infinite;
                    }
                `}</style>
            </div>
        </div>
    );
};
