

import React, { useRef, useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { AnalysisResult } from '../types';
import { SURVEY_CATEGORIES } from '../constants';
import { DownloadIcon } from './icons/DownloadIcon';
import { RestartIcon } from './icons/RestartIcon';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onRestart: () => void;
  isSample?: boolean;
}

type PdfLibStatus = 'loading' | 'loaded' | 'error';

const AnalysisSection: React.FC<{ title: string; content: string[] }> = ({ title, content }) => {
    // Simple markdown parser for **bold** text
    const renderLine = (line: string) => {
        const parts = line.split('**');
        return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-cyan-300">{part}</strong> : part));
    };

    return (
        <div className="bg-slate-900/50 p-6 sm:p-8 rounded-xl">
            <h3 className="text-xl font-bold text-cyan-400 border-b border-slate-700 pb-4 mb-5">
                {title}
            </h3>
            <div className="space-y-8 text-slate-300 leading-loose text-base">
                {content.map((line, index) => (
                    <div key={index}>
                        <div className="flex items-start">
                            <span className="mr-3 text-blue-500 font-bold text-lg leading-snug">›</span>
                            <p>{renderLine(line.replace(/^\d+\.\s*/, ''))}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CustomPolarAngleAxisTick = (props: any) => {
    const { x, y, textAnchor, payload } = props;
    
    if (typeof payload?.value !== 'string') {
        return null;
    }

    const parts = payload.value.split('\n');
    if (parts.length > 1) {
        return (
            <text x={x} y={y} textAnchor={textAnchor} fill="#94a3b8" fontSize={12}>
                <tspan x={x} dy="-0.5em">{parts[0]}</tspan>
                <tspan x={x} dy="1.2em">{parts[1]}</tspan>
            </text>
        )
    }
    return (
        <text x={x} y={y} textAnchor={textAnchor} fill="#94a3b8" fontSize={12}>
            {payload.value}
        </text>
    );
};

const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props;

  if (typeof payload?.value !== 'string') {
    return null;
  }

  const parts = payload.value.split('\n');
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} textAnchor="end" fill="#94a3b8" fontSize={12}>
        {parts.map((part, i) => (
            <tspan x={0} dy={i === 0 ? (parts.length > 1 ? "-0.5em" : "0.355em") : "1.2em"} key={i}>{part}</tspan>
        ))}
      </text>
    </g>
  );
};


export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onRestart, isSample = false }) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [pdfLibStatus, setPdfLibStatus] = useState<PdfLibStatus>('loading');

    useEffect(() => {
        const areLibsLoaded = () => {
            return typeof html2canvas === 'function' && 
                   window.jspdf && 
                   typeof window.jspdf.jsPDF === 'function';
        };

        if (areLibsLoaded()) {
            setPdfLibStatus('loaded');
            return;
        }

        let intervalId: ReturnType<typeof setInterval>;
        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            if (!areLibsLoaded()) {
                console.error("PDF generation libraries failed to load after 8 seconds.");
                setPdfLibStatus('error');
            }
        }, 8000);

        intervalId = setInterval(() => {
            if (areLibsLoaded()) {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
                setPdfLibStatus('loaded');
            }
        }, 500);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, []);

    useEffect(() => {
        if (!isDownloadingPdf) {
            return;
        }

        const generatePdf = async () => {
            const reportElement = reportRef.current;
            if (!reportElement) {
                setIsDownloadingPdf(false);
                return;
            }

            try {
                window.scrollTo(0, 0);
                await new Promise(resolve => setTimeout(resolve, 50));
                
                reportElement.classList.add('pdf-render-mode');

                const canvas = await html2canvas(reportElement, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#0f172a', // slate-900
                });
                
                reportElement.classList.remove('pdf-render-mode');

                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const ratio = canvas.width / canvas.height;
                const imgHeightInPdf = pdfWidth / ratio;

                let heightLeft = imgHeightInPdf;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInPdf);
                heightLeft -= pdfHeight;

                while (heightLeft > 0) {
                    position -= pdfHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInPdf);
                    heightLeft -= pdfHeight;
                }

                pdf.save('AI_Literacy_Report.pdf');
            } catch (error) {
                console.error("Error generating PDF:", error);
                alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
            } finally {
                setIsDownloadingPdf(false);
            }
        };

        const timerId = setTimeout(generatePdf, 500);

        return () => clearTimeout(timerId);
    }, [isDownloadingPdf]);

    const handleDownloadClick = () => {
        if (isDownloadingPdf) return;

        if (pdfLibStatus === 'error') {
            alert('PDF 생성 라이브러리를 로드하지 못했습니다. 네트워크 연결을 확인하거나 광고 차단기를 비활성화한 후 다시 시도해주세요.');
        } else if (pdfLibStatus === 'loaded') {
            setIsDownloadingPdf(true);
        }
    };
    
    const getButtonState = () => {
        if (isDownloadingPdf) {
            return { text: '저장 중...', className: 'bg-slate-600 cursor-wait', disabled: true, title: 'PDF를 생성하고 있습니다...' };
        }
        switch (pdfLibStatus) {
            case 'loading':
                return { text: '준비 중...', className: 'bg-slate-600 cursor-not-allowed', disabled: true, title: 'PDF 라이브러리를 로딩 중입니다...' };
            case 'loaded':
                return { text: 'PDF로 저장', className: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40', disabled: false, title: '결과를 PDF로 저장합니다.' };
            case 'error':
                return { text: '로드 실패', className: 'bg-red-600 hover:bg-red-700', disabled: false, title: 'PDF 라이브러리 로딩에 실패했습니다. 클릭하여 자세한 정보를 확인하세요.' };
        }
    };
    
    const buttonState = getButtonState();

  const formattedScores = result.scores.map(s => ({
    ...s,
    category: s.category.split('(')[0].trim()
  }));

  const overallAverageScore = (result.scores.reduce((acc, s) => acc + s.score, 0) / result.scores.length).toFixed(0);
  
  const sortedScoresForBarChart = [...formattedScores].sort((a, b) => a.score - b.score);
  
  const chartTooltipProps = {
    contentStyle: { 
        backgroundColor: 'rgba(30, 41, 59, 0.9)', 
        border: '1px solid #475569', 
        borderRadius: '0.5rem' 
    },
    cursor: { fill: 'rgba(148, 163, 184, 0.1)' }
  };

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-8">
        <div className="w-full max-w-6xl mx-auto animate-fade-in">
            <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">AI 리터러시 역량 진단 결과(샘플)</h1>
                <p className="text-slate-300 mt-3 text-base sm:text-lg">나의 AI 리터러시역량 수준을 진단하고, 성장을 위한 맞춤형 전략을 확인하세요!</p>
            </div>

            <div ref={reportRef} className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-6 sm:p-10 rounded-2xl shadow-2xl shadow-black/20">
                {/* Section 1: Overall Score & Persona */}
                 <div className="border-b border-slate-700 pb-10 mb-10">
                    <h2 className="text-2xl font-bold text-white mb-6">종합역량 분석</h2>
                    <div className="bg-slate-900/50 p-6 sm:p-8 rounded-xl flex flex-col md:flex-row items-center gap-6 md:gap-10">
                        <div className="text-center flex-shrink-0">
                            <p className="text-7xl lg:text-8xl font-bold text-cyan-400 tracking-tight">{overallAverageScore}</p>
                        </div>
                        <div className="flex-1 text-center md:text-left border-t-2 md:border-t-0 md:border-l-2 border-slate-700 pt-6 md:pt-0 md:pl-10">
                            <h3 className="text-2xl font-bold text-blue-400 mb-2">{result.analysis.persona.name}</h3>
                            <p className="text-slate-300 leading-relaxed">{result.analysis.persona.description}</p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Detailed Analysis */}
                <div className="border-b border-slate-700 pb-10 mb-10">
                    <h2 className="text-2xl font-bold text-white mb-6">AI 리터러시 상세 분석</h2>
                     <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
                        {formattedScores.map(s => (
                            <div key={s.category} className="bg-slate-900/50 p-3 rounded-lg text-center">
                                <h4 className="text-xs sm:text-sm font-semibold text-slate-400 h-10 flex items-center justify-center whitespace-pre-line">{s.category}</h4>
                                <p className="text-xl sm:text-2xl font-bold text-white mt-1">{s.score.toFixed(0)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-6">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4 text-center">종합 역량 밸런스</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedScores}>
                                    <PolarGrid stroke="#475569" />
                                    <PolarAngleAxis dataKey="category" tick={<CustomPolarAngleAxisTick />} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tickCount={6} tick={{ fill: '#94a3b8' }}/>
                                    <Radar name="역량점수" dataKey="score" stroke="#22d3ee" fill="#06b6d4" fillOpacity={0.6} isAnimationActive={!isDownloadingPdf} />
                                    <Tooltip {...chartTooltipProps} formatter={(value: number) => value.toFixed(0)} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4 text-center">개선 중점 역량</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={sortedScoresForBarChart} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                    <XAxis type="number" domain={[0, 100]} tickCount={6} tick={{ fill: '#94a3b8' }} />
                                    <YAxis type="category" dataKey="category" width={110} tick={<CustomYAxisTick />} interval={0} />
                                    <Tooltip {...chartTooltipProps} formatter={(value: number) => value.toFixed(0)} />
                                    <Bar dataKey="score" fill="#3b82f6" name="점수" isAnimationActive={!isDownloadingPdf} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                
                {/* Section 3: AI Consultant Analysis */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">AI 컨설턴트의 상세 분석</h2>
                    <div className="space-y-8">
                        <AnalysisSection title="개인의 강점" content={result.analysis.strengths} />
                        <AnalysisSection title="개선 필요 영역" content={result.analysis.weaknesses} />
                        <AnalysisSection title="실행 권장 사항" content={result.analysis.recommendations} />
                    </div>
                </div>
            </div>

            <div className="flex justify-center space-x-4 mt-10">
                <button 
                onClick={handleDownloadClick} 
                className={`text-white font-bold py-3 px-6 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 text-base ${buttonState.className}`}
                disabled={buttonState.disabled}
                title={buttonState.title}
                >
                    <DownloadIcon className={`w-5 h-5 mr-2 ${isDownloadingPdf ? 'animate-spin' : ''}`} /> 
                    {buttonState.text}
                </button>
                <button onClick={onRestart} className="bg-transparent text-slate-300 font-semibold py-3 px-6 rounded-lg hover:bg-slate-700/50 focus:outline-none focus:ring-4 focus:ring-slate-500/50 transition-colors duration-300 border border-slate-600 flex items-center text-base">
                    <RestartIcon className="w-5 h-5 mr-2" /> {isSample ? '처음으로' : '다시하기'}
                </button>
            </div>
        </div>
         <style>{`
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
            .pdf-render-mode {
                color: #e2e8f0 !important; /* slate-200 */
            }
            .pdf-render-mode h1, .pdf-render-mode h2, .pdf-render-mode h3, .pdf-render-mode p, .pdf-render-mode span {
                text-shadow: none !important;
            }
            .pdf-render-mode .text-cyan-400 { color: #22d3ee !important; }
            .pdf-render-mode .text-blue-400 { color: #60a5fa !important; }
            .pdf-render-mode .text-blue-500 { color: #3b82f6 !important; }
            .pdf-render-mode .text-cyan-300 { color: #67e8f9 !important; }
            .pdf-render-mode .recharts-surface, .pdf-render-mode .recharts-wrapper {
                filter: none !important;
            }
        `}</style>
    </div>
  );
};
