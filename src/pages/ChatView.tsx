import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainLayoutInner } from "../components/layout/MainLayoutInner";
import { useApp } from "../context/AppContext";

export function ChatView() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { setCurrentConversationId, getConversation } = useApp();

  useEffect(() => {
    if (conversationId) {
      const conv = getConversation(conversationId);
      if (conv) setCurrentConversationId(conversationId);
      else setCurrentConversationId(null);
    } else {
      setCurrentConversationId(null);
    }
  }, [conversationId, setCurrentConversationId, getConversation]);

  return <MainLayoutInner />;
}
