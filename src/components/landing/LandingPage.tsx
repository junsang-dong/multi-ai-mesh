import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserInfoForm } from "./UserInfoForm";
import { APIKeyForm } from "./APIKeyForm";
import { ValidationStatus } from "./ValidationStatus";
import { useAPIKeyValidation } from "../../hooks/useAPIKeyValidation";
import { saveStoredData, hasValidKeys } from "../../utils/storage";
import type { APIKeys } from "../../types";

export function LandingPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [apiKeys, setApiKeys] = useState<APIKeys>({});
  const [error, setError] = useState<string | null>(null);

  const { validate, validating, results } = useAPIKeyValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userName.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!userEmail.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!hasValidKeys(apiKeys)) {
      setError("최소 하나 이상의 API 키를 입력해주세요.");
      return;
    }

    const passed = await validate(apiKeys);
    if (passed) {
      saveStoredData({
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        apiKeys,
      });
      navigate("/chat");
    } else {
      setError("입력하신 API 키 중 유효하지 않은 키가 있습니다. 확인 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-card">
        <h1>InsightMesh</h1>
        <p className="landing-subtitle">An AI mesh where GPT, Gemini, Claude, and Perplexity work as one for your mission.</p>

        <form onSubmit={handleSubmit} className="landing-form">
          <UserInfoForm
            userName={userName}
            userEmail={userEmail}
            onUserNameChange={setUserName}
            onUserEmailChange={setUserEmail}
          />
          <APIKeyForm apiKeys={apiKeys} onKeysChange={setApiKeys} />

          {results && <ValidationStatus results={results} />}
          {error && <div className="error-msg">{error}</div>}

          <button type="submit" disabled={validating} className="btn-primary">
            {validating ? "검증 중..." : "시작하기"}
          </button>
        </form>

        <p className="landing-developer">
          Developed by{" "}
          <a href="https://www.nextplatform.net" target="_blank" rel="noopener noreferrer">
            Nextplatform
          </a>
        </p>
      </div>
    </div>
  );
}
