import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { ConversationList } from "./ConversationList";
import { APISettingsModal } from "./APISettingsModal";

export function LeftPanel() {
  const { userName, userEmail, addConversation } = useApp();
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleNewChat = () => {
    const id = addConversation();
    navigate(`/chat/${id}`);
  };

  return (
    <div className="left-panel">
      <div className="left-panel-header">
        <h1 className="left-panel-brand">InsightMesh</h1>
      </div>
      <div className="left-panel-top">
        <button
          type="button"
          className="nav-home"
          onClick={() => navigate("/chat")}
        >
          홈
        </button>
        <h3 className="section-title">대화 목록</h3>
        <button type="button" className="btn-new-chat" onClick={handleNewChat}>
          + 새 대화
        </button>
        <ConversationList />
      </div>
      <div className="left-panel-footer">
        <button
          type="button"
          className="api-settings-btn"
          onClick={() => setApiModalOpen(true)}
          title="API 설정"
        >
          ⚙ Settings
        </button>
        <div className="user-info-footer">
          <span className="user-name">{userName || "이름 없음"}</span>
          <span className="user-email">{userEmail || "-"}</span>
        </div>
      </div>
      <APISettingsModal
        open={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
      />
    </div>
  );
}
