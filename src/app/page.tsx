'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import AuthButton from '@/components/AuthButton';
import { Play, BookOpen, Trophy, Target, Flame } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Play className="w-6 h-6 text-purple-600" />
            FuncPlay
          </h1>
          <AuthButton />
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            함수형 프로그래밍을
            <br />
            <span className="text-purple-600">재미있게 배우세요</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            SICP(컴퓨터 프로그램의 구조와 해석)를 기반으로 한 인터랙티브 학습 플랫폼
          </p>
          <Button size="lg" className="text-lg px-8 py-3">
            지금 시작하기 🚀
          </Button>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">3일</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">연속 학습중! 🔥</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Chapter 1.2</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">현재 진도 (60%)</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">1,250</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">XP 포인트</p>
          </div>
        </section>

        {/* Today's Challenge */}
        <section className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-8 mb-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8" />
            <h3 className="text-2xl font-bold">오늘의 도전 과제</h3>
          </div>
          <p className="text-lg mb-6 opacity-90">
            재귀를 사용하여 팩토리얼 함수를 구현하고, 꼬리 재귀로 최적화해보세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/learn/1/2">
              <Button variant="secondary" size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                시작하기
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
              예제 보기
            </Button>
          </div>
        </section>

        {/* Learning Path */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            학습 로드맵
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                chapter: 'Chapter 1', 
                title: '프로시저로 추상화하기', 
                status: 'available', 
                progress: 0,
                description: '함수형 프로그래밍의 기초 - 재귀, 반복, 고차 함수',
                problems: 5,
                href: '/learn/1/1'
              },
              { 
                chapter: 'Chapter 2', 
                title: '데이터로 추상화하기', 
                status: 'available', 
                progress: 0,
                description: 'cons, car, cdr을 통한 데이터 구조와 리스트 조작',
                problems: 3,
                href: '/learn/2/1'
              },
              { 
                chapter: 'Chapter 3', 
                title: '모듈화, 객체, 상태', 
                status: 'available', 
                progress: 0,
                description: '클로저와 상태 관리, mutable 데이터 구조',
                problems: 2,
                href: '/learn/3/1'
              }
            ].map((item, index) => (
              <Link key={index} href={item.href}>
                <div
                  className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-xl ${
                    item.status === 'completed' 
                      ? 'border-green-200 hover:border-green-300' 
                      : item.status === 'available' 
                      ? 'border-purple-200 hover:border-purple-300' 
                      : 'border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-purple-600">{item.chapter}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {item.problems} 문제
                      </span>
                      <span className={`text-2xl ${
                        item.status === 'completed' ? '✅' : 
                        item.status === 'available' ? '🚀' : '🔒'
                      }`} />
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.progress}% 완료
                    </p>
                    <div className="text-purple-600 text-sm font-medium">
                      시작하기 →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-6xl mx-auto p-6 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; 2024 FuncPlay. SICP 기반 함수형 프로그래밍 학습 플랫폼</p>
        </div>
      </footer>
    </div>
  );
}