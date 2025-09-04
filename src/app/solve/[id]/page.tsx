'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import CodeEditor from '@/components/CodeEditor';
import CodeOutput from '@/components/CodeOutput';
import { executeCode, runTests } from '@/lib/codeExecutor';
import { executeLispCode, runLispTests } from '@/lib/lispExecutor';
import { 
  ArrowLeft, 
  Target, 
  CheckCircle, 
  Lightbulb, 
  Play,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  explanation: string;
  difficulty: number;
  concepts: string[];
  language: 'JAVASCRIPT' | 'LISP';
  skillLevel: string;
  initialCode: string;
  solution?: string;
  testCases: Array<{
    input: unknown[];
    expected: unknown;
    description: string;
  }>;
  hints: string[];
}

export default function SolvePage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const problemId = params.id as string;

  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<Array<{
    type: 'log' | 'error' | 'result' | 'test';
    content: string;
    timestamp: string;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProblem = useCallback(async () => {
    try {
      const response = await fetch(`/api/problems/${problemId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '문제를 불러올 수 없습니다.');
      }

      setProblem(data.problem);
      setCode(data.problem.initialCode);
      setIsCompleted(data.isCompleted || false);
    } catch (error) {
      console.error('문제 로드 에러:', error);
      setError(error instanceof Error ? error.message : '문제를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    fetchProblem();
  }, [fetchProblem]);

  // Redirect if not authenticated
  if (status === 'loading' || loading) {
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

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleRunCode = async (codeToRun: string) => {
    if (!problem) return;
    
    setIsRunning(true);
    setOutput([]);
    
    try {
      let testResults;
      
      if (problem.language === 'JAVASCRIPT') {
        // JavaScript 실행
        const [execResult, testResult] = await Promise.all([
          executeCode(codeToRun),
          problem.testCases.length > 0 ? 
            Promise.resolve(runTests(codeToRun, problem.testCases)) :
            Promise.resolve({ output: [], success: true, executionTime: 0 })
        ]);
        
        const combinedOutput = [
          ...execResult.output,
          ...(testResult.output.length > 0 ? [
            {
              type: 'result' as const,
              content: `\n--- 테스트 결과 ---`,
              timestamp: new Date().toLocaleTimeString()
            },
            ...testResult.output
          ] : [])
        ];
        
        setOutput(combinedOutput);
        testResults = testResult;
      } else {
        // Lisp 실행 (BiwaScheme)
        const [execResult, testResult] = await Promise.all([
          executeLispCode(codeToRun),
          problem.testCases.length > 0 ? 
            runLispTests(codeToRun, problem.testCases) :
            Promise.resolve({ output: [], success: true, executionTime: 0 })
        ]);
        
        const combinedOutput = [
          ...execResult.output,
          ...(testResult.output.length > 0 ? [
            {
              type: 'result' as const,
              content: `\n--- 테스트 결과 ---`,
              timestamp: new Date().toLocaleTimeString()
            },
            ...testResult.output
          ] : [])
        ];
        
        setOutput(combinedOutput);
        testResults = testResult;
      }
      
      // 모든 테스트가 통과했다면 제출
      if (testResults.success && testResults.output.some(o => o.content.includes('✅'))) {
        await submitSolution(codeToRun);
        setIsCompleted(true);
      }
      
    } catch (error) {
      setOutput([{
        type: 'error',
        content: `예상치 못한 오류가 발생했습니다: ${error}`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const submitSolution = async (code: string) => {
    try {
      const response = await fetch(`/api/problems/${problemId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: problem!.language,
        }),
      });

      if (!response.ok) {
        console.error('제출 실패:', await response.text());
      }
    } catch (error) {
      console.error('제출 에러:', error);
    }
  };

  const resetCode = () => {
    if (problem) {
      setCode(problem.initialCode);
      setOutput([]);
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'text-green-600 bg-green-100';
    if (difficulty <= 6) return 'text-yellow-600 bg-yellow-100';
    if (difficulty <= 8) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <Link href="/generate">
            <Button>새 문제 생성하기</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/generate">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  뒤로
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2 text-sm text-purple-600 mb-1">
                  <Sparkles className="w-4 h-4" />
                  AI 생성 문제
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {problem.title}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                레벨 {problem.difficulty}
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {problem.language}
              </div>
              {isCompleted && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">완료</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 문제 설명 */}
          <div className="space-y-6">
            {/* 문제 설명 */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">문제 설명</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {problem.description}
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">개념 설명</h3>
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {problem.explanation}
                </div>
              </div>
            </section>

            {/* 힌트 */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <Button
                variant="outline"
                onClick={() => setShowHints(!showHints)}
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  힌트 보기 ({problem.hints.length}개)
                </div>
                {showHints ? '▲' : '▼'}
              </Button>
              
              {showHints && (
                <div className="mt-4 space-y-2">
                  {problem.hints.map((hint, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">{hint}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 해답 (완료 후에만 표시) */}
            {isCompleted && problem.solution && (
              <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <Button
                  variant="outline"
                  onClick={() => setShowSolution(!showSolution)}
                  className="w-full justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    해답 보기
                  </div>
                  {showSolution ? '▲' : '▼'}
                </Button>
                
                {showSolution && (
                  <div className="mt-4">
                    <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{problem.solution}</code>
                    </pre>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* 오른쪽: 코드 에디터와 출력 */}
          <div className="space-y-6">
            {/* 코드 에디터 */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <CodeEditor
                initialCode={code}
                language={problem.language === 'JAVASCRIPT' ? 'javascript' : 'scheme'}
                onChange={handleCodeChange}
                onRun={handleRunCode}
              />
              
              <div className="flex gap-2 mt-4">
                <Button onClick={() => handleRunCode(code)} className="flex-1" disabled={isRunning}>
                  <Play className="w-4 h-4 mr-2" />
                  {isRunning ? '실행 중...' : '코드 실행'}
                </Button>
                <Button variant="outline" onClick={resetCode}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
              </div>
            </section>

            {/* 출력 결과 */}
            <section>
              <CodeOutput output={output} isRunning={isRunning} />
            </section>

            {/* 개념 태그 */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">핵심 개념</h3>
              <div className="flex flex-wrap gap-2">
                {problem.concepts.map((concept, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-sm rounded-full"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}