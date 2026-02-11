import type { ModelParameters } from "../../types";
import { useApp } from "../../context/AppContext";

export function ModelParamsForm() {
  const { modelParams, setModelParams } = useApp();

  const update = <K extends keyof ModelParameters>(
    key: K,
    value: ModelParameters[K]
  ) => {
    setModelParams({ ...modelParams, [key]: value });
  };

  return (
    <div className="model-params-form">
      <h3 className="right-section-title">모델 설정</h3>
      <div className="form-group">
        <label htmlFor="temperature">Temperature</label>
        <input
          id="temperature"
          type="number"
          min={0}
          max={2}
          step={0.1}
          value={modelParams.temperature}
          onChange={(e) => update("temperature", parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="topP">Top P</label>
        <input
          id="topP"
          type="number"
          min={0}
          max={1}
          step={0.05}
          value={modelParams.topP}
          onChange={(e) => update("topP", parseFloat(e.target.value) || 1)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="maxTokens">Max Tokens</label>
        <input
          id="maxTokens"
          type="number"
          min={1}
          max={128000}
          value={modelParams.maxTokens}
          onChange={(e) => update("maxTokens", parseInt(e.target.value, 10) || 4096)}
        />
      </div>
    </div>
  );
}
