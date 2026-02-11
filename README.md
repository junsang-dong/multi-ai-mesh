# InsightMesh

**An AI mesh where GPT, Gemini, Claude, and Perplexity work as one for your mission.**

AI 실무 활용 교육을 위한 멀티모델 챗봇 웹앱

---

## 주요 기능

### 핵심
- **4개 GenAI 연동**: GPT (OpenAI), Gemini (Google), Claude (Anthropic), Perplexity
- **대화 단계별 모델 선택**: 각 턴마다 다른 AI 모델 선택 가능
- **맥락 유지**: 이전 대화 전체를 다음 모델에 전달하여 연속된 대화 지원

### UI/UX
- **3패널 레이아웃**: 좌(대화 목록) · 중(채팅) · 우(모델 설정)
- **화이트 테마**: 깔끔한 밝은 테마 디자인
- **대화 이름 편집**: ⋯ 메뉴에서 이름 변경 및 삭제
- **대화 내보내기**: 전체 복사, 마크다운·PDF 다운로드
- **토큰/비용 요약**: 입출력 토큰 수 및 예상 비용 표시

### 설정
- **시스템 프롬프트**: AI 기본 동작 지정
- **모델 파라미터**: temperature, top_p, max_tokens 조절
- **API 설정**: 좌측 하단에서 4개 API 키 확인 및 업데이트

---

## 기술 스택

- **React 19** + **Vite 7** + **TypeScript**
- **Vercel** 배포
- **LocalStorage** 기반 데이터 저장 (브라우저)

---

## 프로젝트 구조

```
mai-edu/
├── src/
│   ├── components/
│   │   ├── landing/      # 랜딩 (이름, 이메일, API 키)
│   │   ├── left-panel/   # 대화 목록, API 설정
│   │   ├── center-panel/ # 채팅, 모델 선택
│   │   ├── right-panel/  # 모델 파라미터, 시스템 프롬프트
│   │   └── layout/
│   ├── context/          # AppContext (전역 상태)
│   ├── hooks/             # useAIChat, useAPIKeyValidation
│   ├── services/         # aiChat (4개 API 호출)
│   ├── types/
│   └── utils/
├── vercel.json           # SPA 라우팅
└── package.json
```

---

## 실행

```bash
npm install
npm run dev
```

http://localhost:5173 에서 실행됩니다.

---

## 빌드

```bash
npm run build
```

---

## Vercel 배포 방법

### 1. GitHub에 푸시 후 연결

1. [Vercel](https://vercel.com)에 로그인
2. **Add New** → **Project**
3. **Import Git Repository**에서 `junsang-dong/vibe_0211_multiple_ai_mesh` 선택
4. **Root Directory**를 `mai-edu`로 설정 (레포가 루트에 있는 경우)
5. **Framework Preset**: Vite
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`
8. **Deploy** 클릭

### 2. Vercel CLI로 배포

```bash
cd mai-edu
npm i -g vercel
vercel
```

첫 실행 시 로그인 및 프로젝트 연결을 안내받습니다.

---

## 버전 및 개발자

- **InsightMesh v0.7** / 2026.02.11
- **JunsangDong** (naebon@naver.com)
- **NextPlatform** - [www.nextplatform.net](https://www.nextplatform.net)
