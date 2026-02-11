import { jsPDF } from "jspdf";
import type { Message } from "../types";
import { MODEL_OPTIONS } from "../types";

export function getModelLabel(modelId: string): string {
  for (const options of Object.values(MODEL_OPTIONS)) {
    const found = options.find((o) => o.id === modelId);
    if (found) return found.label;
  }
  return modelId;
}

export async function exportToPDF(messages: Message[]): Promise<void> {
  const doc = new jsPDF();
  let y = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;

  doc.setFontSize(14);
  doc.text("InsightMesh - 대화 내보내기", margin, y);
  y += 15;

  doc.setFontSize(10);

  for (const m of messages) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    const role = m.role === "user" ? "사용자" : getModelLabel(m.modelId);
    doc.setFont("helvetica", "bold");
    doc.text(`${role}:`, margin, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(m.content, pageWidth);
    for (const line of lines) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 5;
    }
    y += 8;
  }

  doc.save(`insightmesh-${Date.now()}.pdf`);
}
