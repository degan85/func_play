'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Bot, Sparkles, TrendingUp, CheckCircle, AlertCircle, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';

interface AIFeedbackData {
  overall_assessment: string;
  functional_correctness: {
    score: number;
    feedback: string;
  };
  code_quality: {
    score: number;
    feedback: string;
  };
  functional_programming: {
    score: number;
    feedback: string;
  };
  suggestions: string[];
  encouragement: string;
  next_steps: string[];
}

interface AIFeedbackProps {
  code: string;
  problemTitle: string;
  problemDescription: string;
  expectedSolution?: string;
}

export default function AIFeedback({ code, problemTitle, problemDescription, expectedSolution }: AIFeedbackProps) {
  const [feedback, setFeedback] = useState<AIFeedbackData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFeedback = async () => {
    if (!code.trim()) {
      setError('코드를 작성한 후 AI 피드백을 요청해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          problemTitle,
          problemDescription,
          expectedSolution
        })
      });

      if (!response.ok) {
        throw new Error('AI 피드백을 가져오는데 실패했습니다.');
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 피드백을 가져오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4" />;
    if (score >= 60) return <AlertCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Bot className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI 튜터</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">코드 분석 및 개인 맞춤 피드백</p>
          </div>
        </div>
        
        {!feedback && (
          <Button
            onClick={getFeedback}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                분석 중...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                AI 피드백 받기
              </>
            )}
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {feedback && (
        <div className="space-y-6">
          {/* Overall Assessment */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900 dark:text-white">전체 평가</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {feedback.overall_assessment}
            </p>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Functional Correctness */}
            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">기능 정확성</span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(feedback.functional_correctness.score)}`}>
                  {getScoreIcon(feedback.functional_correctness.score)}
                  {feedback.functional_correctness.score}점
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {feedback.functional_correctness.feedback}
              </p>
            </div>

            {/* Code Quality */}
            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">코드 품질</span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(feedback.code_quality.score)}`}>
                  {getScoreIcon(feedback.code_quality.score)}
                  {feedback.code_quality.score}점
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {feedback.code_quality.feedback}
              </p>
            </div>

            {/* Functional Programming */}
            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">함수형 프로그래밍</span>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(feedback.functional_programming.score)}`}>
                  {getScoreIcon(feedback.functional_programming.score)}
                  {feedback.functional_programming.score}점
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {feedback.functional_programming.feedback}
              </p>
            </div>
          </div>

          {/* Suggestions */}
          {feedback.suggestions.length > 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">개선 제안</h4>
              </div>
              <ul className="space-y-2">
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="flex-shrink-0 w-5 h-5 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Encouragement */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900 dark:text-white">격려의 말</h4>
            </div>
            <p className="text-green-800 dark:text-green-200 leading-relaxed">
              {feedback.encouragement}
            </p>
          </div>

          {/* Next Steps */}
          {feedback.next_steps.length > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">다음 단계</h4>
              </div>
              <ul className="space-y-2">
                {feedback.next_steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <ArrowRight className="flex-shrink-0 w-4 h-4 text-blue-600 mt-0.5" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Get New Feedback */}
          <div className="flex justify-center">
            <Button
              onClick={() => {
                setFeedback(null);
                setError(null);
              }}
              variant="outline"
              className="text-purple-600 border-purple-600 hover:bg-purple-50"
            >
              새로운 피드백 받기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}