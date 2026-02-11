import type { ChangeEvent } from "react";

interface UserInfoFormProps {
  userName: string;
  userEmail: string;
  onUserNameChange: (v: string) => void;
  onUserEmailChange: (v: string) => void;
}

export function UserInfoForm({
  userName,
  userEmail,
  onUserNameChange,
  onUserEmailChange,
}: UserInfoFormProps) {
  return (
    <div className="landing-section">
      <h2>사용자 정보</h2>
      <div className="form-group">
        <label htmlFor="userName">이름</label>
        <input
          id="userName"
          type="text"
          placeholder="이름을 입력하세요"
          value={userName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onUserNameChange(e.target.value)}
          autoComplete="name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="userEmail">이메일</label>
        <input
          id="userEmail"
          type="email"
          placeholder="이메일을 입력하세요"
          value={userEmail}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onUserEmailChange(e.target.value)}
          autoComplete="email"
        />
      </div>
    </div>
  );
}
