import type { AnalysisResult } from './types';

export const SAMPLE_RESULT: AnalysisResult = {
  scores: [
    { category: "AI 기본 이해 (Knowledge)", score: 85 },
    { category: "AI 활용 역량 (Application)", score: 65 },
    { category: "데이터 리터러시 (Data Literacy)", score: 75 },
    { category: "비판적 사고 &\n윤리적 활용 (Critical Thinking & Ethics)", score: 90 },
    { category: "협업 &\n커뮤니케이션 (Collaboration)", score: 70 },
    { category: "학습 &\n성장 마인드셋 (Growth Mindset)", score: 88 },
    { category: "전략적 활용 &\n혁신 (Strategy & Innovation)", score: 60 },
  ],
  analysis: {
    persona: {
      name: "성장 지향 개척자 (Growth-Oriented Pioneer)",
      description: "당신은 AI 기술에 대한 깊은 이해와 윤리 의식을 바탕으로, 새로운 기술을 끊임없이 학습하며 성장을 추구하는 사람입니다. 실무 적용 경험을 보완한다면 AI 시대의 핵심 인재로 거듭날 잠재력이 높습니다."
    },
    strengths: [
      "AI 기술의 윤리적 측면과 비판적 사고 능력이 매우 뛰어납니다. 이는 AI 도입 시 발생할 수 있는 리스크를 사전에 식별하고 건전한 활용 문화를 조성하는 데 크게 기여할 수 있는 핵심 역량입니다.",
      "새로운 기술에 대한 학습 의지가 높아 빠르게 성장할 잠재력을 갖추고 있습니다. 변화에 대한 긍정적인 태도는 조직의 AI 전환에 중요한 동력이 될 것입니다."
    ],
    weaknesses: [
      "AI 기술을 실제 업무에 적용하고 새로운 가치를 창출하는 **전략적 활용 & 혁신** 및 **AI 활용 역량**이 상대적으로 부족합니다. 이는 아이디어를 구체적인 성과로 연결하는 데 어려움을 겪게 할 수 있습니다.",
      "개념적 이해를 넘어, 구체적인 AI 툴을 사용하여 업무 프로세스를 개선하거나 비즈니스 기회를 발굴하는 실질적인 경험을 쌓을 필요가 있습니다."
    ],
    recommendations: [
      "**'노코드 AI 툴 활용 프로젝트' 시작하기:** Google Teachable Machine, Microsoft Power Automate 등 코딩 없이 사용할 수 있는 AI 툴을 활용해 반복적인 개인 업무를 자동화하는 작은 프로젝트를 시작해보세요.",
      "**'사내 AI 활용 사례 스터디' 참여:** 다른 팀의 AI 성공 사례를 학습하고, 우리 팀에 적용할 아이디어를 구체화하는 스터디 그룹에 참여하여 실용적인 지식을 넓혀보세요.",
      "**'AI 비즈니스 모델 관련 아티클/강의' 주 1회 학습:** Harvard Business Review, Coursera 등에서 AI를 활용한 비즈니스 혁신 사례를 학습하며 전략적 사고의 폭을 넓히는 것을 추천합니다."
    ]
  }
};