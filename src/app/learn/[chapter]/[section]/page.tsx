'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import CodeEditor from '@/components/CodeEditor';
import CodeOutput from '@/components/CodeOutput';
import AIFeedback from '@/components/AIFeedback';
import { executeCode, runTests } from '@/lib/codeExecutor';
import { 
  getProblemById, 
  updateProgress, 
  getProgressForProblem,
  getNextProblem,
  getPreviousProblem,
  getProblemPosition 
} from '@/lib/problems';
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  CheckCircle, 
  Lightbulb, 
  Play,
  Trophy,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ProblemPage() {
  const params = useParams();
  
  // URL에서 chapter, section 파라미터 추출
  const chapter = parseInt(params.chapter as string);
  const section = parseInt(params.section as string);
  
  // 임시로 첫 번째 문제를 로드 (실제로는 section에 따라 다른 문제를 로드해야 함)
  const problemId = `${chapter}-${section}-1`;
  const problem = getProblemById(problemId);
  
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<Array<{
    type: 'log' | 'error' | 'result' | 'test';
    content: string;
    timestamp: string;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [progress, setProgress] = useState<ReturnType<typeof getProgressForProblem>>();
  
  // Navigation state
  const nextProblem = problem ? getNextProblem(problem.id) : null;
  const previousProblem = problem ? getPreviousProblem(problem.id) : null;
  const position = problem ? getProblemPosition(problem.id) : { current: 0, total: 0 };

  useEffect(() => {
    if (problem) {
      // 저장된 코드나 초기 코드 로드
      const savedProgress = getProgressForProblem(problem.id);
      setProgress(savedProgress);
      setCode(savedProgress?.bestCode || problem.initialCode);
    }
  }, [problem]);

  if (!problem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            문제를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            요청한 문제가 존재하지 않거나 아직 준비되지 않았습니다.
          </p>
          <Link href="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleRunCode = async (codeToRun: string) => {
    setIsRunning(true);
    setOutput([]);
    
    try {
      // 일반 실행과 테스트 모두 실행
      const [execResult, testResult] = await Promise.all([
        executeCode(codeToRun),
        problem.testCases.length > 0 ? 
          Promise.resolve(runTests(codeToRun, problem.testCases)) :
          Promise.resolve({ output: [], success: true, executionTime: 0 })
      ]);
      
      // 결과 합치기
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
      
      // 모든 테스트가 통과했다면 진도 업데이트
      if (testResult.success && testResult.output.some(o => o.content.includes('✅'))) {
        updateProgress(problem.id, true, codeToRun);
        setProgress(getProgressForProblem(problem.id));
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

  const resetCode = () => {
    setCode(problem.initialCode);
    setOutput([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  홈으로
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2 text-sm text-purple-600 mb-1">
                  <BookOpen className="w-4 h-4" />
                  Chapter {problem.chapter}.{problem.section}
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {problem.title}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </div>
              {progress?.completed && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">완료</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-purple-600">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">{problem.xpReward} XP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {previousProblem ? (
                <Link href={`/learn/${previousProblem.chapter}/${previousProblem.section}`}>
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    이전 문제
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  이전 문제
                </Button>
              )}
              
              <div className="text-sm text-gray-600 dark:text-gray-300">
                문제 {position.current} / {position.total}
              </div>
            </div>
            
            {nextProblem ? (
              <Link href={`/learn/${nextProblem.chapter}/${nextProblem.section}`}>
                <Button size="sm">
                  다음 문제
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button size="sm" disabled>
                다음 문제
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

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
                  힌트 보기
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
            {progress?.completed && (
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
                
                {showSolution && problem.solution && (
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
                language="javascript"
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

            {/* AI 피드백 */}
            <section>
              <AIFeedback
                code={code}
                problemTitle={problem.title}
                problemDescription={problem.description}
                expectedSolution={problem.solution}
              />
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