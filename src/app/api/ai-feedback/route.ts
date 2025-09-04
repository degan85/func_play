import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// Response schema for structured AI feedback
const feedbackSchema = z.object({
  overall_assessment: z.string().describe('Overall assessment of the code quality and correctness'),
  functional_correctness: z.object({
    score: z.number().min(0).max(100).describe('Score out of 100 for functional correctness'),
    feedback: z.string().describe('Specific feedback about whether the code works as expected')
  }),
  code_quality: z.object({
    score: z.number().min(0).max(100).describe('Score out of 100 for code quality'),
    feedback: z.string().describe('Feedback on code style, readability, and best practices')
  }),
  functional_programming: z.object({
    score: z.number().min(0).max(100).describe('Score out of 100 for functional programming principles'),
    feedback: z.string().describe('Assessment of how well the code follows functional programming principles')
  }),
  suggestions: z.array(z.string()).describe('Specific actionable suggestions for improvement'),
  encouragement: z.string().describe('Encouraging message to motivate the learner'),
  next_steps: z.array(z.string()).describe('Suggested next steps or concepts to explore')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, problemTitle, problemDescription, expectedSolution } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    if (!code || !problemTitle) {
      return NextResponse.json(
        { error: 'Code and problem title are required' },
        { status: 400 }
      );
    }

    const prompt = `
당신은 SICP(컴퓨터 프로그램의 구조와 해석)를 가르치는 친절하고 전문적인 함수형 프로그래밍 튜터입니다.

문제: ${problemTitle}
설명: ${problemDescription}

학생이 작성한 코드:
\`\`\`javascript
${code}
\`\`\`

${expectedSolution ? `참고 해법:\n\`\`\`javascript\n${expectedSolution}\n\`\`\`\n` : ''}

다음 관점에서 코드를 평가하고 피드백을 제공해주세요:

1. **기능적 정확성**: 코드가 요구사항을 올바르게 구현하는가?
2. **코드 품질**: 가독성, 명명, 구조가 좋은가?
3. **함수형 프로그래밍**: 함수형 프로그래밍 원칙을 잘 따르는가?

피드백은 건설적이고 격려적이며, 학습에 도움이 되도록 작성해주세요.
한국어로 답변하고, 초보자도 이해할 수 있는 용어를 사용해주세요.
`;

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: feedbackSchema,
      prompt,
      temperature: 0.7,
    });

    return NextResponse.json({ feedback: object });

  } catch (error) {
    console.error('AI feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI feedback' },
      { status: 500 }
    );
  }
}