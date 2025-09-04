// 안전한 JavaScript 코드 실행을 위한 유틸리티

interface ExecutionResult {
  output: Array<{
    type: 'log' | 'error' | 'result' | 'test';
    content: string;
    timestamp: string;
  }>;
  success: boolean;
  executionTime: number;
}

// 위험한 코드 패턴 감지
const DANGEROUS_PATTERNS = [
  /eval\s*\(/,
  /Function\s*\(/,
  /import\s*\(/,
  /require\s*\(/,
  /process\./,
  /global\./,
  /window\./,
  /document\./,
  /fetch\s*\(/,
  /XMLHttpRequest/,
  /while\s*\(.*true.*\)/,
  /for\s*\(.*;;.*\)/,
];

// 실행 시간 제한 (밀리초)
const EXECUTION_TIMEOUT = 5000;

export function validateCode(code: string): { isValid: boolean; reason?: string } {
  // 위험한 패턴 검사
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      return {
        isValid: false,
        reason: `보안상 안전하지 않은 코드가 포함되어 있습니다: ${pattern.source}`
      };
    }
  }

  return { isValid: true };
}

export async function executeCode(code: string): Promise<ExecutionResult> {
  const startTime = Date.now();
  const output: ExecutionResult['output'] = [];
  
  // 코드 검증
  const validation = validateCode(code);
  if (!validation.isValid) {
    return {
      output: [{
        type: 'error',
        content: `실행 불가: ${validation.reason}`,
        timestamp: new Date().toLocaleTimeString()
      }],
      success: false,
      executionTime: Date.now() - startTime
    };
  }

  // 콘솔 출력 캡처
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn
  };

  const logs: string[] = [];
  
  // 임시 콘솔 오버라이드
  console.log = (...args) => {
    logs.push(args.map(arg => String(arg)).join(' '));
  };
  console.error = (...args) => {
    logs.push(`ERROR: ${args.map(arg => String(arg)).join(' ')}`);
  };
  console.warn = (...args) => {
    logs.push(`WARNING: ${args.map(arg => String(arg)).join(' ')}`);
  };

  try {
    // 안전한 실행 환경 생성
    const safeGlobals = {
      Math,
      Date,
      Array,
      Object,
      String,
      Number,
      Boolean,
      console,
      // 함수형 프로그래밍 유틸리티
      map: Array.prototype.map,
      filter: Array.prototype.filter,
      reduce: Array.prototype.reduce,
    };

    // 실행 시간 제한 설정
    const executeWithTimeout = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('실행 시간이 초과되었습니다 (5초 제한)'));
      }, EXECUTION_TIMEOUT);

      try {
        // Function 생성자를 사용하여 격리된 환경에서 실행
        const func = new Function(
          ...Object.keys(safeGlobals),
          `
          "use strict";
          ${code}
          `
        );
        
        const result = func(...Object.values(safeGlobals));
        clearTimeout(timeout);
        resolve(result);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });

    const result = await executeWithTimeout;

    // 콘솔 로그 추가
    logs.forEach(log => {
      output.push({
        type: log.startsWith('ERROR:') ? 'error' : 
              log.startsWith('WARNING:') ? 'error' : 'log',
        content: log,
        timestamp: new Date().toLocaleTimeString()
      });
    });

    // 실행 결과 추가
    if (result !== undefined) {
      output.push({
        type: 'result',
        content: `실행 결과: ${JSON.stringify(result, null, 2)}`,
        timestamp: new Date().toLocaleTimeString()
      });
    }

    return {
      output,
      success: true,
      executionTime: Date.now() - startTime
    };

  } catch (error) {
    // 에러 로그 추가
    logs.forEach(log => {
      output.push({
        type: 'log',
        content: log,
        timestamp: new Date().toLocaleTimeString()
      });
    });

    output.push({
      type: 'error',
      content: `실행 오류: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toLocaleTimeString()
    });

    return {
      output,
      success: false,
      executionTime: Date.now() - startTime
    };
  } finally {
    // 콘솔 복원
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
  }
}

// 함수형 프로그래밍 테스트 케이스 실행
export function runTests(code: string, testCases: Array<{
  input: unknown[];
  expected: unknown;
  description: string;
}>): ExecutionResult {
  const startTime = Date.now();
  const output: ExecutionResult['output'] = [];
  let allTestsPassed = true;

  try {
    // 코드에서 함수 추출
    const func = new Function(`
      ${code}
      return typeof factorial !== 'undefined' ? factorial : 
             typeof fibonacci !== 'undefined' ? fibonacci :
             typeof sum !== 'undefined' ? sum :
             null;
    `)();

    if (!func) {
      output.push({
        type: 'error',
        content: '테스트할 함수를 찾을 수 없습니다.',
        timestamp: new Date().toLocaleTimeString()
      });
      return {
        output,
        success: false,
        executionTime: Date.now() - startTime
      };
    }

    // 각 테스트 케이스 실행
    testCases.forEach((testCase, index) => {
      try {
        const result = func(...testCase.input);
        const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
        
        if (passed) {
          output.push({
            type: 'test',
            content: `✅ 테스트 ${index + 1}: ${testCase.description} - 통과`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else {
          allTestsPassed = false;
          output.push({
            type: 'error',
            content: `❌ 테스트 ${index + 1}: ${testCase.description} - 실패\n  입력: ${JSON.stringify(testCase.input)}\n  예상: ${JSON.stringify(testCase.expected)}\n  실제: ${JSON.stringify(result)}`,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      } catch (error) {
        allTestsPassed = false;
        output.push({
          type: 'error',
          content: `❌ 테스트 ${index + 1}: ${testCase.description} - 오류\n  ${error instanceof Error ? error.message : String(error)}`,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    });

    return {
      output,
      success: allTestsPassed,
      executionTime: Date.now() - startTime
    };

  } catch (error) {
    output.push({
      type: 'error',
      content: `테스트 실행 오류: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: new Date().toLocaleTimeString()
    });

    return {
      output,
      success: false,
      executionTime: Date.now() - startTime
    };
  }
}