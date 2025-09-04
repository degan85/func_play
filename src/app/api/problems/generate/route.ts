import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ProblemGenerationRequest {
  language: 'JAVASCRIPT' | 'LISP';
  difficulty: number; // 1-10
  concepts: string[];
  userLevel: number;
  previousProblems?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ProblemGenerationRequest = await req.json();
    const { language, difficulty, concepts, userLevel, previousProblems = [] } = body;

    // Validate input
    if (!language || !difficulty || !concepts?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate problem using OpenAI
    const prompt = createProblemPrompt(language, difficulty, concepts, userLevel, previousProblems);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `당신은 함수형 프로그래밍 교육 전문가입니다. 사용자의 실력과 관심사에 맞는 프로그래밍 문제를 생성해주세요. 
          반드시 JSON 형식으로 응답하고, 다음 구조를 따라주세요:
          {
            "title": "문제 제목",
            "description": "문제 설명 (한국어)",
            "explanation": "개념 설명 (한국어)",
            "initialCode": "초기 코드 템플릿",
            "solution": "모범 답안",
            "testCases": [{"input": [], "expected": "결과", "description": "설명"}],
            "hints": ["힌트1", "힌트2", "힌트3"],
            "concepts": ["개념1", "개념2"]
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('AI 응답을 받을 수 없습니다.');
    }

    // Parse AI response
    let problemData;
    try {
      problemData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('AI 응답 파싱 실패:', aiResponse, parseError);
      throw new Error('AI 응답 형식이 올바르지 않습니다.');
    }

    // Save to database
    const problem = await prisma.problem.create({
      data: {
        userId: session.user.id,
        title: problemData.title,
        description: problemData.description,
        explanation: problemData.explanation || '',
        difficulty: difficulty,
        concepts: problemData.concepts || concepts,
        language: language,
        skillLevel: mapDifficultyToSkillLevel(difficulty),
        initialCode: problemData.initialCode,
        solution: problemData.solution,
        testCases: problemData.testCases || [],
        hints: problemData.hints || [],
        aiGenerated: true,
        prompt: prompt,
      },
    });

    return NextResponse.json({
      success: true,
      problem: {
        id: problem.id,
        title: problem.title,
        description: problem.description,
        explanation: problem.explanation,
        difficulty: problem.difficulty,
        concepts: problem.concepts,
        language: problem.language,
        initialCode: problem.initialCode,
        testCases: problem.testCases,
        hints: problem.hints,
      }
    });

  } catch (error) {
    console.error('문제 생성 에러:', error);
    return NextResponse.json(
      { 
        error: 'AI 문제 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}

function createProblemPrompt(
  language: string,
  difficulty: number,
  concepts: string[],
  userLevel: number,
  previousProblems: string[]
): string {
  const languageName = language === 'JAVASCRIPT' ? 'JavaScript' : 'Lisp (Scheme)';
  const difficultyText = difficulty <= 3 ? '초급' : difficulty <= 6 ? '중급' : '고급';
  const conceptsText = concepts.join(', ');
  
  return `
${languageName}로 함수형 프로그래밍 문제를 생성해주세요.

요구사항:
- 난이도: ${difficultyText} (1-10 중 ${difficulty})
- 사용자 레벨: ${userLevel}
- 학습할 개념: ${conceptsText}
- 언어: ${languageName}

${previousProblems.length > 0 ? `이전에 푼 문제들과 중복되지 않도록 해주세요: ${previousProblems.join(', ')}` : ''}

${language === 'JAVASCRIPT' ? `
JavaScript의 함수형 프로그래밍 특성을 활용한 문제를 만들어주세요:
- 고차 함수 (map, filter, reduce 등)
- 순수 함수와 불변성
- 클로저와 스코프
- 재귀 함수
- 함수 합성

예시 코드는 현대적인 JavaScript (ES6+)를 사용해주세요.
` : `
Lisp (Scheme)의 함수형 프로그래밍 특성을 활용한 문제를 만들어주세요:
- 리스트 처리 (car, cdr, cons)
- 재귀와 꼬리 재귀
- 고차 함수
- 람다 표현식
- 매크로 (고급 단계에서)

코드는 Scheme 문법을 사용해주세요.
`}

문제는 실용적이고 흥미로우며, 함수형 프로그래밍의 핵심 개념을 잘 보여주는 것으로 만들어주세요.
테스트 케이스는 다양한 시나리오를 포함하여 최소 3개 이상 제공해주세요.
  `.trim();
}

function mapDifficultyToSkillLevel(difficulty: number): 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' {
  if (difficulty <= 2) return 'BEGINNER';
  if (difficulty <= 5) return 'INTERMEDIATE';
  if (difficulty <= 8) return 'ADVANCED';
  return 'EXPERT';
}