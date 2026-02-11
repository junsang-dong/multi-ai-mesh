import { ModelParamsForm } from "./ModelParamsForm";
import { SystemPromptEditor } from "./SystemPromptEditor";
import { AppDeveloperInfo } from "./AppDeveloperInfo";

export function RightPanel() {
  return (
    <div className="right-panel">
      <div className="right-panel-header">
        <h2 className="right-panel-title">AI 모델 설정</h2>
      </div>
      <div className="right-panel-content">
        <ModelParamsForm />
        <SystemPromptEditor />
      </div>
      <div className="right-panel-footer">
        <AppDeveloperInfo />
      </div>
    </div>
  );
}
