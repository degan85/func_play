// SICP 기반 함수형 프로그래밍 문제 데이터

export interface TestCase {
  input: unknown[];
  expected: unknown;
  description: string;
}

export interface Problem {
  id: string;
  chapter: number;
  section: number;
  title: string;
  description: string;
  explanation: string;
  initialCode: string;
  solution?: string;
  testCases: TestCase[];
  hints: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  concepts: string[];
  xpReward: number;
}

export const problems: Problem[] = [
  // Chapter 1.1: 프로그래밍의 원소들
  {
    id: '1-1-1',
    chapter: 1,
    section: 1,
    title: '간단한 산술 연산',
    description: '기본적인 산술 연산을 이용하여 주어진 식을 계산하는 함수를 만들어보세요.',
    explanation: `
프로그래밍의 기본은 수치 계산입니다. JavaScript에서는 다음과 같은 산술 연산자를 사용할 수 있습니다:
- 덧셈: +
- 뺄셈: -
- 곱셈: *
- 나눗셈: /
- 나머지: %

이 문제에서는 주어진 두 수의 제곱의 합을 구하는 함수를 구현해야 합니다.
    `,
    initialCode: `// 두 수의 제곱의 합을 구하는 함수
function sumOfSquares(a, b) {
  // 여기에 코드를 작성하세요
  // 예: a=3, b=4일 때 결과는 3² + 4² = 9 + 16 = 25
  
}

// 테스트
console.log(sumOfSquares(3, 4)); // 25
console.log(sumOfSquares(1, 2)); // 5`,
    solution: `function sumOfSquares(a, b) {
  return a * a + b * b;
}`,
    testCases: [
      {
        input: [3, 4],
        expected: 25,
        description: '3² + 4² = 25'
      },
      {
        input: [1, 2],
        expected: 5,
        description: '1² + 2² = 5'
      },
      {
        input: [0, 5],
        expected: 25,
        description: '0² + 5² = 25'
      },
      {
        input: [-2, 3],
        expected: 13,
        description: '(-2)² + 3² = 13'
      }
    ],
    hints: [
      'a의 제곱은 a * a로 구할 수 있습니다.',
      'Math.pow(a, 2)를 사용해도 됩니다.',
      '두 제곱의 결과를 더해서 반환하면 됩니다.'
    ],
    difficulty: 'beginner',
    concepts: ['산술연산', '함수정의', '반환값'],
    xpReward: 100
  },

  {
    id: '1-1-2',
    chapter: 1,
    section: 1,
    title: '조건부 표현과 절차',
    description: '조건문을 사용하여 세 수 중에서 가장 큰 두 수의 제곱의 합을 구하는 함수를 만들어보세요.',
    explanation: `
조건부 표현식은 프로그램의 동작을 제어하는 중요한 도구입니다. JavaScript에서는 if-else 문이나 삼항 연산자를 사용할 수 있습니다.

이 문제는 SICP 연습문제 1.3을 기반으로 합니다. 세 개의 수가 주어졌을 때, 그 중 가장 큰 두 수를 찾아서 그 제곱의 합을 구해야 합니다.

힌트: Math.max() 함수를 활용하거나, 조건문으로 비교해보세요.
    `,
    initialCode: `// 세 수 중 가장 큰 두 수의 제곱의 합을 구하는 함수
function sumOfLargerSquares(a, b, c) {
  // 여기에 코드를 작성하세요
  // 예: a=1, b=2, c=3일 때 결과는 2² + 3² = 4 + 9 = 13
  
}

// 테스트
console.log(sumOfLargerSquares(1, 2, 3)); // 13
console.log(sumOfLargerSquares(3, 1, 2)); // 13
console.log(sumOfLargerSquares(2, 3, 1)); // 13`,
    solution: `function sumOfLargerSquares(a, b, c) {
  // 방법 1: 최솟값을 제외하고 계산
  const min = Math.min(a, b, c);
  if (min === a) return b * b + c * c;
  if (min === b) return a * a + c * c;
  return a * a + b * b;
}

// 방법 2: 조건문 사용
function sumOfLargerSquares(a, b, c) {
  if (a <= b && a <= c) {
    return b * b + c * c;
  } else if (b <= a && b <= c) {
    return a * a + c * c;
  } else {
    return a * a + b * b;
  }
}`,
    testCases: [
      {
        input: [1, 2, 3],
        expected: 13,
        description: '가장 큰 두 수: 2, 3 → 2² + 3² = 13'
      },
      {
        input: [3, 1, 2],
        expected: 13,
        description: '가장 큰 두 수: 3, 2 → 3² + 2² = 13'
      },
      {
        input: [2, 3, 1],
        expected: 13,
        description: '가장 큰 두 수: 2, 3 → 2² + 3² = 13'
      },
      {
        input: [5, 5, 5],
        expected: 50,
        description: '모두 같을 때: 5² + 5² = 50'
      },
      {
        input: [1, 4, 4],
        expected: 32,
        description: '두 개가 같을 때: 4² + 4² = 32'
      }
    ],
    hints: [
      'Math.min()을 사용하여 가장 작은 수를 찾을 수 있습니다.',
      '조건문으로 각 수를 비교해볼 수 있습니다.',
      '가장 작은 수를 제외한 나머지 두 수의 제곱의 합을 구하면 됩니다.'
    ],
    difficulty: 'beginner',
    concepts: ['조건문', '비교연산', 'Math.min', '논리연산'],
    xpReward: 150
  },

  // Chapter 1.2: 프로시저와 프로세스
  {
    id: '1-2-1',
    chapter: 1,
    section: 2,
    title: '선형 재귀와 반복',
    description: '팩토리얼 함수를 재귀적 방법과 반복적 방법 두 가지로 구현해보세요.',
    explanation: `
팩토리얼은 함수형 프로그래밍을 이해하는 데 중요한 예제입니다. n! = n × (n-1) × ... × 2 × 1

재귀적 접근법:
- 기저 조건: 0! = 1, 1! = 1
- 재귀 관계: n! = n × (n-1)!

반복적 접근법:
- 1부터 n까지 곱하기
- for 루프나 while 루프 사용

두 방법 모두 구현해보세요!
    `,
    initialCode: `// 재귀적 팩토리얼
function factorialRecursive(n) {
  // 여기에 재귀 코드를 작성하세요
  // 기저 조건과 재귀 호출을 고려해보세요
  
}

// 반복적 팩토리얼
function factorialIterative(n) {
  // 여기에 반복 코드를 작성하세요
  // for 루프나 while 루프를 사용해보세요
  
}

// 테스트
console.log(factorialRecursive(5)); // 120
console.log(factorialIterative(5)); // 120
console.log(factorialRecursive(0)); // 1
console.log(factorialIterative(0)); // 1`,
    solution: `// 재귀적 팩토리얼
function factorialRecursive(n) {
  if (n <= 1) return 1;
  return n * factorialRecursive(n - 1);
}

// 반복적 팩토리얼
function factorialIterative(n) {
  let result = 1;
  for (let i = 1; i <= n; i++) {
    result *= i;
  }
  return result;
}`,
    testCases: [
      {
        input: [5],
        expected: 120,
        description: '5! = 120'
      },
      {
        input: [0],
        expected: 1,
        description: '0! = 1 (기저 조건)'
      },
      {
        input: [1],
        expected: 1,
        description: '1! = 1'
      },
      {
        input: [4],
        expected: 24,
        description: '4! = 24'
      }
    ],
    hints: [
      '재귀: 기저 조건(n <= 1일 때 1 반환)을 먼저 확인하세요.',
      '재귀: n * factorial(n-1)을 반환하세요.',
      '반복: result 변수를 1로 초기화하고, 1부터 n까지 곱하세요.',
      '0! = 1임을 잊지 마세요!'
    ],
    difficulty: 'intermediate',
    concepts: ['재귀', '반복', '기저조건', '점화식'],
    xpReward: 200
  },

  {
    id: '1-2-2',
    chapter: 1,
    section: 2,
    title: '피보나치 수열',
    description: '피보나치 수열을 재귀적 방법과 반복적 방법으로 구현하고, 성능 차이를 관찰해보세요.',
    explanation: `
피보나치 수열: F(n) = F(n-1) + F(n-2)
기저 조건: F(0) = 0, F(1) = 1

재귀적 방법은 직관적이지만 중복 계산으로 인해 비효율적입니다.
반복적 방법은 효율적이지만 코드가 조금 더 복잡합니다.

두 방법을 구현하고 큰 수에 대해 실행 시간을 비교해보세요!
    `,
    initialCode: `// 재귀적 피보나치 (비효율적)
function fibonacciRecursive(n) {
  // 여기에 재귀 코드를 작성하세요
  // 기저 조건: F(0) = 0, F(1) = 1
  
}

// 반복적 피보나치 (효율적)
function fibonacciIterative(n) {
  // 여기에 반복 코드를 작성하세요
  // 이전 두 값을 추적하면서 계산
  
}

// 성능 테스트
console.log("재귀:", fibonacciRecursive(10));
console.log("반복:", fibonacciIterative(10));
console.log("재귀:", fibonacciRecursive(20));
console.log("반복:", fibonacciIterative(20));`,
    solution: `// 재귀적 피보나치
function fibonacciRecursive(n) {
  if (n <= 1) return n;
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// 반복적 피보나치
function fibonacciIterative(n) {
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  return b;
}`,
    testCases: [
      {
        input: [0],
        expected: 0,
        description: 'F(0) = 0'
      },
      {
        input: [1],
        expected: 1,
        description: 'F(1) = 1'
      },
      {
        input: [5],
        expected: 5,
        description: 'F(5) = 5'
      },
      {
        input: [10],
        expected: 55,
        description: 'F(10) = 55'
      },
      {
        input: [15],
        expected: 610,
        description: 'F(15) = 610'
      }
    ],
    hints: [
      '재귀: 기저 조건은 n <= 1일 때 n을 반환',
      '재귀: fib(n-1) + fib(n-2)를 반환',
      '반복: 두 변수로 이전 값들을 추적',
      '반복: 매 단계마다 a, b를 업데이트'
    ],
    difficulty: 'intermediate',
    concepts: ['재귀', '반복', '성능최적화', '동적프로그래밍'],
    xpReward: 250
  },

  {
    id: '1-2-3',
    chapter: 1,
    section: 2,
    title: '꼬리 재귀 최적화',
    description: '팩토리얼을 꼬리 재귀 방식으로 구현하여 스택 오버플로우를 방지해보세요.',
    explanation: `
꼬리 재귀(Tail Recursion)는 재귀 호출이 함수의 마지막에 위치하는 특별한 형태입니다.
많은 언어에서 꼬리 재귀는 반복문으로 최적화될 수 있어서 스택 오버플로우를 방지할 수 있습니다.

일반 재귀: factorial(n) = n * factorial(n-1)
꼬리 재귀: factorial(n, acc) = factorial(n-1, n*acc)

accumulator(누적값)를 사용하여 중간 결과를 전달합니다.
    `,
    initialCode: `// 꼬리 재귀 팩토리얼
function factorialTailRecursive(n, accumulator = 1) {
  // 여기에 꼬리 재귀 코드를 작성하세요
  // accumulator를 사용하여 중간 결과를 누적
  
}

// 래퍼 함수 (사용자 편의를 위해)
function factorial(n) {
  return factorialTailRecursive(n, 1);
}

// 큰 수로 테스트해보세요
console.log(factorial(5)); // 120
console.log(factorial(10)); // 3628800
console.log(factorial(20)); // 2432902008176640000`,
    solution: `function factorialTailRecursive(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return factorialTailRecursive(n - 1, n * accumulator);
}

function factorial(n) {
  return factorialTailRecursive(n, 1);
}`,
    testCases: [
      {
        input: [5],
        expected: 120,
        description: '5! = 120'
      },
      {
        input: [0],
        expected: 1,
        description: '0! = 1'
      },
      {
        input: [10],
        expected: 3628800,
        description: '10! = 3628800'
      },
      {
        input: [6],
        expected: 720,
        description: '6! = 720'
      }
    ],
    hints: [
      'accumulator에 중간 결과를 저장하세요',
      '기저 조건에서 accumulator를 반환하세요',
      '재귀 호출 시 n-1과 n*accumulator를 전달하세요',
      '재귀 호출이 함수의 마지막 문장이어야 합니다'
    ],
    difficulty: 'advanced',
    concepts: ['꼬리재귀', 'accumulator', '스택최적화', '함수형프로그래밍'],
    xpReward: 300
  },

  // Chapter 2.1: 데이터 추상화 소개
  {
    id: '2-1-1',
    chapter: 2,
    section: 1,
    title: 'Pair 데이터 구조 만들기',
    description: 'cons, car, cdr을 사용하여 두 값을 묶는 pair 데이터 구조를 구현해보세요.',
    explanation: `
데이터 추상화의 첫 번째 단계는 간단한 데이터 구조를 만드는 것입니다.
SICP에서는 두 값을 묶는 pair를 만들기 위해 다음 함수들을 사용합니다:

- cons(a, b): 두 값 a와 b를 묶어서 pair를 만듭니다
- car(pair): pair의 첫 번째 값을 가져옵니다  
- cdr(pair): pair의 두 번째 값을 가져옵니다

JavaScript에서는 배열을 사용하여 이를 구현할 수 있습니다.
    `,
    initialCode: `// cons: 두 값을 묶어서 pair를 만드는 함수
function cons(a, b) {
  // 여기에 코드를 작성하세요
  // 힌트: 배열을 사용해보세요
  
}

// car: pair의 첫 번째 값을 가져오는 함수
function car(pair) {
  // 여기에 코드를 작성하세요
  
}

// cdr: pair의 두 번째 값을 가져오는 함수
function cdr(pair) {
  // 여기에 코드를 작성하세요
  
}

// 테스트
const myPair = cons(1, 2);
console.log("car(myPair):", car(myPair)); // 1
console.log("cdr(myPair):", cdr(myPair)); // 2

const namePair = cons("홍길동", 25);
console.log("이름:", car(namePair));
console.log("나이:", cdr(namePair));`,
    solution: `function cons(a, b) {
  return [a, b];
}

function car(pair) {
  return pair[0];
}

function cdr(pair) {
  return pair[1];
}`,
    testCases: [
      {
        input: [[1, 2]],
        expected: 1,
        description: 'car([1, 2]) = 1'
      },
      {
        input: [[1, 2]],
        expected: 2,
        description: 'cdr([1, 2]) = 2'
      },
      {
        input: [["hello", "world"]],
        expected: "hello",
        description: 'car(["hello", "world"]) = "hello"'
      },
      {
        input: [[true, false]],
        expected: false,
        description: 'cdr([true, false]) = false'
      }
    ],
    hints: [
      'cons는 두 값을 배열로 묶어서 반환합니다',
      'car는 배열의 첫 번째 원소([0])를 반환합니다',
      'cdr은 배열의 두 번째 원소([1])를 반환합니다',
      '이 함수들은 함수형 프로그래밍의 기본 구성요소입니다'
    ],
    difficulty: 'beginner',
    concepts: ['데이터추상화', 'cons', 'car', 'cdr', 'pair'],
    xpReward: 200
  },

  {
    id: '2-1-2',
    chapter: 2,
    section: 1,
    title: '리스트 데이터 구조',
    description: 'cons를 연쇄적으로 사용하여 리스트를 만들고 조작하는 함수들을 구현해보세요.',
    explanation: `
LISP의 핵심 아이디어 중 하나는 리스트입니다. 리스트는 cons를 연쇄적으로 사용하여 만들 수 있습니다:

리스트 [1, 2, 3]은 다음과 같이 표현됩니다:
cons(1, cons(2, cons(3, null)))

이를 통해 다음과 같은 함수들을 만들 수 있습니다:
- list(...items): 여러 값을 리스트로 만듭니다
- length(list): 리스트의 길이를 구합니다
- listRef(list, n): 리스트의 n번째 원소를 가져옵니다
    `,
    initialCode: `// 이전 문제의 cons, car, cdr 함수들
function cons(a, b) { return [a, b]; }
function car(pair) { return pair[0]; }
function cdr(pair) { return pair[1]; }

// list: 여러 값을 리스트로 만드는 함수
function list(...items) {
  // 여기에 코드를 작성하세요
  // 힌트: items를 뒤에서부터 cons로 연결해보세요
  
}

// length: 리스트의 길이를 구하는 함수 (재귀 사용)
function length(lst) {
  // 여기에 코드를 작성하세요
  // 힌트: 빈 리스트(null)면 0, 아니면 1 + length(cdr(lst))
  
}

// listRef: 리스트의 n번째 원소를 가져오는 함수
function listRef(lst, n) {
  // 여기에 코드를 작성하세요
  // 힌트: n이 0이면 car(lst), 아니면 listRef(cdr(lst), n-1)
  
}

// 테스트
const myList = list(1, 2, 3, 4);
console.log("length:", length(myList)); // 4
console.log("첫 번째:", listRef(myList, 0)); // 1
console.log("세 번째:", listRef(myList, 2)); // 3`,
    solution: `function list(...items) {
  if (items.length === 0) return null;
  let result = null;
  for (let i = items.length - 1; i >= 0; i--) {
    result = cons(items[i], result);
  }
  return result;
}

function length(lst) {
  if (lst === null) return 0;
  return 1 + length(cdr(lst));
}

function listRef(lst, n) {
  if (n === 0) return car(lst);
  return listRef(cdr(lst), n - 1);
}`,
    testCases: [
      {
        input: [null],
        expected: 0,
        description: 'length(null) = 0'
      },
      {
        input: [[[1, [2, [3, null]]], 0]],
        expected: 1,
        description: 'listRef(list(1,2,3), 0) = 1'
      },
      {
        input: [[[1, [2, [3, null]]], 2]],
        expected: 3,
        description: 'listRef(list(1,2,3), 2) = 3'
      }
    ],
    hints: [
      'list 함수는 items를 뒤에서부터 cons로 연결해야 합니다',
      'length는 재귀적으로 구현하세요: 빈 리스트면 0, 아니면 1 + length(나머지)',
      'listRef도 재귀적으로: n이 0이면 첫 번째 원소, 아니면 나머지에서 n-1번째',
      'null은 빈 리스트를 나타냅니다'
    ],
    difficulty: 'intermediate',
    concepts: ['리스트', '재귀', 'cons구조', '데이터추상화'],
    xpReward: 300
  },

  {
    id: '2-2-1',
    chapter: 2,
    section: 2,
    title: '리스트 변환 함수들',
    description: 'map, filter, reduce 함수를 직접 구현하여 리스트를 변환해보세요.',
    explanation: `
함수형 프로그래밍의 핵심은 데이터를 변환하는 고차 함수들입니다:

- map(fn, list): 리스트의 각 원소에 함수를 적용합니다
- filter(predicate, list): 조건을 만족하는 원소만 남깁니다  
- reduce(fn, initial, list): 리스트를 하나의 값으로 축약합니다

이 함수들을 cons, car, cdr을 사용하여 직접 구현해보겠습니다.
이를 통해 함수형 프로그래밍의 본질을 이해할 수 있습니다.
    `,
    initialCode: `// 기본 함수들
function cons(a, b) { return [a, b]; }
function car(pair) { return pair[0]; }
function cdr(pair) { return pair[1]; }

// map: 리스트의 각 원소에 함수를 적용
function map(fn, lst) {
  // 여기에 코드를 작성하세요
  // 힌트: 빈 리스트면 null, 아니면 cons(fn(car(lst)), map(fn, cdr(lst)))
  
}

// filter: 조건을 만족하는 원소만 남기기
function filter(predicate, lst) {
  // 여기에 코드를 작성하세요
  // 힌트: predicate(car(lst))가 true면 포함, false면 제외
  
}

// reduce: 리스트를 하나의 값으로 축약
function reduce(fn, initial, lst) {
  // 여기에 코드를 작성하세요
  // 힌트: 빈 리스트면 initial, 아니면 reduce(fn, fn(initial, car(lst)), cdr(lst))
  
}

// 테스트용 리스트 생성 함수
function list(...items) {
  if (items.length === 0) return null;
  let result = null;
  for (let i = items.length - 1; i >= 0; i--) {
    result = cons(items[i], result);
  }
  return result;
}

// 테스트
const numbers = list(1, 2, 3, 4, 5);
const doubled = map(x => x * 2, numbers);
const evens = filter(x => x % 2 === 0, numbers);
const sum = reduce((acc, x) => acc + x, 0, numbers);

console.log("원본:", numbers);
console.log("2배:", doubled);
console.log("짝수:", evens);  
console.log("합계:", sum);`,
    solution: `function map(fn, lst) {
  if (lst === null) return null;
  return cons(fn(car(lst)), map(fn, cdr(lst)));
}

function filter(predicate, lst) {
  if (lst === null) return null;
  if (predicate(car(lst))) {
    return cons(car(lst), filter(predicate, cdr(lst)));
  }
  return filter(predicate, cdr(lst));
}

function reduce(fn, initial, lst) {
  if (lst === null) return initial;
  return reduce(fn, fn(initial, car(lst)), cdr(lst));
}`,
    testCases: [
      {
        input: [0, null],
        expected: 0,
        description: 'reduce(+, 0, null) = 0'
      },
      {
        input: [null],
        expected: null,
        description: 'map(f, null) = null'
      },
      {
        input: [null],
        expected: null,
        description: 'filter(p, null) = null'
      }
    ],
    hints: [
      'map: 빈 리스트면 null, 아니면 cons(함수적용결과, map(나머지))',
      'filter: 조건을 만족하면 포함하고 계속, 아니면 건너뛰고 계속',
      'reduce: 빈 리스트면 초기값 반환, 아니면 누적값을 업데이트하고 계속',
      '모든 함수는 재귀적으로 구현하세요'
    ],
    difficulty: 'intermediate',
    concepts: ['고차함수', 'map', 'filter', 'reduce', '재귀'],
    xpReward: 400
  },

  // Chapter 3.1: 할당과 지역 상태
  {
    id: '3-1-1',
    chapter: 3,
    section: 1,
    title: '클로저와 지역 상태',
    description: '클로저를 사용하여 상태를 가지는 함수를 만들어보세요.',
    explanation: `
함수형 프로그래밍에서도 때로는 상태를 관리해야 합니다. 
JavaScript의 클로저를 사용하면 상태를 캡슐화할 수 있습니다.

클로저는 함수가 자신이 정의된 스코프의 변수에 접근할 수 있게 해주는 기능입니다.
이를 통해 private 변수를 만들고 상태를 관리할 수 있습니다.

예: 계좌 객체 만들기
- 잔액을 private하게 관리
- 입금, 출금, 잔액조회 메서드 제공
    `,
    initialCode: `// 계좌를 만드는 팩토리 함수
function makeAccount(initialBalance) {
  // 여기에 코드를 작성하세요
  // 힌트: balance 변수를 클로저로 캡슐화하세요
  
  return {
    // deposit: 입금 함수
    deposit: function(amount) {
      // 여기에 코드를 작성하세요
      
    },
    
    // withdraw: 출금 함수  
    withdraw: function(amount) {
      // 여기에 코드를 작성하세요
      // 잔액이 부족하면 "잔액 부족" 메시지 반환
      
    },
    
    // getBalance: 잔액 조회 함수
    getBalance: function() {
      // 여기에 코드를 작성하세요
      
    }
  };
}

// 테스트
const account = makeAccount(100);
console.log("초기 잔액:", account.getBalance()); // 100

account.deposit(50);
console.log("입금 후:", account.getBalance()); // 150

console.log("출금:", account.withdraw(30)); // 30
console.log("출금 후 잔액:", account.getBalance()); // 120

console.log("과다 출금:", account.withdraw(200)); // "잔액 부족"`,
    solution: `function makeAccount(initialBalance) {
  let balance = initialBalance;
  
  return {
    deposit: function(amount) {
      balance += amount;
      return amount;
    },
    
    withdraw: function(amount) {
      if (balance >= amount) {
        balance -= amount;
        return amount;
      } else {
        return "잔액 부족";
      }
    },
    
    getBalance: function() {
      return balance;
    }
  };
}`,
    testCases: [
      {
        input: [100],
        expected: 100,
        description: 'makeAccount(100).getBalance() = 100'
      },
      {
        input: [100, 50],
        expected: 150,
        description: '입금 후 잔액 확인'
      },
      {
        input: [100, 30],
        expected: 70,
        description: '출금 후 잔액 확인'
      },
      {
        input: [50, 100],
        expected: '잔액 부족',
        description: '과다 출금 시 오류 메시지'
      }
    ],
    hints: [
      'balance 변수를 함수 내부에서 let으로 선언하세요',
      'return하는 객체의 메서드들이 balance에 접근할 수 있습니다',
      'deposit은 balance에 amount를 더하고 amount를 반환',
      'withdraw는 잔액이 충분한지 먼저 확인하세요'
    ],
    difficulty: 'intermediate',
    concepts: ['클로저', '상태관리', '캡슐화', '팩토리함수'],
    xpReward: 350
  },

  {
    id: '3-1-2',
    chapter: 3,
    section: 1,
    title: '상태를 가진 리스트',
    description: '상태 변화를 추적하는 리스트 데이터 구조를 구현해보세요.',
    explanation: `
지금까지 만든 리스트는 불변(immutable)이었습니다. 
이번에는 상태가 변할 수 있는(mutable) 리스트를 만들어보겠습니다.

이런 리스트는 다음과 같은 연산을 지원해야 합니다:
- add(item): 아이템 추가
- remove(index): 특정 인덱스의 아이템 제거
- get(index): 특정 인덱스의 아이템 조회
- size(): 리스트 크기
- history(): 변경 이력 조회

변경될 때마다 이력을 저장하여 상태 변화를 추적할 수 있게 합시다.
    `,
    initialCode: `function makeStatefulList() {
  // 여기에 상태 변수들을 선언하세요
  // 힌트: items 배열과 history 배열이 필요합니다
  
  return {
    add: function(item) {
      // 여기에 코드를 작성하세요
      // 아이템을 추가하고 이력에 기록
      
    },
    
    remove: function(index) {
      // 여기에 코드를 작성하세요
      // 인덱스가 유효한지 확인하고 제거
      
    },
    
    get: function(index) {
      // 여기에 코드를 작성하세요
      // 인덱스의 아이템 반환, 유효하지 않으면 undefined
      
    },
    
    size: function() {
      // 여기에 코드를 작성하세요
      
    },
    
    toArray: function() {
      // 현재 상태를 배열로 반환 (테스트용)
      
    },
    
    history: function() {
      // 변경 이력 반환
      
    }
  };
}

// 테스트
const list = makeStatefulList();
list.add("첫번째");
list.add("두번째"); 
list.add("세번째");

console.log("크기:", list.size()); // 3
console.log("1번 인덱스:", list.get(1)); // "두번째"
console.log("배열:", list.toArray()); // ["첫번째", "두번째", "세번째"]

list.remove(1);
console.log("제거 후:", list.toArray()); // ["첫번째", "세번째"]
console.log("이력:", list.history());`,
    solution: `function makeStatefulList() {
  let items = [];
  let changeHistory = [];
  
  return {
    add: function(item) {
      items.push(item);
      changeHistory.push({ action: 'add', item: item, timestamp: new Date() });
      return items.length - 1;
    },
    
    remove: function(index) {
      if (index >= 0 && index < items.length) {
        const removed = items.splice(index, 1)[0];
        changeHistory.push({ action: 'remove', index: index, item: removed, timestamp: new Date() });
        return removed;
      }
      return undefined;
    },
    
    get: function(index) {
      return items[index];
    },
    
    size: function() {
      return items.length;
    },
    
    toArray: function() {
      return [...items];
    },
    
    history: function() {
      return [...changeHistory];
    }
  };
}`,
    testCases: [
      {
        input: [],
        expected: 0,
        description: '초기 크기는 0'
      },
      {
        input: [['a', 'b', 'c']],
        expected: 3,
        description: '3개 추가 후 크기는 3'
      },
      {
        input: [['a', 'b', 'c'], 1],
        expected: 'b',
        description: '인덱스 1은 두번째 아이템'
      },
      {
        input: [['a', 'b', 'c'], 1, 'remove'],
        expected: ['a', 'c'],
        description: '인덱스 1 제거 후 배열'
      }
    ],
    hints: [
      'items 배열로 실제 데이터를 저장하세요',
      'changeHistory 배열로 모든 변경사항을 기록하세요',
      'add는 push를 사용하고, remove는 splice를 사용하세요',
      '인덱스가 유효한 범위인지 항상 확인하세요'
    ],
    difficulty: 'advanced',
    concepts: ['상태관리', '이력추적', 'mutable데이터', '클로저'],
    xpReward: 450
  }
];

// 챕터별 문제 가져오기
export function getProblemsByChapter(chapter: number): Problem[] {
  return problems.filter(p => p.chapter === chapter);
}

// 특정 문제 가져오기
export function getProblemById(id: string): Problem | undefined {
  return problems.find(p => p.id === id);
}

// 난이도별 문제 가져오기
export function getProblemsByDifficulty(difficulty: Problem['difficulty']): Problem[] {
  return problems.filter(p => p.difficulty === difficulty);
}

// 진도 관리 (로컬 스토리지 기반)
export interface Progress {
  problemId: string;
  completed: boolean;
  bestCode?: string;
  attempts: number;
  completedAt?: Date;
}

export function getProgress(): Progress[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('funcplay-progress');
  return stored ? JSON.parse(stored) : [];
}

export function updateProgress(problemId: string, completed: boolean, code?: string): void {
  if (typeof window === 'undefined') return;
  
  const progress = getProgress();
  const existing = progress.find(p => p.problemId === problemId);
  
  if (existing) {
    existing.completed = completed;
    existing.attempts++;
    if (completed) {
      existing.completedAt = new Date();
      if (code) existing.bestCode = code;
    }
  } else {
    progress.push({
      problemId,
      completed,
      bestCode: completed ? code : undefined,
      attempts: 1,
      completedAt: completed ? new Date() : undefined
    });
  }
  
  localStorage.setItem('funcplay-progress', JSON.stringify(progress));
}

export function getProgressForProblem(problemId: string): Progress | undefined {
  return getProgress().find(p => p.problemId === problemId);
}

// 네비게이션 유틸리티 함수들
export function getProblemsForChapter(chapter: number): Problem[] {
  return problems.filter(p => p.chapter === chapter).sort((a, b) => {
    if (a.section !== b.section) return a.section - b.section;
    return a.id.localeCompare(b.id);
  });
}

export function getNextProblem(currentProblemId: string): Problem | null {
  const currentProblem = problems.find(p => p.id === currentProblemId);
  if (!currentProblem) return null;
  
  const chapterProblems = getProblemsForChapter(currentProblem.chapter);
  const currentIndexInChapter = chapterProblems.findIndex(p => p.id === currentProblemId);
  
  if (currentIndexInChapter === -1 || currentIndexInChapter === chapterProblems.length - 1) return null;
  return chapterProblems[currentIndexInChapter + 1];
}

export function getPreviousProblem(currentProblemId: string): Problem | null {
  const currentProblem = problems.find(p => p.id === currentProblemId);
  if (!currentProblem) return null;
  
  const chapterProblems = getProblemsForChapter(currentProblem.chapter);
  const currentIndexInChapter = chapterProblems.findIndex(p => p.id === currentProblemId);
  
  if (currentIndexInChapter <= 0) return null;
  return chapterProblems[currentIndexInChapter - 1];
}

export function getProblemPosition(problemId: string): { current: number; total: number } {
  const problem = problems.find(p => p.id === problemId);
  if (!problem) return { current: 0, total: 0 };
  
  const chapterProblems = getProblemsForChapter(problem.chapter);
  const currentIndex = chapterProblems.findIndex(p => p.id === problemId);
  
  return {
    current: currentIndex + 1,
    total: chapterProblems.length
  };
}