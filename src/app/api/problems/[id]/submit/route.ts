import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Language } from '@prisma/client';

interface SubmissionRequest {
  code: string;
  language: Language;
  testResults?: Record<string, unknown>;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const problemId = resolvedParams.id;
    const body: SubmissionRequest = await req.json();
    const { code, language, testResults } = body;

    // 문제 존재 확인
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: { id: true, difficulty: true }
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // XP 계산 (난이도 기반)
    const baseXP = problem.difficulty * 50;
    const bonusXP = Math.floor(Math.random() * 20) + 10; // 10-30 보너스 XP
    const totalXP = baseXP + bonusXP;

    // 제출 기록 저장
    const submission = await prisma.submission.create({
      data: {
        userId: session.user.id,
        problemId: problemId,
        code: code,
        language: language,
        passed: true, // 테스트를 통과했다고 가정
        testResults: testResults ? JSON.parse(JSON.stringify(testResults)) : {},
        xpEarned: totalXP,
        codeLength: code.length,
        submittedAt: new Date(),
      }
    });

    // 사용자 XP 업데이트
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalXP: {
          increment: totalXP
        },
        lastActiveAt: new Date(),
      },
      select: {
        totalXP: true,
        level: true,
      }
    });

    // 레벨 업 체크 (1000 XP당 1레벨)
    const newLevel = Math.floor(user.totalXP / 1000) + 1;
    let leveledUp = false;

    if (newLevel > user.level) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { level: newLevel }
      });
      leveledUp = true;
    }

    // 문제 통계 업데이트
    await prisma.problem.update({
      where: { id: problemId },
      data: {
        attempts: { increment: 1 },
        completions: { increment: 1 },
      }
    });

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        xpEarned: totalXP,
        passed: true,
      },
      user: {
        totalXP: user.totalXP,
        level: newLevel,
        leveledUp,
      }
    });

  } catch (error) {
    console.error('제출 처리 에러:', error);
    return NextResponse.json(
      { error: '제출 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}