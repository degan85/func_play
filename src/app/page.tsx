'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { 
  Brain, 
  Code2, 
  Zap, 
  Target, 
  Trophy, 
  ChevronRight,
  Sparkles,
  Globe,
  ArrowRight,
  BarChart3
} from 'lucide-react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'lisp'>('javascript');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">FuncPlay</h1>
            </div>
            
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={session.user?.image || '/default-avatar.png'}
                    alt={session.user?.name || 'User'}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Level {session.user?.level || 1} • {session.user?.totalXP || 0} XP
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  size="sm"
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <Button onClick={() => signIn('google')}>
                <Globe className="w-4 h-4 mr-2" />
                Google로 시작하기
              </Button>
            )}
          </div>
        </div>
      </header>

      {session ? (
        // Authenticated Dashboard
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              안녕하세요, {session.user?.name?.split(' ')[0]}님! 👋
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              AI가 당신의 실력에 맞는 함수형 프로그래밍 문제를 생성합니다. 
              JavaScript와 Lisp으로 개발자로서 한 단계 성장해보세요!
            </p>
          </div>

          {/* Language Selection */}
          <div className="max-w-2xl mx-auto mb-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              학습할 언어를 선택하세요
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedLanguage('javascript')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedLanguage === 'javascript'
                    ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <Code2 className={`w-8 h-8 mx-auto mb-3 ${
                  selectedLanguage === 'javascript' ? 'text-yellow-600' : 'text-gray-500'
                }`} />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">JavaScript</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  모던 웹 개발의 핵심 언어로 함수형 패러다임을 학습
                </p>
              </button>
              
              <button
                onClick={() => setSelectedLanguage('lisp')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedLanguage === 'lisp'
                    ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <Brain className={`w-8 h-8 mx-auto mb-3 ${
                  selectedLanguage === 'lisp' ? 'text-purple-600' : 'text-gray-500'
                }`} />
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Lisp</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  함수형 프로그래밍의 원형으로 깊이 있는 사고력 개발
                </p>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/generate">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto">
                <Sparkles className="w-5 h-5 mr-2" />
                AI 문제 생성하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <BarChart3 className="w-5 h-5 mr-2" />
                내 대시보드
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-8 h-8 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">현재 레벨</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {session.user?.level || 1}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                다음 레벨까지 {Math.max(0, ((session.user?.level || 1) * 1000) - (session.user?.totalXP || 0))} XP
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-8 h-8 text-yellow-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">총 경험치</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {session.user?.totalXP || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                지금까지 획득한 총 XP
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-8 h-8 text-purple-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">선호 언어</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {session.user?.preferredLang || 'JavaScript'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                현재 설정된 기본 언어
              </p>
            </div>
          </div>
        </main>
      ) : (
        // Landing Page for Non-authenticated Users
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="py-20 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              AI가 만드는 <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                맞춤형 문제
              </span>로<br />
              함수형 프로그래밍을 마스터하세요
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              당신의 실력과 관심사에 맞는 JavaScript와 Lisp 문제를 AI가 실시간으로 생성합니다. 
              개인화된 학습 경로로 개발자로서 한 단계 성장해보세요.
            </p>
            <Button 
              onClick={() => signIn('google')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Globe className="w-5 h-5 mr-2" />
              Google로 무료 시작하기
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="py-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              왜 FuncPlay인가요?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  AI 맞춤형 문제 생성
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  당신의 실력 수준과 관심 분야를 분석해 최적화된 함수형 프로그래밍 문제를 실시간으로 생성합니다.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-full w-16 h-16 mx-auto mb-6">
                  <Code2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  JavaScript & Lisp 듀얼 지원
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  실용적인 JavaScript부터 함수형 패러다임의 원형인 Lisp까지, 두 언어로 깊이 있는 학습이 가능합니다.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-full w-16 h-16 mx-auto mb-6">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  성장 추적 & 게임화
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  레벨, XP, 업적 시스템으로 학습 동기를 유지하고, 데이터 기반으로 성장을 추적합니다.
                </p>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}