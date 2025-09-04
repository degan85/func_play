# FuncPlay - 함수형 프로그래밍 학습 플랫폼

SICP(컴퓨터 프로그램의 구조와 해석)를 기반으로 한 인터랙티브 함수형 프로그래밍 학습 플랫폼

## ✨ 주요 기능

- 📱 **모바일 우선 설계**: 스마트폰에서도 편리한 코딩 경험
- 🎮 **게임화된 학습**: XP, 배지, 스트릭 시스템으로 동기부여
- 🧠 **인터랙티브 에디터**: Monaco Editor + 모바일 최적화 에디터
- ⚡ **실시간 코드 실행**: 안전한 JavaScript 실행 환경
- 📊 **진도 추적**: 로컬 스토리지 기반 학습 진도 관리
- 🌙 **다크 모드**: 눈에 편한 다크/라이트 테마

## 🚀 시작하기

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# Vercel에 배포
vercel --prod
```

## 📚 학습 로드맵

### Chapter 1: 프로시저로 추상화하기
- **1.1**: 프로그래밍의 원소들
  - 간단한 산술 연산
  - 조건부 표현과 절차
  
- **1.2**: 프로시저와 프로세스
  - 선형 재귀와 반복 (팩토리얼)
  - 피보나치 수열 최적화
  - 꼬리 재귀 최적화

### Chapter 2: 데이터로 추상화하기 (예정)
- 데이터 추상화 (cons, car, cdr)
- 계층적 데이터 구조
- 심볼릭 데이터

### Chapter 3: 모듈화, 객체, 상태 (예정)
- 할당과 지역 상태
- 환경 모델
- 동시성 모델링

## 🛠️ 기술 스택

### Frontend
- **Next.js 14**: React 기반 풀스택 프레임워크 (App Router)
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크
- **Framer Motion**: 애니메이션 라이브러리
- **Monaco Editor**: VS Code 기반 코드 에디터
- **Lucide React**: 아이콘 라이브러리

### 개발 도구
- **ESLint**: 코드 품질 관리

### 배포
- **Vercel**: 서버리스 배포 플랫폼
- **Edge Functions**: 빠른 응답 시간

## 🏗️ 프로젝트 구조

```
funplay/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 홈페이지
│   │   └── learn/[chapter]/[section]/
│   │       └── page.tsx       # 문제 페이지
│   ├── components/            # React 컴포넌트
│   │   ├── ui/               # 재사용 가능한 UI 컴포넌트
│   │   ├── CodeEditor.tsx    # 코드 에디터
│   │   └── CodeOutput.tsx    # 코드 실행 결과
│   └── lib/                  # 유틸리티 함수
│       ├── problems.ts       # SICP 문제 데이터
│       ├── codeExecutor.ts   # 안전한 코드 실행
│       └── utils.ts          # 공통 유틸리티
├── public/                   # 정적 파일
├── vercel.json              # Vercel 배포 설정
└── README.md
```

## 🔒 보안 기능

### 코드 실행 보안
- 위험한 코드 패턴 감지 및 차단
- 실행 시간 제한 (5초)
- 격리된 실행 환경
- 안전한 전역 객체만 제공

### 차단되는 패턴
- `eval()`, `Function()` 생성자
- `import()`, `require()` 동적 임포트
- `process`, `global`, `window` 전역 객체 접근
- 무한 루프 패턴
- 네트워크 요청 함수

## 🎯 MVP 기능 목록

- [x] Next.js 14 프로젝트 설정
- [x] 반응형 UI 구성
- [x] Monaco Editor 통합
- [x] 모바일 최적화 에디터
- [x] 안전한 코드 실행 환경
- [x] SICP Chapter 1.1-1.2 문제 5개
- [x] 진도 추적 시스템
- [x] Vercel 배포 설정

## 🚧 향후 개발 계획

### Phase 2: Core Features (3-4주)
- [ ] AI 튜터 기능 (Vercel AI SDK)
- [ ] 사용자 인증 (NextAuth.js)
- [ ] 데이터베이스 연동 (Vercel Postgres)
- [ ] 성취 시스템 및 배지

### Phase 3: Advanced Features (4-5주)
- [ ] 코드 자동완성 AI
- [ ] 음성 인식 입력
- [ ] 소셜 기능 (코드 공유, 리더보드)
- [ ] PWA 지원 (오프라인 학습)

### Phase 4: Content & Polish (ongoing)
- [ ] 모든 SICP 챕터 커버
- [ ] 다국어 지원
- [ ] 성능 최적화
- [ ] 사용자 피드백 반영

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 만듭니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 📞 문의

프로젝트에 대한 문의나 제안사항이 있으시면 이슈를 생성해 주세요.

---

**FuncPlay**로 함수형 프로그래밍의 아름다움을 발견하세요! 🎓✨