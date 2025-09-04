// 달성과제 시스템 정의

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  criteria: string;
  category: 'learning' | 'streak' | 'completion' | 'mastery' | 'social';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const achievements: Achievement[] = [
  // 학습 시작 달성과제
  {
    id: 'first-visit',
    name: '첫 방문',
    description: 'FuncPlay에 첫 발을 들였습니다!',
    icon: '👋',
    xpReward: 50,
    criteria: 'first_login',
    category: 'learning',
    rarity: 'common'
  },
  {
    id: 'first-code-run',
    name: '첫 코드 실행',
    description: '처음으로 코드를 실행해봤습니다!',
    icon: '▶️',
    xpReward: 100,
    criteria: 'first_code_execution',
    category: 'learning',
    rarity: 'common'
  },
  {
    id: 'first-problem-solved',
    name: '첫 문제 해결',
    description: '첫 번째 문제를 성공적으로 해결했습니다!',
    icon: '🎯',
    xpReward: 200,
    criteria: 'first_problem_completed',
    category: 'learning',
    rarity: 'common'
  },

  // 스트릭 달성과제
  {
    id: 'streak-3',
    name: '3일 연속 학습',
    description: '3일 연속으로 학습했습니다!',
    icon: '🔥',
    xpReward: 150,
    criteria: 'streak:3',
    category: 'streak',
    rarity: 'common'
  },
  {
    id: 'streak-7',
    name: '일주일 달성',
    description: '7일 연속 학습, 대단합니다!',
    icon: '📅',
    xpReward: 300,
    criteria: 'streak:7',
    category: 'streak',
    rarity: 'rare'
  },
  {
    id: 'streak-30',
    name: '한 달 마스터',
    description: '30일 연속 학습, 진정한 헌신!',
    icon: '🏆',
    xpReward: 1000,
    criteria: 'streak:30',
    category: 'streak',
    rarity: 'epic'
  },
  {
    id: 'streak-100',
    name: '백일장 달성',
    description: '100일 연속 학습, 전설적인 노력!',
    icon: '👑',
    xpReward: 5000,
    criteria: 'streak:100',
    category: 'streak',
    rarity: 'legendary'
  },

  // 문제 완료 달성과제
  {
    id: 'chapter-1-complete',
    name: 'Chapter 1 완주',
    description: 'Chapter 1의 모든 문제를 해결했습니다!',
    icon: '📚',
    xpReward: 500,
    criteria: 'chapter_complete:1',
    category: 'completion',
    rarity: 'rare'
  },
  {
    id: 'problems-10',
    name: '문제 해결사',
    description: '총 10개의 문제를 해결했습니다!',
    icon: '🧩',
    xpReward: 400,
    criteria: 'problems_solved:10',
    category: 'completion',
    rarity: 'rare'
  },
  {
    id: 'problems-50',
    name: '문제 마스터',
    description: '총 50개의 문제를 해결했습니다!',
    icon: '🎖️',
    xpReward: 2000,
    criteria: 'problems_solved:50',
    category: 'completion',
    rarity: 'epic'
  },

  // 마스터리 달성과제
  {
    id: 'recursion-master',
    name: '재귀 마스터',
    description: '재귀 관련 모든 문제를 완벽하게 해결했습니다!',
    icon: '♻️',
    xpReward: 800,
    criteria: 'concept_mastery:재귀',
    category: 'mastery',
    rarity: 'epic'
  },
  {
    id: 'functional-guru',
    name: '함수형 구루',
    description: '함수형 프로그래밍 원칙을 완벽히 이해했습니다!',
    icon: '⚡',
    xpReward: 1500,
    criteria: 'concept_mastery:함수형프로그래밍',
    category: 'mastery',
    rarity: 'legendary'
  },

  // AI 및 특별 달성과제
  {
    id: 'ai-feedback-seeker',
    name: 'AI 조언자',
    description: 'AI 피드백을 10번 이상 받았습니다!',
    icon: '🤖',
    xpReward: 300,
    criteria: 'ai_feedback:10',
    category: 'learning',
    rarity: 'rare'
  },
  {
    id: 'perfect-scorer',
    name: '완벽주의자',
    description: 'AI로부터 100점 만점을 받았습니다!',
    icon: '💯',
    xpReward: 500,
    criteria: 'perfect_ai_score',
    category: 'mastery',
    rarity: 'epic'
  },
  {
    id: 'code-optimizer',
    name: '코드 최적화 전문가',
    description: '같은 문제를 3번 이상 개선했습니다!',
    icon: '🔧',
    xpReward: 400,
    criteria: 'problem_attempts:3',
    category: 'mastery',
    rarity: 'rare'
  },

  // XP 달성과제
  {
    id: 'xp-1000',
    name: 'XP 수집가',
    description: '1000 XP를 달성했습니다!',
    icon: '💎',
    xpReward: 200,
    criteria: 'xp_earned:1000',
    category: 'completion',
    rarity: 'rare'
  },
  {
    id: 'xp-5000',
    name: 'XP 마스터',
    description: '5000 XP를 달성했습니다!',
    icon: '💠',
    xpReward: 500,
    criteria: 'xp_earned:5000',
    category: 'completion',
    rarity: 'epic'
  }
];

// 달성과제 체크 함수
export async function checkAchievements(userId: string, eventType: string, eventData?: unknown) {
  // 실제 구현에서는 Prisma를 사용하여 사용자 데이터를 확인하고 달성과제를 부여
  // 여기서는 타입 정의만 제공
  
  const achievementsToGrant: Achievement[] = [];
  
  // 이벤트 타입에 따른 달성과제 체크 로직
  switch (eventType) {
    case 'first_login':
      achievementsToGrant.push(achievements.find(a => a.id === 'first-visit')!);
      break;
    
    case 'first_code_execution':
      achievementsToGrant.push(achievements.find(a => a.id === 'first-code-run')!);
      break;
    
    case 'problem_completed':
      // 첫 문제 해결 체크
      // 문제 개수 달성과제 체크
      // 챕터 완료 체크
      break;
    
    case 'streak_updated':
      // 스트릭 관련 달성과제 체크
      const streakDays = (eventData as { streakDays?: number })?.streakDays || 0;
      const streakAchievements = achievements.filter(a => 
        a.criteria.startsWith('streak:') && 
        parseInt(a.criteria.split(':')[1]) === streakDays
      );
      achievementsToGrant.push(...streakAchievements);
      break;
    
    case 'ai_feedback_received':
      // AI 피드백 관련 달성과제 체크
      break;
    
    case 'xp_updated':
      // XP 관련 달성과제 체크
      break;
  }
  
  return achievementsToGrant.filter(Boolean);
}

// 달성과제 희귀도에 따른 스타일
export function getAchievementStyle(rarity: Achievement['rarity']) {
  switch (rarity) {
    case 'common':
      return {
        border: 'border-gray-300',
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        glow: ''
      };
    case 'rare':
      return {
        border: 'border-blue-300',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        glow: 'shadow-lg shadow-blue-200'
      };
    case 'epic':
      return {
        border: 'border-purple-300',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        glow: 'shadow-lg shadow-purple-200 animate-pulse'
      };
    case 'legendary':
      return {
        border: 'border-yellow-300',
        bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
        text: 'text-yellow-700',
        glow: 'shadow-xl shadow-yellow-200 animate-pulse'
      };
  }
}