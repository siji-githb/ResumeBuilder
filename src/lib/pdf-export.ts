import type { PaperSize } from "@/types/resume";

export interface ExportPdfOptions {
  elementId: string;
  documentTitle?: string;
  candidateName?: string;
  paperSize?: PaperSize;
}

/**
 * Generates a clean, valid file name for the downloaded PDF.
 * Uses the document title if available, otherwise applicant's name.
 */
export function getPdfFilename(documentTitle?: string, candidateName?: string): string {
  const rawTitle =
    documentTitle?.trim() ||
    (candidateName?.trim() ? `${candidateName.trim()} Resume` : "Resume");
  const sanitized = rawTitle
    .replace(/[/\\?%*:|"<>]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  return sanitized.toLowerCase().endsWith(".pdf") ? sanitized : `${sanitized}.pdf`;
}

/**
 * Directly downloads the resume as a pixel-perfect PDF file.
 *
 * Guarantees:
 * 1. Immediate direct download without opening the print dialog.
 * 2. Multi-page support: If content exceeds 1 page, page 2 (and subsequent pages)
 *    are automatically generated without any content being cut off.
 * 3. 100% full-width and full-height coverage on every page: NO empty white margins.
 * 4. Preserves all template colors, badges, pills, and typography without distortion.
 */
export async function downloadResumeAsPdf({
  elementId,
  documentTitle,
  candidateName,
  paperSize = "letter",
}: ExportPdfOptions): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Target element #${elementId} not found`);
  }

  // Ensure all web fonts are loaded before capturing
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }

  // Dynamically import jspdf and html2canvas
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const isA4 = paperSize === "a4";
  const pageWidthMm = isA4 ? 210 : 215.9;
  const pageHeightMm = isA4 ? 297 : 279.4;

  // Exact 96 DPI pixel dimensions:
  // Letter: 8.5in * 96 = 816px, 11in * 96 = 1056px
  // A4: 210mm * (96 / 25.4) = 794px, 297mm * (96 / 25.4) = 1123px
  const targetWidthPx = isA4 ? 794 : 816;
  const targetHeightPx = isA4 ? 1123 : 1056;

  // 2x resolution for crisp high-DPI output
  const SCALE = 2;

  // ── Render canvas with html2canvas ─────────────────────────────────
  const canvas = await html2canvas(element, {
    scale: SCALE,
    useCORS: true,
    allowTaint: false,
    backgroundColor: "#ffffff",
    logging: false,
    scrollX: 0,
    scrollY: 0,
    x: 0,
    y: 0,
    width: targetWidthPx,
    // Note: Do NOT hardcode 'height' here so html2canvas captures full multi-page content!
    windowWidth: targetWidthPx,
    onclone: (clonedDoc, clonedElement) => {
      // 1. Preserve all styles and stylesheets by ensuring they are in <head>
      const allStyles = Array.from(clonedDoc.querySelectorAll("style, link[rel='stylesheet']"));
      allStyles.forEach((s) => {
        if (!clonedDoc.head.contains(s)) {
          clonedDoc.head.appendChild(s);
        }
      });

      // 2. Isolate clonedElement as the sole child of body
      // This completely removes headers, navigation bars, and editor sidebars
      // eliminating extraneous layout offsets and preventing horizontal margins.
      clonedDoc.body.innerHTML = "";
      clonedDoc.body.style.margin = "0";
      clonedDoc.body.style.padding = "0";
      clonedDoc.body.style.backgroundColor = "#ffffff";
      clonedDoc.body.style.width = `${targetWidthPx}px`;
      clonedDoc.body.appendChild(clonedElement);

      // 3. Pin clonedElement directly at top-left (0,0) with exact target width
      clonedElement.style.position = "absolute";
      clonedElement.style.top = "0";
      clonedElement.style.left = "0";
      clonedElement.style.width = `${targetWidthPx}px`;
      clonedElement.style.minWidth = `${targetWidthPx}px`;
      clonedElement.style.maxWidth = `${targetWidthPx}px`;
      clonedElement.style.minHeight = `${targetHeightPx}px`;
      clonedElement.style.height = "auto";
      clonedElement.style.boxSizing = "border-box";
      clonedElement.style.margin = "0";
      clonedElement.style.padding = "0";
      clonedElement.style.border = "none";
      clonedElement.style.boxShadow = "none";
      clonedElement.style.borderRadius = "0";
      clonedElement.style.transform = "none";
      clonedElement.style.overflow = "visible";

      // 4. Ensure ResumeRenderer and template roots expand to 100% width
      const rendererWrapper = clonedElement.firstElementChild as HTMLElement | null;
      if (rendererWrapper) {
        rendererWrapper.style.width = "100%";
        rendererWrapper.style.minHeight = `${targetHeightPx}px`;
        rendererWrapper.style.height = "auto";
        rendererWrapper.style.display = "flex";
        rendererWrapper.style.flexDirection = "column";

        const templateRoot = rendererWrapper.firstElementChild as HTMLElement | null;
        if (templateRoot) {
          templateRoot.style.width = "100%";
          templateRoot.style.minHeight = `${targetHeightPx}px`;
          templateRoot.style.height = "auto";
          templateRoot.style.flex = "1";
        }
      }

      // 5. Measure full content height and round up to whole pages
      // This ensures templates with colored sidebars extend cleanly to the bottom of the last page
      const contentHeight = Math.max(
        clonedElement.scrollHeight,
        clonedElement.offsetHeight,
        targetHeightPx
      );
      const numPages = Math.max(1, Math.ceil(contentHeight / targetHeightPx));
      const totalPaperHeight = numPages * targetHeightPx;

      clonedElement.style.height = `${totalPaperHeight}px`;
      clonedElement.style.minHeight = `${totalPaperHeight}px`;

      if (rendererWrapper) {
        rendererWrapper.style.minHeight = `${totalPaperHeight}px`;
        rendererWrapper.style.height = `${totalPaperHeight}px`;
        const templateRoot = rendererWrapper.firstElementChild as HTMLElement | null;
        if (templateRoot) {
          templateRoot.style.minHeight = `${totalPaperHeight}px`;
          templateRoot.style.height = `${totalPaperHeight}px`;
        }
      }

      // 6. Clean up drop shadows (screen artifacts)
      clonedElement.querySelectorAll("*").forEach((node) => {
        const el = node as HTMLElement;
        el.style.boxShadow = "none";
        el.style.textShadow = "none";
      });
    },
  });

  // ── Build and Save PDF with jsPDF ──────────────────────────────────
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: isA4 ? "a4" : "letter",
    compress: true,
  });

  const pageCanvasHeight = targetHeightPx * SCALE;

  if (canvas.height <= pageCanvasHeight + 30) {
    // Single page resume: exactly fills 100% of the paper
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, pageWidthMm, pageHeightMm);
  } else {
    // Multi-page resume: sliced into whole page chunks
    const totalPages = Math.ceil(canvas.height / pageCanvasHeight);

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage(isA4 ? "a4" : "letter", "portrait");
      }

      const sourceY = page * pageCanvasHeight;
      const sliceHeight = Math.min(pageCanvasHeight, canvas.height - sourceY);

      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = canvas.width;
      pageCanvas.height = pageCanvasHeight;

      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight
        );
      }

      const pageImgData = pageCanvas.toDataURL("image/png");
      pdf.addImage(pageImgData, "PNG", 0, 0, pageWidthMm, pageHeightMm);
    }
  }

  const filename = getPdfFilename(documentTitle, candidateName);
  pdf.save(filename);
}
