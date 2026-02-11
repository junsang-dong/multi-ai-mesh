# InsightMesh

**An AI mesh where GPT, Gemini, Claude, and Perplexity work as one for your mission.**

AI 실무 활용 교육을 위한 멀티모델 챗봇 웹앱

---

## 주요 기능

### 핵심
- **4개 GenAI 연동**: GPT (OpenAI), Gemini (Google), Claude (Anthropic), Perplexity
- **대화 단계별 모델 선택**: 각 턴마다 다른 AI 모델 선택 가능

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

## 버전 및 개발자

- **InsightMesh v0.7** / 2026.02.11
- **JunsangDong** (naebon@naver.com)
- **NextPlatform** - [www.nextplatform.net](https://www.nextplatform.net)
