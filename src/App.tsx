import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { LandingPage } from "./components/landing";
import { MainLayout } from "./components/main/MainLayout";
import { ChatView } from "./pages/ChatView";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<MainLayout />}>
            <Route path="/chat" element={<ChatView />} />
            <Route path="/chat/:conversationId" element={<ChatView />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
