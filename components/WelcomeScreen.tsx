
import React from 'react';

interface WelcomeScreenProps {
  onViewSample: () => void;
  onViewSampleSurvey: () => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-slate-800/50 p-6 rounded-lg border border-blue-900/50 backdrop-blur-sm transform transition-transform duration-300 hover:-translate-y-2">
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="font-bold text-lg text-cyan-400 mb-2">{title}</h3>
    <p className="text-slate-400">{children}</p>
  </div>
);

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onViewSample, onViewSampleSurvey }) => {
  return (
    <div className="w-full text-white overflow-x-hidden">
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-20">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6 animate-fade-in-down">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              AI 트랜스포메이션 시대,
            </span><br />
            나의 경쟁력은 준비되어 있는가?
          </h1>
          <p className="max-w-3xl text-slate-300 text-lg md:text-xl leading-relaxed mb-10 animate-fade-in-up animation-delay-300">
            누구나 AI를 이해하고 활용할 수 있어야, 커리어와 업무 경쟁력을 유지할 수 있습니다.<br />
            나의 현재 AI리터리시 상태를 진단하고, 미래를 위한 성장 로드맵을 시작하세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600 w-full max-w-md">
            <button
              onClick={onViewSampleSurvey}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/30 text-lg"
            >
              진단 샘플보기
            </button>
            <button
              onClick={onViewSample}
              className="w-full sm:w-auto bg-transparent text-slate-300 font-semibold py-4 px-8 rounded-lg hover:bg-slate-800/50 focus:outline-none focus:ring-4 focus:ring-slate-500/50 transition-colors duration-300 border border-slate-600 text-lg"
            >
              샘플 결과보기
            </button>
          </div>
          <div className="mt-8 animate-fade-in-up animation-delay-600">
            <a href="https://digitaltransformation.co.kr/ax-contact/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 text-lg font-semibold">
              AI리터러시역량진단 문의하기
            </a>
          </div>
        </section>

        <section className="py-20 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            AI 리터러시, 지금이 전환점입니다
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon="🚀" title="커리어 경쟁력">
              AI 활용 능력은 직무와 업종을 초월해 필수 역량이 되었습니다.
            </FeatureCard>
            <FeatureCard icon="💡" title="업무 생산성">
              단순한 자동화가 아니라, 문제 해결과 창의성을 확장하는 도구입니다.
            </FeatureCard>
            <FeatureCard icon="📈" title="불확실한 시장 환경">
              AI를 잘 활용하는 사람과 그렇지 못한 사람의 격차는 급속히 커지고 있습니다.
            </FeatureCard>
            <FeatureCard icon="🌱" title="지속 가능한 자기 성장">
              단기 학습이 아닌, 평생 역량으로 자리잡아야 합니다.
            </FeatureCard>
          </div>
        </section>

        <section className="py-20 px-4 bg-slate-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              개인 AI 리터러시 진단은?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <FeatureCard icon="📊" title="나의 AI 활용 현주소 파악">
                직무와 학습 수준별로 AI 리터러시 수준을 객관적으로 확인합니다.
              </FeatureCard>
              <FeatureCard icon="🧩" title="강점과 취약점 도출">
                내가 잘하는 영역과 보완이 필요한 부분을 명확히 파악합니다.
              </FeatureCard>
              <FeatureCard icon="🗺️" title="개인 성장 로드맵 제안">
                학습 방향과 업무 적용 방법에 대한 맞춤 가이드를 제공합니다.
              </FeatureCard>
              <FeatureCard icon="🏆" title="커리어 경쟁력 강화">
                AI를 내 업무와 경력 설계에 자연스럽게 녹여내는 전략을 확보합니다.
              </FeatureCard>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 max-w-3xl mx-auto leading-relaxed">
            AI 리터러시는 선택이 아니라, 내 커리어의 생존 전략입니다.<br/>지금, 나의 역량을 확인하고 성장의 길을 설계하세요.
          </h3>
        </section>
        
        <footer className="text-center py-8 border-t border-slate-800">
            <p className="text-slate-500">© 2025 AI Transformation Academy. All Rights Reserved</p>
        </footer>

      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out; opacity: 0; animation-fill-mode: forwards; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; opacity: 0; animation-fill-mode: forwards; }
        
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-600 { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
};