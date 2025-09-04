import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
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

    // 문제 조회
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      select: {
        id: true,
        title: true,
        description: true,
        explanation: true,
        difficulty: true,
        concepts: true,
        language: true,
        skillLevel: true,
        initialCode: true,
        solution: true,
        testCases: true,
        hints: true,
        createdAt: true,
      }
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    // 사용자의 제출 이력 확인
    const submission = await prisma.submission.findFirst({
      where: {
        userId: session.user.id,
        problemId: problemId,
        passed: true,
      },
      orderBy: {
        submittedAt: 'desc',
      }
    });

    const isCompleted = !!submission;

    return NextResponse.json({
      problem: {
        ...problem,
        // 완료하지 않은 경우 solution 숨기기
        solution: isCompleted ? problem.solution : undefined,
      },
      isCompleted,
    });

  } catch (error) {
    console.error('문제 조회 에러:', error);
    return NextResponse.json(
      { error: '문제를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}