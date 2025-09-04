'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  Brain, 
  Code2, 
  Sparkles, 
  ArrowLeft, 
  Loader2,
  Target
} from 'lucide-react';

interface GeneratedProblem {
  id: string;
  title: string;
  description: string;
  explanation: string;
  difficulty: number;
  concepts: string[];
  language: string;
  initialCode: string;
  testCases: Array<{
    input: unknown[];
    expected: unknown;
    description: string;
  }>;
  hints: string[];
}

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [selectedLanguage, setSelectedLanguage] = useState<'JAVASCRIPT' | 'LISP'>('JAVASCRIPT');
  const [difficulty, setDifficulty] = useState(5);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>(['재귀']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProblem, setGeneratedProblem] = useState<GeneratedProblem | null>(null);
  const [error, setError] = useState<string>('');

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push('/');
    return null;
  }

  const availableConcepts = {
    JAVASCRIPT: [
      '재귀', '고차함수', '클로저', '배열메서드', '비동기처리', 
      '함수합성', '불변성', '순수함수', '커링', '메모이제이션'
    ],
    LISP: [
      '재귀', '리스트처리', 'cons/car/cdr', '고차함수', '람다',
      '꼬리재귀', '패턴매칭', '매크로', 'let바인딩', '함수형루프'
    ]
  };

  const handleConceptToggle = (concept: string) => {
    setSelectedConcepts(prev => 
      prev.includes(concept) 
        ? prev.filter(c => c !== concept)
        : [...prev, concept]
    );
  };

  const generateProblem = async () => {
    if (selectedConcepts.length === 0) {
      setError('최소 한 개의 개념을 선택해주세요.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedProblem(null);

    try {
      const response = await fetch('/api/problems/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: selectedLanguage,
          difficulty: difficulty,
          concepts: selectedConcepts,
          userLevel: session.user?.level || 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '문제 생성에 실패했습니다.');
      }

      setGeneratedProblem(data.problem);
    } catch (error) {
      console.error('문제 생성 에러:', error);
      setError(error instanceof Error ? error.message : '문제 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyText = (level: number) => {
    if (level <= 3) return '초급';
    if (level <= 6) return '중급';
    if (level <= 8) return '고급';
    return '전문가';
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 3) return 'text-green-600 bg-green-100';
    if (level <= 6) return 'text-yellow-600 bg-yellow-100';
    if (level <= 8) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  홈으로
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI 문제 생성</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Level {session.user?.level || 1} • {session.user?.totalXP || 0} XP
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!generatedProblem ? (
          // Problem Generation Form
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                나만의 맞춤형 문제 생성하기
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                AI가 당신의 실력과 관심사에 맞는 함수형 프로그래밍 문제를 생성합니다
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg space-y-8">
              {/* Language Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">언어 선택</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setSelectedLanguage('JAVASCRIPT')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedLanguage === 'JAVASCRIPT'
                        ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Code2 className={`w-8 h-8 mx-auto mb-3 ${
                      selectedLanguage === 'JAVASCRIPT' ? 'text-yellow-600' : 'text-gray-500'
                    }`} />
                    <h4 className="font-semibold text-gray-900 dark:text-white">JavaScript</h4>
                  </button>
                  
                  <button
                    onClick={() => setSelectedLanguage('LISP')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedLanguage === 'LISP'
                        ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Brain className={`w-8 h-8 mx-auto mb-3 ${
                      selectedLanguage === 'LISP' ? 'text-purple-600' : 'text-gray-500'
                    }`} />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Lisp</h4>
                  </button>
                </div>
              </div>

              {/* Difficulty Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">난이도 설정</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">쉬움</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
                      {getDifficultyText(difficulty)} (레벨 {difficulty})
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">어려움</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={difficulty}
                    onChange={(e) => setDifficulty(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Concept Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  학습할 개념 선택 ({selectedConcepts.length}개 선택됨)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableConcepts[selectedLanguage].map((concept) => (
                    <button
                      key={concept}
                      onClick={() => handleConceptToggle(concept)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedConcepts.includes(concept)
                          ? 'border-purple-400 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                      }`}
                    >
                      {concept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={generateProblem}
                  disabled={isGenerating || selectedConcepts.length === 0}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      AI가 문제를 생성하고 있습니다...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      문제 생성하기
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Generated Problem Display
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                생성된 문제
              </h2>
              <Button
                onClick={() => setGeneratedProblem(null)}
                variant="outline"
              >
                다시 생성하기
              </Button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(generatedProblem.difficulty)}`}>
                  {getDifficultyText(generatedProblem.difficulty)}
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {generatedProblem.language}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {generatedProblem.title}
              </h3>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {generatedProblem.description}
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">개념 설명</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {generatedProblem.explanation}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">핵심 개념</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedProblem.concepts.map((concept, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-sm rounded-full"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Link href={`/solve/${generatedProblem.id}`}>
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
                    <Target className="w-5 h-5 mr-2" />
                    문제 풀기
                  </Button>
                </Link>
                <Button variant="outline" onClick={generateProblem} disabled={isGenerating}>
                  <Sparkles className="w-5 h-5 mr-2" />
                  새 문제 생성
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}