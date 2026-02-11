import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export function ConversationList() {
  const { conversations, currentConversationId, setCurrentConversationId, deleteConversation, updateConversation } = useApp();
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSelect = (id: string) => {
    setCurrentConversationId(id);
    navigate(`/chat/${id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMenuOpenId(null);
    if (confirm("이 대화를 삭제하시겠습니까?")) {
      deleteConversation(id);
      if (currentConversationId === id) {
        navigate("/chat");
      }
    }
  };

  const handleMenuToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMenuOpenId((prev) => (prev === id ? null : id));
  };

  const handleRenameClick = (e: React.MouseEvent, c: { id: string; title: string }) => {
    e.stopPropagation();
    setMenuOpenId(null);
    setRenameId(c.id);
    setRenameValue(c.title || "새 대화");
  };

  const handleRenameSave = () => {
    if (renameId && renameValue.trim()) {
      updateConversation(renameId, { title: renameValue.trim() });
    }
    setRenameId(null);
    setRenameValue("");
  };

  const handleRenameCancel = () => {
    setRenameId(null);
    setRenameValue("");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="conversation-list">
      {conversations.map((c) => (
        <div
          key={c.id}
          className={`conversation-item ${
            (conversationId === c.id || currentConversationId === c.id)
              ? "active"
              : ""
          }`}
          onClick={() => !renameId && handleSelect(c.id)}
          onKeyDown={(e) => !renameId && e.key === "Enter" && handleSelect(c.id)}
          role="button"
          tabIndex={0}
        >
          {renameId === c.id ? (
            <div className="conv-rename-form" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSave();
                  if (e.key === "Escape") handleRenameCancel();
                }}
                autoFocus
              />
              <div className="conv-rename-actions">
                <button type="button" onClick={handleRenameSave} className="conv-rename-save">
                  저장
                </button>
                <button type="button" onClick={handleRenameCancel} className="conv-rename-cancel">
                  취소
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="conv-title">{c.title || "새 대화"}</span>
              <div className="conv-actions" ref={menuOpenId === c.id ? menuRef : undefined}>
                <button
                  type="button"
                  className="conv-more"
                  onClick={(e) => handleMenuToggle(e, c.id)}
                  aria-label="더보기"
                >
                  ⋯
                </button>
                {menuOpenId === c.id && (
                  <div className="conv-dropdown">
                    <button
                      type="button"
                      onClick={(e) => handleRenameClick(e, c)}
                    >
                      이름 변경
                    </button>
                    <button
                      type="button"
                      className="conv-dropdown-delete"
                      onClick={(e) => handleDelete(e, c.id)}
                    >
                      삭제
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  className="conv-delete"
                  onClick={(e) => handleDelete(e, c.id)}
                  aria-label="대화 삭제"
                >
                  ×
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
