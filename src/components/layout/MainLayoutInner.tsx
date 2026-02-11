import { LeftPanel } from "../left-panel";
import { CenterPanel } from "../center-panel/CenterPanel";
import { RightPanel } from "../right-panel/RightPanel";

export function MainLayoutInner() {
  return (
    <div className="main-layout">
      <LeftPanel />
      <CenterPanel />
      <RightPanel />
    </div>
  );
}
