import type { PaperSize, ResumeMargin } from "@/types/resume";
import { applySmartPageBreaks } from "@/lib/page-breaks";

export interface ExportPdfOptions {
  elementId: string;
  documentTitle?: string;
  candidateName?: string;
  paperSize?: PaperSize;
  margin?: ResumeMargin;
}

/**
 * Generates a clean, valid file name for the downloaded PDF.
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

// ─── Color pre-resolution helpers ─────────────────────────────────────────────
//
// Tailwind v4 defines its entire color palette as oklch() values.
// html2canvas 1.4.1 can't parse oklch/color-mix/lab/lch etc., and the patched
// fallback used to read ctx.fillStyle *getter* — which in Chrome 112+ returns
// "oklch(...)" instead of "#rrggbb", so every color fell through to 0x00000000
// (transparent).  The patch is now fixed to use getImageData(), but we also add
// this pre-resolution pass as defense-in-depth: it walks every element in the
// cloned document and inlines its computed color properties as plain rgb/rgba
// values *before* html2canvas ever attempts to parse them.

const COLOR_CSS_PROPS: readonly string[] = [
  "color",
  "background-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "text-decoration-color",
  "column-rule-color",
  "caret-color",
  "fill",
  "stroke",
];

/**
 * Returns a colour-resolution canvas bound to the *main* window.
 * Reusing one instance avoids thrashing GPU memory for each element.
 */
function makeColorCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    return { canvas, ctx };
  } catch {
    return null;
  }
}

/**
 * Converts *any* CSS colour string to rgb()/rgba() using canvas pixel sampling.
 * getImageData() always returns sRGB bytes — it works for oklch, color-mix, hsl,
 * hwb, lab, lch, display-p3, and any future colour function the browser supports.
 * Returns null when the colour is transparent or when the browser can't parse it.
 */
function resolveColorToRgb(
  ctx: CanvasRenderingContext2D,
  val: string
): string | null {
  if (!val || val === "transparent" || val === "currentcolor") return null;
  // Already a plain sRGB format — skip expensive canvas round-trip
  if (/^(#[0-9a-f]{3,8}$|rgba?\s*\()/i.test(val)) return null;

  try {
    // Resetting width clears the pixel data without a separate clearRect call
    ctx.canvas.width = 1;
    ctx.fillStyle = val;
    ctx.fillRect(0, 0, 1, 1);
    const px = ctx.getImageData(0, 0, 1, 1).data; // always sRGB 0-255
    if (px[3] === 0) return null; // transparent or unrecognised colour
    const alpha = px[3] / 255;
    return alpha >= 0.9999
      ? `rgb(${px[0]}, ${px[1]}, ${px[2]})`
      : `rgba(${px[0]}, ${px[1]}, ${px[2]}, ${alpha.toFixed(4)})`;
  } catch {
    return null;
  }
}

/**
 * Walks every descendant of `root` (including root itself) in the cloned
 * document and inlines all computed colour properties as rgb/rgba so that
 * html2canvas never has to parse oklch, color-mix, or any other modern syntax.
 */
function resolveAllColors(clonedDoc: Document, root: HTMLElement): void {
  const cc = makeColorCanvas();
  if (!cc) return;

  const win = clonedDoc.defaultView;
  if (!win) return;

  const processElement = (el: HTMLElement) => {
    try {
      const cs = win.getComputedStyle(el);
      for (const prop of COLOR_CSS_PROPS) {
        const val = cs.getPropertyValue(prop);
        if (!val) continue;
        const resolved = resolveColorToRgb(cc.ctx, val);
        if (resolved !== null) {
          el.style.setProperty(prop, resolved, "important");
        }
      }
    } catch {
      // Never let a single element abort the whole walk
    }
  };

  processElement(root);
  root.querySelectorAll<HTMLElement>("*").forEach(processElement);
}

// ─── Multi-page sidebar fill helper ───────────────────────────────────────────
//
// Templates with full-height coloured sidebars (e.g. ModernSidebarTemplate)
// render the sidebar as a flex child whose height is driven by its sibling.
// When we force a fixed total height on the wrapper, the sidebar div itself
// doesn't automatically stretch unless we find it and set its height too.

function extendSidebarFills(clonedElement: HTMLElement, totalHeight: number): void {
  const templateRoot = clonedElement.querySelector<HTMLElement>(
    ".modern-sidebar, .ats-classic, .modern-clean, .creative-bold, .executive, .chronological, .functional, .combination"
  );
  const candidates = templateRoot
    ? (Array.from(templateRoot.children) as HTMLElement[])
    : (Array.from(
        clonedElement.querySelector<HTMLElement>(
          ".modern-sidebar, .executive-sidebar, [class*='sidebar']"
        )?.children ?? []
      ) as HTMLElement[]);

  for (const child of candidates) {
    const bg = child.style.backgroundColor || getComputedStyle(child).backgroundColor;
    const isColoredPanel =
      bg &&
      bg !== "rgba(0, 0, 0, 0)" &&
      bg !== "transparent" &&
      bg !== "rgb(255, 255, 255)";

    if (isColoredPanel) {
      child.style.minHeight = `${totalHeight}px`;
      child.style.height = `${totalHeight}px`;
    }
  }
}

// ─── Main export function ──────────────────────────────────────────────────────

/**
 * Downloads the resume as a pixel-perfect PDF.
 *
 * Guarantees:
 * 1. Direct download — no print dialog.
 * 2. Full multi-page support without content cut-off.
 * 3. 100 % full-width / full-height coverage on every page — no empty margins.
 * 4. Preserves all template colors, badges, pills, and typography.
 * 5. Correctly renders Tailwind v4 oklch/color-mix colors that html2canvas
 *    cannot natively parse.
 */
export async function downloadResumeAsPdf({
  elementId,
  documentTitle,
  candidateName,
  paperSize = "letter",
  margin = "normal",
}: ExportPdfOptions): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Target element #${elementId} not found`);
  }

  // Wait for all web fonts to finish loading
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const isA4 = paperSize === "a4";
  const pageWidthMm  = isA4 ? 210    : 215.9;
  const pageHeightMm = isA4 ? 297    : 279.4;

  // Exact pixel dimensions at 96 DPI
  //   Letter: 8.5 in × 96 = 816 px,  11 in × 96 = 1056 px
  //   A4:     210 mm × (96/25.4) ≈ 794 px,  297 mm × (96/25.4) ≈ 1123 px
  const targetWidthPx  = isA4 ? 794  : 816;
  const targetHeightPx = isA4 ? 1123 : 1056;

  // 2× scale for crisp high-DPI output
  const SCALE = 2;

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
    // Do NOT fix height here — let html2canvas measure the full multi-page content
    windowWidth: targetWidthPx,
    onclone: (clonedDoc, clonedElement) => {
      // ── Step 1: Move all stylesheets into <head> ────────────────────────
      Array.from(
        clonedDoc.querySelectorAll<HTMLElement>("style, link[rel='stylesheet']")
      ).forEach((s) => {
        if (!clonedDoc.head.contains(s)) clonedDoc.head.appendChild(s);
      });

      // ── Step 2: Isolate the resume element as the only body child ───────
      clonedDoc.body.innerHTML = "";
      clonedDoc.body.style.cssText =
        "margin:0;padding:0;background:#ffffff;width:" + targetWidthPx + "px;";
      clonedDoc.body.appendChild(clonedElement);

      // ── Step 3: Pin the resume element at top-left with exact dimensions ─
      clonedElement.style.cssText = [
        "position:absolute",
        "top:0",
        "left:0",
        `width:${targetWidthPx}px`,
        `min-width:${targetWidthPx}px`,
        `max-width:${targetWidthPx}px`,
        `min-height:${targetHeightPx}px`,
        "height:auto",
        "box-sizing:border-box",
        "margin:0",
        "padding:0",
        "border:none",
        "box-shadow:none",
        "border-radius:0",
        "transform:none",
        "overflow:visible",
      ].join(";");

      // ── Step 4: Expand ResumeRenderer + template roots to full width ─────
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

      // ── Step 5: Apply smart page breaks & round height up to whole pages ──
      const marginPx = margin === "compact" ? 48 : 96;
      const { totalPaperHeight } = applySmartPageBreaks(
        clonedElement,
        targetHeightPx,
        marginPx
      );

      clonedElement.style.height    = `${totalPaperHeight}px`;
      clonedElement.style.minHeight = `${totalPaperHeight}px`;

      if (rendererWrapper) {
        rendererWrapper.style.height    = `${totalPaperHeight}px`;
        rendererWrapper.style.minHeight = `${totalPaperHeight}px`;
        const templateRoot = rendererWrapper.firstElementChild as HTMLElement | null;
        if (templateRoot) {
          templateRoot.style.height    = `${totalPaperHeight}px`;
          templateRoot.style.minHeight = `${totalPaperHeight}px`;
        }
      }

      // ── Step 6: Extend sidebar colour panels to cover all pages ─────────
      extendSidebarFills(clonedElement, totalPaperHeight);

      // ── Step 7: Strip screen-only decorations ────────────────────────────
      clonedElement.querySelectorAll<HTMLElement>("*").forEach((el) => {
        el.style.boxShadow  = "none";
        el.style.textShadow = "none";
      });

      // ── Step 8: Pre-resolve all oklch / color-mix / modern CSS colours ───
      //
      // Tailwind v4 uses oklch() for its entire palette (286+ tokens).
      // html2canvas 1.4.1's CSS parser can't handle oklch/color-mix etc.
      // The postinstall patch now uses getImageData() instead of the broken
      // fillStyle-getter approach, but this pass is an additional safety net:
      // it inlines every element's computed colour as plain rgb/rgba *before*
      // html2canvas parses a single rule.
      resolveAllColors(clonedDoc, clonedElement);
    },
  });

  // ── Build and save PDF ─────────────────────────────────────────────────────
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: isA4 ? "a4" : "letter",
    compress: true,
  });

  const pageCanvasHeight = targetHeightPx * SCALE;

  if (canvas.height <= pageCanvasHeight + 30) {
    // ── Single page ─────────────────────────────────────────────────────────
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, pageWidthMm, pageHeightMm);
  } else {
    // ── Multi-page: slice canvas into page-sized chunks ─────────────────────
    const totalPages = Math.ceil(canvas.height / pageCanvasHeight);

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage(isA4 ? "a4" : "letter", "portrait");

      const sourceY     = page * pageCanvasHeight;
      const sliceHeight = Math.min(pageCanvasHeight, canvas.height - sourceY);

      const pageCanvas  = document.createElement("canvas");
      pageCanvas.width  = canvas.width;
      pageCanvas.height = pageCanvasHeight;

      const ctx = pageCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0, sourceY,
          canvas.width, sliceHeight,
          0, 0,
          canvas.width, sliceHeight   // 1:1 — no stretch
        );
      }

      pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", 0, 0, pageWidthMm, pageHeightMm);
    }
  }

  pdf.save(getPdfFilename(documentTitle, candidateName));
}
