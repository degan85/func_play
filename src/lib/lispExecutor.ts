// Lisp (Scheme) 코드 실행을 위한 BiwaScheme 인터프리터 래퍼

// BiwaScheme 타입 정의
declare global {
  interface Window {
    BiwaScheme?: {
      Interpreter: new () => BiwaSchemeInterpreter;
      TopEnv: unknown;
      nil: unknown;
      undef: unknown;
    };
  }
}

interface BiwaSchemeInterpreter {
  evaluate(code: string, callback?: (result: unknown) => void): unknown;
  define_libfunc(name: string, expectedArgs: number, func: (...args: unknown[]) => unknown): void;
}

interface LispExecutionResult {
  output: Array<{
    type: 'log' | 'error' | 'result' | 'test';
    content: string;
    timestamp: string;
  }>;
  success: boolean;
  executionTime: number;
}

class LispCodeExecutor {
  private interpreter: BiwaSchemeInterpreter | null = null;
  private isInitialized = false;
  private outputBuffer: string[] = [];

  constructor() {
    this.initializeInterpreter();
  }

  private async initializeInterpreter(): Promise<void> {
    if (typeof window === 'undefined') {
      // 서버 사이드에서는 실행하지 않음
      return;
    }

    try {
      // BiwaScheme 로드
      if (!window.BiwaScheme) {
        await this.loadBiwaScheme();
      }

      if (window.BiwaScheme) {
        this.interpreter = new window.BiwaScheme.Interpreter();
        this.setupCustomFunctions();
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('BiwaScheme 초기화 실패:', error);
    }
  }

  private async loadBiwaScheme(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('biwascheme-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'biwascheme-script';
      script.src = 'https://unpkg.com/biwascheme@0.8.0/release/biwascheme.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('BiwaScheme 로드 실패'));
      document.head.appendChild(script);
    });
  }

  private setupCustomFunctions(): void {
    if (!this.interpreter || !window.BiwaScheme) return;

    const biwa = window.BiwaScheme;

    // console.log 함수 정의
    this.interpreter.define_libfunc('display', 1, (arg: unknown) => {
      const output = this.schemeValueToString(arg);
      this.outputBuffer.push(output);
      return biwa.undef;
    });

    // newline 함수 정의
    this.interpreter.define_libfunc('newline', 0, () => {
      this.outputBuffer.push('\n');
      return biwa.undef;
    });

    // 기본 수학 함수들이 이미 정의되어 있음
    // +, -, *, /, =, <, >, <=, >= 등
    
    // 리스트 함수들도 이미 정의되어 있음
    // cons, car, cdr, null?, pair?, list, length 등
  }

  private schemeValueToString(value: unknown): string {
    if (value === null || value === undefined) return 'nil';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? '#t' : '#f';
    if (Array.isArray(value)) {
      return `(${value.map(v => this.schemeValueToString(v)).join(' ')})`;
    }
    return value.toString();
  }

  async executeCode(code: string): Promise<LispExecutionResult> {
    const startTime = Date.now();
    this.outputBuffer = [];

    if (!this.isInitialized || !this.interpreter) {
      await this.initializeInterpreter();
      if (!this.isInitialized || !this.interpreter) {
        return {
          output: [{
            type: 'error',
            content: 'Lisp 인터프리터를 초기화할 수 없습니다. BiwaScheme이 로드되지 않았거나 브라우저 환경이 아닙니다.',
            timestamp: new Date().toLocaleTimeString()
          }],
          success: false,
          executionTime: Date.now() - startTime
        };
      }
    }

    try {
      // 코드를 여러 표현식으로 분할하여 실행
      const expressions = this.parseSchemeExpressions(code);
      const results: unknown[] = [];

      for (const expr of expressions) {
        if (expr.trim()) {
          const result = this.interpreter!.evaluate(expr);
          if (result !== null && result !== undefined) {
            results.push(result);
          }
        }
      }

      const output = [];

      // 출력 버퍼 내용 추가
      if (this.outputBuffer.length > 0) {
        output.push({
          type: 'log' as const,
          content: this.outputBuffer.join(''),
          timestamp: new Date().toLocaleTimeString()
        });
      }

      // 마지막 결과 표시
      if (results.length > 0) {
        const lastResult = results[results.length - 1];
        if (window.BiwaScheme && lastResult !== window.BiwaScheme.undef) {
          output.push({
            type: 'result' as const,
            content: this.schemeValueToString(lastResult),
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }

      return {
        output,
        success: true,
        executionTime: Date.now() - startTime
      };

    } catch (error: unknown) {
      return {
        output: [{
          type: 'error',
          content: `실행 오류: ${error instanceof Error ? error.message : String(error)}`,
          timestamp: new Date().toLocaleTimeString()
        }],
        success: false,
        executionTime: Date.now() - startTime
      };
    }
  }

  private parseSchemeExpressions(code: string): string[] {
    // 간단한 S-표현식 파서
    const expressions: string[] = [];
    let current = '';
    let parenCount = 0;
    let inString = false;
    let escaped = false;

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      
      if (escaped) {
        current += char;
        escaped = false;
        continue;
      }

      if (char === '\\' && inString) {
        escaped = true;
        current += char;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        current += char;
        continue;
      }

      if (!inString) {
        if (char === '(') {
          parenCount++;
        } else if (char === ')') {
          parenCount--;
        }
      }

      current += char;

      // 완전한 표현식이 완성되면 추가
      if (!inString && parenCount === 0 && current.trim()) {
        expressions.push(current.trim());
        current = '';
      }
    }

    // 남은 코드가 있으면 추가
    if (current.trim()) {
      expressions.push(current.trim());
    }

    return expressions;
  }

  async runTests(code: string, testCases: Array<{
    input: unknown[];
    expected: unknown;
    description: string;
  }>): Promise<LispExecutionResult> {
    const startTime = Date.now();
    const output = [];
    let allPassed = true;

    try {
      // 먼저 코드를 실행하여 함수들을 정의
      await this.executeCode(code);

      for (const testCase of testCases) {
        try {
          const { input, expected, description } = testCase;
          
          // 테스트 케이스 실행을 위한 코드 생성
          let testCode;
          if (input && input.length > 0) {
            testCode = `(${input.join(' ')})`;
          } else {
            // 입력이 없는 경우, 테스트 케이스에서 직접 함수 호출
            testCode = description.includes('(') ? description : `(${description})`;
          }

          const result = this.interpreter!.evaluate(testCode);
          const resultStr = this.schemeValueToString(result);
          const expectedStr = this.schemeValueToString(expected);

          const passed = this.compareValues(result, expected);
          
          output.push({
            type: 'test' as const,
            content: `${passed ? '✅' : '❌'} ${description}: ${resultStr} ${passed ? '==' : '!='} ${expectedStr}`,
            timestamp: new Date().toLocaleTimeString()
          });

          if (!passed) allPassed = false;

        } catch (error: unknown) {
          output.push({
            type: 'test' as const,
            content: `❌ ${testCase.description}: 실행 오류 - ${error instanceof Error ? error.message : String(error)}`,
            timestamp: new Date().toLocaleTimeString()
          });
          allPassed = false;
        }
      }

      return {
        output,
        success: allPassed,
        executionTime: Date.now() - startTime
      };

    } catch (error: unknown) {
      return {
        output: [{
          type: 'error',
          content: `테스트 실행 오류: ${error instanceof Error ? error.message : String(error)}`,
          timestamp: new Date().toLocaleTimeString()
        }],
        success: false,
        executionTime: Date.now() - startTime
      };
    }
  }

  private compareValues(actual: unknown, expected: unknown): boolean {
    // 타입이 다르면 false
    if (typeof actual !== typeof expected) return false;
    
    // 기본 타입 비교
    if (typeof actual !== 'object') {
      return actual === expected;
    }

    // 배열/리스트 비교
    if (Array.isArray(actual) && Array.isArray(expected)) {
      if (actual.length !== expected.length) return false;
      for (let i = 0; i < actual.length; i++) {
        if (!this.compareValues(actual[i], expected[i])) return false;
      }
      return true;
    }

    // 객체 비교
    if (actual === null || expected === null) {
      return actual === expected;
    }

    return JSON.stringify(actual) === JSON.stringify(expected);
  }
}

// 전역 인스턴스
let lispExecutor: LispCodeExecutor | null = null;

export function getLispExecutor(): LispCodeExecutor {
  if (!lispExecutor) {
    lispExecutor = new LispCodeExecutor();
  }
  return lispExecutor;
}

export async function executeLispCode(code: string): Promise<LispExecutionResult> {
  const executor = getLispExecutor();
  return executor.executeCode(code);
}

export async function runLispTests(code: string, testCases: Array<{
  input: unknown[];
  expected: unknown;
  description: string;
}>): Promise<LispExecutionResult> {
  const executor = getLispExecutor();
  return executor.runTests(code, testCases);
}