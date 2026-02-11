import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";
import type { Conversation, StoredData } from "../types";
import { loadStoredData, saveStoredData } from "../utils/storage";
import { DEFAULT_MODEL_PARAMS } from "../types";

interface AppContextValue {
  userName: string;
  userEmail: string;
  apiKeys: StoredData["apiKeys"];
  conversations: Conversation[];
  modelParams: StoredData["modelParams"];
  systemPrompt: string;
  currentConversationId: string | null;
  setUserName: (v: string) => void;
  setUserEmail: (v: string) => void;
  setApiKeys: (k: StoredData["apiKeys"]) => void;
  setModelParams: (p: StoredData["modelParams"]) => void;
  setSystemPrompt: (s: string) => void;
  setCurrentConversationId: (id: string | null) => void;
  addConversation: () => string;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  getConversation: (id: string) => Conversation | undefined;
  persist: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredData | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const loaded = loadStoredData();
    setData(loaded ?? {
      userName: "",
      userEmail: "",
      apiKeys: {},
      conversations: [],
      modelParams: { ...DEFAULT_MODEL_PARAMS },
      systemPrompt: "",
    });
  }, [location.pathname]);

  const persist = useCallback(() => {
    if (data) saveStoredData(data);
  }, [data]);

  useEffect(() => {
    if (data) saveStoredData(data);
  }, [data]);

  const setUserName = useCallback((v: string) => {
    setData((d) => (d ? { ...d, userName: v } : d));
  }, []);

  const setUserEmail = useCallback((v: string) => {
    setData((d) => (d ? { ...d, userEmail: v } : d));
  }, []);

  const setApiKeys = useCallback((k: StoredData["apiKeys"]) => {
    setData((d) => (d ? { ...d, apiKeys: k } : d));
  }, []);

  const setModelParams = useCallback((p: StoredData["modelParams"]) => {
    setData((d) => (d ? { ...d, modelParams: p } : d));
  }, []);

  const setSystemPrompt = useCallback((s: string) => {
    setData((d) => (d ? { ...d, systemPrompt: s } : d));
  }, []);

  const addConversation = useCallback((): string => {
    const id = generateId();
    const conv: Conversation = {
      id,
      title: "새 대화",
      messages: [],
      createdAt: Date.now(),
    };
    setData((d) =>
      d
        ? { ...d, conversations: [conv, ...d.conversations] }
        : d
    );
    setCurrentConversationId(id);
    return id;
  }, []);

  const updateConversation = useCallback(
    (id: string, updates: Partial<Conversation>) => {
      setData((d) => {
        if (!d) return d;
        const convs = d.conversations.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        );
        return { ...d, conversations: convs };
      });
    },
    []
  );

  const deleteConversation = useCallback((id: string) => {
    setData((d) => {
      if (!d) return d;
      return {
        ...d,
        conversations: d.conversations.filter((c) => c.id !== id),
      };
    });
    setCurrentConversationId((curr) => (curr === id ? null : curr));
  }, []);

  const getConversation = useCallback(
    (id: string) => data?.conversations.find((c) => c.id === id),
    [data?.conversations]
  );

  if (!data) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>로딩 중...</div>
    );
  }

  const value: AppContextValue = {
    userName: data.userName,
    userEmail: data.userEmail,
    apiKeys: data.apiKeys,
    conversations: data.conversations,
    modelParams: data.modelParams,
    systemPrompt: data.systemPrompt,
    currentConversationId,
    setUserName,
    setUserEmail,
    setApiKeys,
    setModelParams,
    setSystemPrompt,
    setCurrentConversationId,
    addConversation,
    updateConversation,
    deleteConversation,
    getConversation,
    persist,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
