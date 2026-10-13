"use client";

import { use, useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/resume-store";
import type {
  Resume,
  WorkExperience,
  ProjectEntry,
  EducationEntry,
  CertificationEntry,
  SkillCategory,
  ReferenceEntry,
  FontFamily,
  FontSize,
  PaperSize,
  ResumeMargin,
  TemplateId,
} from "@/types/resume";
import {
  FONT_OPTIONS,
  FONT_SIZE_OPTIONS,
  PAPER_SIZE_OPTIONS,
  MARGIN_OPTIONS,
  TEMPLATES,
  RESUME_COLOR_PRESETS,
  templateSupportsPhoto,
} from "@/types/resume";
import { generateId } from "@/lib/sample-data";
import ResumeRenderer from "@/components/templates/ResumeRenderer";
import PageBreakRuler from "@/components/PageBreakRuler";
import { downloadResumeAsPdf } from "@/lib/pdf-export";
import {
  ArrowLeft,
  Download,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  GripVertical,
  Type,
  LayoutTemplate,
  User,
  FileText,
  Briefcase,
  FolderGit2,
  Award,
  GraduationCap,
  Wrench,
  Users,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
  Palette,
  Check,
  Upload,
  ALargeSmall,
  Maximize2,
} from "lucide-react";

// ─── Step Configuration ────────────────────────────────────────────

export type StepKey =
  | "basics"
  | "summary"
  | "experience"
  | "projects"
  | "certs"
  | "education"
  | "skills"
  | "refs";

export interface StepConfig {
  key: StepKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function getStepsForTemplate(templateId?: TemplateId): StepConfig[] {
  switch (templateId) {
    case "modern-sidebar":
      return [
        { key: "basics", label: "Basics & Photo", icon: User },
        { key: "summary", label: "About Me", icon: FileText },
        { key: "education", label: "Education", icon: GraduationCap },
        { key: "experience", label: "Experience", icon: Briefcase },
        { key: "projects", label: "Projects", icon: FolderGit2 },
        { key: "skills", label: "Skills", icon: Wrench },
        { key: "certs", label: "Certifications", icon: Award },
        { key: "refs", label: "References", icon: Users },
      ];

    case "chronological":
      return [
        { key: "basics", label: "Basics", icon: User },
        { key: "summary", label: "Objective", icon: FileText },
        { key: "education", label: "Education", icon: GraduationCap },
        { key: "experience", label: "Work Exp", icon: Briefcase },
        { key: "projects", label: "Volunteer Exp", icon: HeartHandshake },
        { key: "skills", label: "Skills", icon: Wrench },
        { key: "certs", label: "Achievements", icon: Award },
        { key: "refs", label: "References", icon: Users },
      ];

    case "functional":
      return [
        { key: "basics", label: "Basics", icon: User },
        { key: "summary", label: "Objective", icon: FileText },
        { key: "skills", label: "Skills Summary", icon: Wrench },
        { key: "education", label: "Education", icon: GraduationCap },
        { key: "experience", label: "Work Exp", icon: Briefcase },
        { key: "certs", label: "Achievements", icon: Award },
        { key: "refs", label: "References", icon: Users },
      ];

    case "combination":
      return [
        { key: "basics", label: "Basics", icon: User },
        { key: "summary", label: "Objective", icon: FileText },
        { key: "skills", label: "Skills Summary", icon: Wrench },
        { key: "experience", label: "Work Exp", icon: Briefcase },
        { key: "education", label: "Education", icon: GraduationCap },
        { key: "certs", label: "Achievements", icon: Award },
        { key: "refs", label: "References", icon: Users },
      ];

    case "ats-classic":
    case "modern-clean":
    case "creative-bold":
    case "executive":
    default:
      return [
        { key: "basics", label: "Basics", icon: User },
        { key: "summary", label: "Summary", icon: FileText },
        { key: "experience", label: "Experience", icon: Briefcase },
        { key: "projects", label: "Projects", icon: FolderGit2 },
        { key: "certs", label: "Certs", icon: Award },
        { key: "education", label: "Education", icon: GraduationCap },
        { key: "skills", label: "Skills", icon: Wrench },
        { key: "refs", label: "Refs", icon: Users },
      ];
  }
}

// ─── Editor Page ───────────────────────────────────────────────────

export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const {
    resumes,
    setActiveResume,
    updateActiveField,
    updateActiveResume,
  } = useResumeStore();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [colorPickerPos, setColorPickerPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPreviewPage, setCurrentPreviewPage] = useState<number>(1);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const colorButtonRef = useRef<HTMLButtonElement>(null);

  const resume = resumes.find((r) => r.id === id);

  useEffect(() => {
    if (id) setActiveResume(id);
  }, [id, setActiveResume]);

  useEffect(() => {
    if (!showColorPicker) return;
    const handleClose = () => setShowColorPicker(false);
    window.addEventListener("resize", handleClose);
    window.addEventListener("scroll", handleClose, true);
    return () => {
      window.removeEventListener("resize", handleClose);
      window.removeEventListener("scroll", handleClose, true);
    };
  }, [showColorPicker]);

  const toggleColorPicker = useCallback(() => {
    setShowColorPicker((prev) => {
      if (!prev && colorButtonRef.current) {
        const rect = colorButtonRef.current.getBoundingClientRect();
        const left = Math.max(12, Math.min(rect.left, window.innerWidth - 272));
        setColorPickerPos({
          top: rect.bottom + 8,
          left,
        });
      }
      return !prev;
    });
  }, []);

  const paperSize = resume?.settings?.paperSize || "letter";
  const paperOption =
    PAPER_SIZE_OPTIONS.find((p) => p.id === paperSize) || PAPER_SIZE_OPTIONS[0];
  const paperWidth        = paperOption.width;
  const paperMinHeight    = paperOption.height;
  const pageHeightCssPx   = paperOption.pageHeightCssPx;

  const marginSetting = resume?.settings?.margin || "normal";
  const marginOption =
    MARGIN_OPTIONS.find((m) => m.id === marginSetting) || MARGIN_OPTIONS[0];

  const totalPaperHeight = pageCount * pageHeightCssPx;

  const handlePreviewScroll = useCallback(() => {
    if (!previewScrollRef.current) return;
    const scrollTop = previewScrollRef.current.scrollTop;
    const pageIndex = Math.min(
      pageCount,
      Math.max(1, Math.floor((scrollTop + pageHeightCssPx * 0.4) / pageHeightCssPx) + 1)
    );
    setCurrentPreviewPage(pageIndex);
  }, [pageCount, pageHeightCssPx]);

  const scrollToPage = useCallback((targetPage: number) => {
    if (!previewScrollRef.current) return;
    const targetY = (targetPage - 1) * pageHeightCssPx;
    previewScrollRef.current.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }, [pageHeightCssPx]);

  const handleDownloadPDF = useCallback(async () => {
    if (!resume || isExporting) return;
    setIsExporting(true);

    try {
      await downloadResumeAsPdf({
        elementId: "resume-print-target",
        documentTitle: resume.settings.documentTitle,
        candidateName: resume.basics.fullName,
        paperSize: resume.settings.paperSize || "letter",
        margin: resume.settings.margin || "normal",
      });
    } catch (err) {
      console.error("Direct PDF export error, falling back to print:", err);
      // Fallback only if canvas capture encounters a browser error
      window.print();
    } finally {
      setIsExporting(false);
    }
  }, [resume, isExporting]);

  // ─── Field update helper ──────────────────────────────────────

  const updateField = <K extends keyof Resume>(key: K, value: Resume[K]) => {
    updateActiveField(key, value);
  };

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e6e6e6]">
        <div className="clay-card p-8 text-center max-w-sm">
          <p className="text-[#5a5a5e] mb-4 text-sm font-medium">Resume not found</p>
          <button onClick={() => router.push("/")} className="btn-primary text-xs">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const templateId = resume.settings.templateId || "ats-classic";
  const steps = getStepsForTemplate(templateId);
  const safeCurrentStep = Math.min(Math.max(0, currentStep), steps.length - 1);
  const activeStep = steps[safeCurrentStep] || steps[0];

  const activeColor =
    resume.settings.primaryColor ||
    (templateId === "modern-sidebar"
      ? "#111827"
      : templateId === "creative-bold"
      ? "#7c3aed"
      : templateId === "executive"
      ? "#1e293b"
      : "#1e40af");
  const matchedColorPreset = RESUME_COLOR_PRESETS.find(
    (p) => p.hex.toLowerCase() === activeColor.toLowerCase()
  );

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col bg-[#e6e6e6] text-[#1d1d1f] print:static print:h-auto print:overflow-visible print:block">
      {/* Dynamic Print Page Size */}
      <style
        id="resume-print-page-style"
        dangerouslySetInnerHTML={{
          __html: `@page { size: ${paperSize === "a4" ? "A4" : "letter"} portrait; margin: 0; }`,
        }}
      />
      {/* ── Apple Frosted Top Bar ────────────────────────────── */}
      <header className="shrink-0 z-50 apple-frosted-nav border-b border-black/8 print:hidden">
        <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Back & Format Controls Dropdowns */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <button
              onClick={() => router.push("/")}
              className="btn-ghost p-2! rounded-xl shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-[#305CDE]" />
            </button>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {/* Template Selector */}
              <div
                className="flex items-center gap-1.5 bg-white border border-black/8 rounded-xl px-2.5 py-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.03)] shrink-0"
                title="Resume Template: Choose layout structure and design style"
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-[#305CDE] shrink-0" />
                <label htmlFor="top-template-select" className="text-[11px] text-[#86868b] font-medium hidden sm:inline">
                  Template:
                </label>
                <select
                  id="top-template-select"
                  value={resume.settings.templateId || "ats-classic"}
                  onChange={(e) => {
                    const nextTemplateId = e.target.value as TemplateId;
                    const isNextTraditional =
                      nextTemplateId === "chronological" ||
                      nextTemplateId === "functional" ||
                      nextTemplateId === "combination";
                    updateActiveResume({
                      settings: {
                        ...resume.settings,
                        templateId: nextTemplateId,
                        fontFamily:
                          isNextTraditional && resume.settings.fontFamily === "Calibri"
                            ? "Times New Roman"
                            : resume.settings.fontFamily,
                      },
                    });
                  }}
                  className="bg-transparent text-xs font-semibold text-[#1d1d1f] outline-none cursor-pointer"
                  title="Change resume template"
                >
                  {TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id} className="bg-white text-[#1d1d1f]">
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Family Selector */}
              <div
                className="flex items-center gap-1.5 bg-white border border-black/8 rounded-xl px-2.5 py-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.03)] shrink-0"
                title="Font Family: Typography used for the resume"
              >
                <Type className="w-3.5 h-3.5 text-[#305CDE] shrink-0" />
                <label htmlFor="top-font-select" className="text-[11px] text-[#86868b] font-medium hidden sm:inline">
                  Font:
                </label>
                <select
                  id="top-font-select"
                  value={resume.settings.fontFamily || "Calibri"}
                  onChange={(e) =>
                    updateActiveResume({
                      settings: {
                        ...resume.settings,
                        fontFamily: e.target.value as FontFamily,
                      },
                    })
                  }
                  className="bg-transparent text-xs font-semibold text-[#1d1d1f] outline-none cursor-pointer"
                  title="Resume font family"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option
                      key={font.id}
                      value={font.id}
                      className="bg-white text-[#1d1d1f]"
                      style={{ fontFamily: font.cssFamily }}
                    >
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size Selector */}
              <div
                className="flex items-center gap-1.5 bg-white border border-black/8 rounded-xl px-2.5 py-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.03)] shrink-0"
                title="Font Size: Proportional text sizing across the document"
              >
                <ALargeSmall className="w-3.5 h-3.5 text-[#305CDE] shrink-0" />
                <label htmlFor="top-font-size-select" className="text-[11px] text-[#86868b] font-medium hidden sm:inline">
                  Size:
                </label>
                <select
                  id="top-font-size-select"
                  value={resume.settings.fontSize || "base"}
                  onChange={(e) =>
                    updateActiveResume({
                      settings: {
                        ...resume.settings,
                        fontSize: e.target.value as FontSize,
                      },
                    })
                  }
                  className="bg-transparent text-xs font-semibold text-[#1d1d1f] outline-none cursor-pointer"
                  title="Resume font size"
                >
                  {FONT_SIZE_OPTIONS.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      className="bg-white text-[#1d1d1f]"
                      title={`${opt.label} (${opt.bodyPt}pt) — ${opt.description}`}
                    >
                      {opt.bodyPt}pt
                    </option>
                  ))}
                </select>
              </div>

              {/* Paper Size Selector (Letter / A4) */}
              <div
                className="flex items-center gap-1.5 bg-white border border-black/8 rounded-xl px-2.5 py-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.03)] shrink-0"
                title="Paper Format: Choose between Letter (US) or A4 (International)"
              >
                <FileText className="w-3.5 h-3.5 text-[#305CDE] shrink-0" />
                <label htmlFor="top-paper-size-select" className="text-[11px] text-[#86868b] font-medium hidden sm:inline">
                  Paper:
                </label>
                <select
                  id="top-paper-size-select"
                  value={resume.settings.paperSize || "letter"}
                  onChange={(e) =>
                    updateActiveResume({
                      settings: {
                        ...resume.settings,
                        paperSize: e.target.value as PaperSize,
                      },
                    })
                  }
                  className="bg-transparent text-xs font-semibold text-[#1d1d1f] outline-none cursor-pointer"
                  title="Resume paper size (Letter or A4)"
                >
                  {PAPER_SIZE_OPTIONS.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      className="bg-white text-[#1d1d1f]"
                      title={`${opt.name} (${opt.dimensions})`}
                    >
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Margin Selector (Normal 1 in / 2.54 cm vs Compact 0.5 in / 1.27 cm) */}
              <div
                className="flex items-center gap-1.5 bg-white border border-black/8 rounded-xl px-2.5 py-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.03)] shrink-0"
                title="Page Margins: Normal (1 in / 2.54 cm) or Compact (0.5 in / 1.27 cm)"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#305CDE] shrink-0" />
                <label htmlFor="top-margin-select" className="text-[11px] text-[#86868b] font-medium hidden sm:inline">
                  Margin:
                </label>
                <select
                  id="top-margin-select"
                  value={resume.settings.margin || "normal"}
                  onChange={(e) =>
                    updateActiveResume({
                      settings: {
                        ...resume.settings,
                        margin: e.target.value as ResumeMargin,
                      },
                    })
                  }
                  className="bg-transparent text-xs font-semibold text-[#1d1d1f] outline-none cursor-pointer"
                  title="Resume margin: Normal (1 in / 2.54 cm) or Compact (0.5 in / 1.27 cm)"
                >
                  {MARGIN_OPTIONS.map((opt) => (
                    <option
                      key={opt.id}
                      value={opt.id}
                      className="bg-white text-[#1d1d1f]"
                      title={`${opt.label} — ${opt.description}`}
                    >
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Theme Style Selector */}
              <div
                className="relative shrink-0"
                title="Theme Accent Color: Accent color for headers, badges, and lines"
              >
                <button
                  ref={colorButtonRef}
                  type="button"
                  onClick={toggleColorPicker}
                  className="flex items-center gap-1.5 bg-white border border-black/8 rounded-xl px-2.5 py-1.5 shadow-[0_2px_6px_rgba(0,0,0,0.03)] hover:bg-[#fafafc] transition-all cursor-pointer"
                  title="Change theme color style (Modern, Creative, Executive)"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-2xs"
                    style={{ backgroundColor: activeColor }}
                  />
                  <span className="text-[11px] text-[#86868b] font-medium hidden sm:inline">Color:</span>
                  <span className="text-xs font-semibold text-[#1d1d1f] whitespace-nowrap">
                    {matchedColorPreset ? matchedColorPreset.name : "Accent"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#86868b] shrink-0" />
                </button>

              {showColorPicker && typeof document !== "undefined" &&
                createPortal(
                  <>
                    <div
                      className="fixed inset-0 z-999"
                      onClick={() => setShowColorPicker(false)}
                    />
                    <div
                      style={{
                        position: "fixed",
                        top: colorPickerPos.top,
                        left: colorPickerPos.left,
                      }}
                      className="w-64 bg-white rounded-2xl shadow-2xl border border-black/10 p-3.5 z-1000"
                    >
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-[#1d1d1f] flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-[#305CDE]" />
                        Theme Color
                      </span>
                      <span className="text-[10px] text-[#86868b] uppercase tracking-wider font-mono">
                        {activeColor}
                      </span>
                    </div>

                    {/* Preset Swatches */}
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {RESUME_COLOR_PRESETS.map((preset) => {
                        const isSelected =
                          activeColor.toLowerCase() === preset.hex.toLowerCase();
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              updateActiveResume({
                                settings: {
                                  ...resume.settings,
                                  primaryColor: preset.hex,
                                },
                              });
                              setShowColorPicker(false);
                            }}
                            className={`group flex flex-col items-center p-1.5 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? "border-[#305CDE] bg-[#305CDE]/8 shadow-xs"
                                : "border-black/5 hover:border-black/15 hover:bg-[#fafafc]"
                            }`}
                            title={preset.name}
                          >
                            <span
                              className="w-6 h-6 rounded-full border border-black/15 shadow-2xs flex items-center justify-center transition-transform group-hover:scale-105"
                              style={{ backgroundColor: preset.hex }}
                            >
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                              )}
                            </span>
                            <span className="text-[10px] text-[#5a5a5e] mt-1 font-medium truncate max-w-full text-center">
                              {preset.name.split(" ")[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Color Input */}
                    <div className="pt-2 border-t border-black/6 flex items-center justify-between">
                      <label className="text-xs text-[#5a5a5e] font-medium flex items-center gap-2 cursor-pointer">
                        <input
                          type="color"
                          value={activeColor.startsWith("#") ? activeColor : "#1e40af"}
                          onChange={(e) =>
                            updateActiveResume({
                              settings: {
                                ...resume.settings,
                                primaryColor: e.target.value,
                              },
                            })
                          }
                          className="w-6 h-6 rounded-md border border-black/10 cursor-pointer p-0 bg-transparent"
                        />
                        <span>Custom Color</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const defaultCol =
                            templateId === "modern-sidebar"
                              ? "#111827"
                              : templateId === "creative-bold"
                              ? "#7c3aed"
                              : templateId === "executive"
                              ? "#1e293b"
                              : "#1e40af";
                          updateActiveResume({
                            settings: {
                              ...resume.settings,
                              primaryColor: defaultCol,
                            },
                          });
                          setShowColorPicker(false);
                        }}
                        className="text-[10px] text-[#305CDE] hover:underline font-semibold"
                      >
                        Reset
                      </button>
                    </div>
                    </div>
                  </>,
                  document.body
                )}
            </div>
            </div>
          </div>

          {/* Right: Download PDF Action */}
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="btn-primary text-xs px-3.5 sm:px-4 py-1.5 sm:py-2 font-semibold disabled:opacity-75 disabled:cursor-wait flex items-center gap-1.5 shrink-0 shadow-sm whitespace-nowrap cursor-pointer"
            title="Immediately download resume as PDF file"
          >
            {isExporting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ── Apple Step Tabs Navigation (Royal Blue Active) ────── */}
      <nav className="shrink-0 border-b border-black/5 bg-[#e6e6e6]/65 backdrop-blur-md print:hidden">
        <div className="w-full max-w-[1800px] mx-auto px-3 sm:px-4 py-2 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = safeCurrentStep === idx;
            return (
              <button
                key={`${step.key}-${idx}`}
                onClick={() => setCurrentStep(idx)}
                className={`
                  flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0
                  ${
                    isActive
                      ? "bg-linear-to-b from-[#3d6df2] to-[#305CDE] text-white shadow-[0_4px_12px_rgba(48,92,222,0.38)] border border-white/20"
                      : "bg-white text-[#5a5a5e] hover:text-[#305CDE] border border-black/5 shadow-xs"
                  }
                `}
              >
                <span
                  className={`
                    w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                    ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#e6e6e6] text-[#5a5a5e]"
                    }
                  `}
                >
                  {idx + 1}
                </span>
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : "text-[#305CDE]"}`} />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Split Pane ──────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex overflow-hidden print:block print:h-auto print:overflow-visible">
        {/* Left: Pure White Form Highlighted on #e6e6e6 */}
        <div className="w-130 shrink-0 h-full overflow-y-auto p-4 sm:p-5 print:hidden bg-[#e6e6e6]">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.07),inset_0_1.5px_1.5px_#ffffff,inset_0_-2px_4px_rgba(0,0,0,0.03)] border border-white/90">
            <StepForm
              step={activeStep.key}
              templateId={templateId}
              resume={resume}
              updateField={updateField}
              updateActiveResume={updateActiveResume}
            />

            {/* Nav Footer */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-black/6">
              <button
                onClick={() => setCurrentStep(Math.max(0, safeCurrentStep - 1))}
                disabled={safeCurrentStep === 0}
                className="btn-ghost text-xs px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 text-[#305CDE]" />
                <span>Previous</span>
              </button>
              <button
                onClick={() =>
                  setCurrentStep(Math.min(steps.length - 1, safeCurrentStep + 1))
                }
                disabled={safeCurrentStep === steps.length - 1}
                className="btn-primary text-xs px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Preview (Dedicated scroller container) */}
        <div
          ref={previewScrollRef}
          onScroll={handlePreviewScroll}
          className="flex-1 h-full overflow-y-auto bg-[#e6e6e6] print:bg-white print:overflow-visible preview-scroller relative"
        >
          <div id="resume-export-stage" className="p-8 flex justify-center print:p-0">
            {/*
              Wrapper is position:relative so PageBreakRuler can sit as an
              absolutely-positioned sibling of #resume-print-target.
              The ruler is OUTSIDE the capture target so html2canvas never sees it.
            */}
            <div className="relative">
              <div
                id="resume-print-target"
                className="resume-preview-container"
                style={{
                  width: paperWidth,
                  minHeight: `${totalPaperHeight}px`,
                  height: `${totalPaperHeight}px`,
                }}
              >
                <ResumeRenderer data={resume} />
              </div>

              {/* Page-break overlay — purely visual, never exported to PDF */}
              <PageBreakRuler
                targetId="resume-print-target"
                pageHeightPx={pageHeightCssPx}
                marginPx={marginOption.cssPx}
                onPageCountChange={setPageCount}
              />
            </div>
          </div>

          {/* Floating Page Navigator (Clean Apple-like floating pill) */}
          {pageCount > 1 && (
            <div className="sticky bottom-6 left-0 right-0 flex justify-center pointer-events-none pb-2 z-30 print:hidden">
              <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-black/10 shadow-[0_8px_20px_rgba(0,0,0,0.12)] rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-semibold text-[#1d1d1f]">
                <span className="text-[#86868b]">Page</span>
                <span className="text-[#305CDE] font-bold">{currentPreviewPage}</span>
                <span className="text-[#86868b]">of {pageCount}</span>
                <div className="h-3 w-px bg-black/10 mx-1" />
                <button
                  type="button"
                  onClick={() => scrollToPage(currentPreviewPage - 1)}
                  disabled={currentPreviewPage <= 1}
                  className="p-1 hover:bg-black/5 rounded-full text-[#5a5a5e] hover:text-[#1d1d1f] disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Scroll to previous page"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToPage(currentPreviewPage + 1)}
                  disabled={currentPreviewPage >= pageCount}
                  className="p-1 hover:bg-black/5 rounded-full text-[#5a5a5e] hover:text-[#1d1d1f] disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Scroll to next page"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step Forms ────────────────────────────────────────────────────

function StepForm({
  step,
  templateId,
  resume,
  updateField,
  updateActiveResume,
}: {
  step: StepKey;
  templateId: TemplateId;
  resume: Resume;
  updateField: <K extends keyof Resume>(key: K, value: Resume[K]) => void;
  updateActiveResume: (patch: Partial<Resume>) => void;
}) {
  switch (step) {
    case "basics":
      return (
        <BasicsStep
          resume={resume}
          templateId={templateId}
          updateActiveResume={updateActiveResume}
        />
      );
    case "summary":
      return (
        <SummaryStep
          resume={resume}
          templateId={templateId}
          updateField={updateField}
        />
      );
    case "experience":
      return (
        <ExperienceStep
          resume={resume}
          templateId={templateId}
          updateField={updateField}
        />
      );
    case "projects":
      return (
        <ProjectsStep
          resume={resume}
          templateId={templateId}
          updateField={updateField}
        />
      );
    case "certs":
      return (
        <CertsStep
          resume={resume}
          templateId={templateId}
          updateField={updateField}
        />
      );
    case "education":
      return (
        <EducationStep
          resume={resume}
          templateId={templateId}
          updateField={updateField}
        />
      );
    case "skills":
      return (
        <SkillsStep
          resume={resume}
          templateId={templateId}
          updateField={updateField}
        />
      );
    case "refs":
      return (
        <RefsStep
          resume={resume}
          templateId={templateId}
          updateField={updateField}
        />
      );
    default:
      return null;
  }
}

// ─── Shared UI Components ──────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-xs font-semibold text-[#5a5a5e] mb-1.5 block">
      {children}
      {required && <span className="text-[#ef4444] ml-0.5">*</span>}
    </label>
  );
}

function SectionHeader({
  title,
  onAdd,
  addLabel,
}: {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5 pb-2 border-b border-black/5">
      <h2 className="text-base font-bold text-[#1d1d1f] tracking-tight">{title}</h2>
      {onAdd && (
        <button
          onClick={onAdd}
          className="btn-ghost text-xs text-[#305CDE] border-[#305CDE]/20 hover:bg-[#305CDE]/8 px-3 py-1.5 font-semibold"
        >
          <Plus className="w-3.5 h-3.5 text-[#305CDE]" />
          <span>{addLabel || "Add"}</span>
        </button>
      )}
    </div>
  );
}

// ─── Step 1: Basics ────────────────────────────────────────────────

function BasicsStep({
  resume,
  templateId,
  updateActiveResume,
}: {
  resume: Resume;
  templateId: TemplateId;
  updateActiveResume: (patch: Partial<Resume>) => void;
}) {
  const isTraditional =
    templateId === "chronological" ||
    templateId === "functional" ||
    templateId === "combination";

  const [showExtraFields, setShowExtraFields] = useState<boolean>(() =>
    Boolean(
      resume.basics.headline ||
        resume.basics.website ||
        resume.basics.github
    )
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateBasics = (patch: Partial<Resume["basics"]>) => {
    updateActiveResume({ basics: { ...resume.basics, ...patch } });
  };

  return (
    <div>
      {/* Document Title */}
      <div className="mb-6">
        <Label>Document Title</Label>
        <input
          className="input-field"
          value={resume.settings.documentTitle}
          onChange={(e) =>
            updateActiveResume({
              settings: { ...resume.settings, documentTitle: e.target.value },
            })
          }
          placeholder="e.g. Untitled Resume"
        />
      </div>

      {/* ── Profile Photo (Only shown if template supports photos) ── */}
      {templateSupportsPhoto(templateId) && (
        <div className="mb-4 p-2.5 sm:p-3 bg-[#fafafc] rounded-xl border border-black/6">
          <div className="flex items-center gap-3">
            {/* Shrunk Avatar Preview */}
            <div className="relative group shrink-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#305CDE]/80 shadow-2xs bg-white flex items-center justify-center">
                {resume.basics.photoUrl ? (
                  <img
                    src={resume.basics.photoUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f0f2f5] flex items-center justify-center text-gray-400">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-[#1d1d1f] mb-1">
                Profile Photo
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const base64 = event.target?.result as string;
                        updateBasics({ photoUrl: base64 });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#305CDE] hover:bg-[#254ab8] text-white border border-[#305CDE] text-[10px] sm:text-[11px] px-2 py-0.5 sm:px-2.5 sm:py-1 font-medium flex items-center gap-1 cursor-pointer rounded-md shadow-2xs transition-all"
                  title="Upload photo from device"
                >
                  <Upload className="w-3 h-3 text-white" />
                  <span>Upload Photo</span>
                </button>

                {resume.basics.photoUrl && (
                  <button
                    type="button"
                    onClick={() => updateBasics({ photoUrl: "" })}
                    className="bg-white hover:bg-[#fee2e2] text-[#ef4444] border border-[#fca5a5] text-[10px] sm:text-[11px] px-2 py-0.5 sm:px-2.5 sm:py-1 font-medium flex items-center gap-1 cursor-pointer rounded-md shadow-2xs transition-all"
                    title="Remove profile photo"
                  >
                    <Trash2 className="w-3 h-3 text-[#ef4444]" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <SectionHeader title="Personal Information" />

      {isTraditional ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label required>Full Name</Label>
              <input
                className="input-field"
                value={resume.basics.fullName}
                onChange={(e) => updateBasics({ fullName: e.target.value })}
                placeholder="Jane Marie Dela Cruz"
              />
            </div>
            <div className="col-span-2">
              <Label required>Address / Location</Label>
              <input
                className="input-field"
                value={resume.basics.location}
                onChange={(e) => updateBasics({ location: e.target.value })}
                placeholder="123 Mabini St., Sampaloc, Manila, Philippines"
              />
            </div>
            <div>
              <Label required>Phone Number</Label>
              <input
                className="input-field"
                type="tel"
                value={resume.basics.phone}
                onChange={(e) => updateBasics({ phone: e.target.value })}
                placeholder="+63 917 123 4567"
              />
            </div>
            <div>
              <Label required>Email Address</Label>
              <input
                className="input-field"
                type="email"
                value={resume.basics.email}
                onChange={(e) => updateBasics({ email: e.target.value })}
                placeholder="jane.delacruz@email.com"
              />
            </div>
            <div className="col-span-2">
              <Label>LinkedIn Profile (optional)</Label>
              <input
                className="input-field"
                value={resume.basics.linkedin || ""}
                onChange={(e) => updateBasics({ linkedin: e.target.value })}
                placeholder="linkedin.com/in/janedelacruz"
              />
            </div>
          </div>

          {/* Optional extra online links toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowExtraFields(!showExtraFields)}
              className="text-xs font-semibold text-[#305CDE] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {showExtraFields ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              <span>
                {showExtraFields
                  ? "Hide additional online profiles"
                  : "Add headline, website, or GitHub profile"}
              </span>
            </button>

            {showExtraFields && (
              <div className="mt-3 p-3.5 bg-[#fafafc] rounded-2xl border border-black/6 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Professional Headline</Label>
                  <input
                    className="input-field"
                    value={resume.basics.headline || ""}
                    onChange={(e) => updateBasics({ headline: e.target.value })}
                    placeholder="Software Engineer / IT Professional"
                  />
                </div>
                <div>
                  <Label>Website / Portfolio</Label>
                  <input
                    className="input-field"
                    value={resume.basics.website || ""}
                    onChange={(e) => updateBasics({ website: e.target.value })}
                    placeholder="https://yoursite.com"
                  />
                </div>
                <div>
                  <Label>GitHub</Label>
                  <input
                    className="input-field"
                    value={resume.basics.github || ""}
                    onChange={(e) => updateBasics({ github: e.target.value })}
                    placeholder="github.com/yourname"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label required>Full Name</Label>
            <input
              className="input-field"
              value={resume.basics.fullName}
              onChange={(e) => updateBasics({ fullName: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label>Headline</Label>
            <input
              className="input-field"
              value={resume.basics.headline || ""}
              onChange={(e) => updateBasics({ headline: e.target.value })}
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <Label required>Email</Label>
            <input
              className="input-field"
              type="email"
              value={resume.basics.email}
              onChange={(e) => updateBasics({ email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <input
              className="input-field"
              type="tel"
              value={resume.basics.phone}
              onChange={(e) => updateBasics({ phone: e.target.value })}
              placeholder="+1 234 567 890"
            />
          </div>
          <div>
            <Label>Location</Label>
            <input
              className="input-field"
              value={resume.basics.location}
              onChange={(e) => updateBasics({ location: e.target.value })}
              placeholder="City, Country"
            />
          </div>
          <div>
            <Label>Website</Label>
            <input
              className="input-field"
              value={resume.basics.website || ""}
              onChange={(e) => updateBasics({ website: e.target.value })}
              placeholder="https://yoursite.com"
            />
          </div>
          <div>
            <Label>LinkedIn</Label>
            <input
              className="input-field"
              value={resume.basics.linkedin || ""}
              onChange={(e) => updateBasics({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/yourname"
            />
          </div>
          <div>
            <Label>GitHub</Label>
            <input
              className="input-field"
              value={resume.basics.github || ""}
              onChange={(e) => updateBasics({ github: e.target.value })}
              placeholder="github.com/yourname"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 2: Summary ───────────────────────────────────────────────

function SummaryStep({
  resume,
  templateId,
  updateField,
}: {
  resume: Resume;
  templateId: TemplateId;
  updateField: <K extends keyof Resume>(key: K, value: Resume[K]) => void;
}) {
  const isTraditional =
    templateId === "chronological" ||
    templateId === "functional" ||
    templateId === "combination";

  return (
    <div>
      <SectionHeader title={isTraditional ? "Career Objective" : "Professional Summary"} />
      <p className="text-xs text-[#86868b] mb-2 leading-relaxed">
        {isTraditional
          ? "Write a clear, concise statement highlighting your career goals, key competencies, and what you aim to contribute to the role."
          : "Write a concise 2–4 sentence summary highlighting your key strengths and career goals."}
      </p>
      <textarea
        className="input-field min-h-45 resize-y mt-2"
        value={resume.summary}
        onChange={(e) => updateField("summary", e.target.value)}
        placeholder={
          isTraditional
            ? "Motivated and detail-oriented Information Technology graduate seeking an entry-level position to apply technical skills and contribute to organizational success..."
            : "Information Technology graduate specializing in full-stack web development..."
        }
      />
      <div className="flex justify-end mt-1.5">
        <span className="text-[11px] text-[#86868b] font-medium">
          {resume.summary.length} characters
        </span>
      </div>
    </div>
  );
}

// ─── Step 3: Experience ────────────────────────────────────────────

function ExperienceStep({
  resume,
  templateId,
  updateField,
}: {
  resume: Resume;
  templateId: TemplateId;
  updateField: <K extends keyof Resume>(key: K, value: Resume[K]) => void;
}) {
  const isFunctional = templateId === "functional";

  const addExperience = () => {
    const newEntry: WorkExperience = {
      id: generateId(),
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bulletPoints: [""],
    };
    updateField("experience", [...resume.experience, newEntry]);
  };

  const updateExperience = (index: number, patch: Partial<WorkExperience>) => {
    const updated = [...resume.experience];
    updated[index] = { ...updated[index], ...patch };
    updateField("experience", updated);
  };

  const removeExperience = (index: number) => {
    updateField(
      "experience",
      resume.experience.filter((_, i) => i !== index)
    );
  };

  const addBullet = (expIndex: number) => {
    const updated = [...resume.experience];
    updated[expIndex] = {
      ...updated[expIndex],
      bulletPoints: [...updated[expIndex].bulletPoints, ""],
    };
    updateField("experience", updated);
  };

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const updated = [...resume.experience];
    const bullets = [...updated[expIndex].bulletPoints];
    bullets[bulletIndex] = value;
    updated[expIndex] = { ...updated[expIndex], bulletPoints: bullets };
    updateField("experience", updated);
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...resume.experience];
    updated[expIndex] = {
      ...updated[expIndex],
      bulletPoints: updated[expIndex].bulletPoints.filter(
        (_, i) => i !== bulletIndex
      ),
    };
    updateField("experience", updated);
  };

  return (
    <div>
      <SectionHeader
        title={isFunctional ? "Relevant Experience" : "Work Experience"}
        onAdd={addExperience}
        addLabel={isFunctional ? "Add Experience" : "Add Position"}
      />

      {resume.experience.length === 0 && (
        <div className="text-center py-8 px-4 bg-[#fafafc] rounded-2xl border border-dashed border-black/10">
          <Briefcase className="w-8 h-8 text-[#305CDE]/40 mx-auto mb-2" />
          <p className="text-xs text-[#86868b] font-medium">
            {isFunctional
              ? 'No relevant experience added yet. Click "Add Experience" to begin.'
              : 'No work experience added yet. Click "Add Position" to begin.'}
          </p>
        </div>
      )}

      <div className="space-y-5">
        {resume.experience.map((exp, idx) => (
          <div
            key={exp.id}
            className="p-4.5 rounded-2xl bg-[#fafafc] border border-black/8 shadow-xs"
          >
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-[#86868b]" />
                <span className="text-xs font-bold text-[#1d1d1f]">
                  Position {idx + 1}
                </span>
              </div>
              <button
                onClick={() => removeExperience(idx)}
                className="p-1.5 rounded-lg text-[#ef4444] hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete position"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label required>Job Title</Label>
                <input
                  className="input-field"
                  value={exp.role}
                  onChange={(e) => updateExperience(idx, { role: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <Label required>Company</Label>
                <input
                  className="input-field"
                  value={exp.company}
                  onChange={(e) =>
                    updateExperience(idx, { company: e.target.value })
                  }
                  placeholder="Google"
                />
              </div>
              <div>
                <Label>Location</Label>
                <input
                  className="input-field"
                  value={exp.location || ""}
                  onChange={(e) =>
                    updateExperience(idx, { location: e.target.value })
                  }
                  placeholder="City, Country"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Start</Label>
                  <input
                    className="input-field"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(idx, { startDate: e.target.value })
                    }
                    placeholder="Jan 2023"
                  />
                </div>
                <div className="flex-1">
                  <Label>End</Label>
                  <input
                    className="input-field"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(idx, { endDate: e.target.value })
                    }
                    placeholder="Present"
                    disabled={exp.current}
                  />
                </div>
              </div>
            </div>

            {/* Current checkbox */}
            <label className="flex items-center gap-2 mt-3 text-xs font-medium text-[#5a5a5e] cursor-pointer">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) =>
                  updateExperience(idx, {
                    current: e.target.checked,
                    endDate: e.target.checked ? "Present" : exp.endDate,
                  })
                }
                className="rounded accent-[#305CDE] cursor-pointer"
              />
              <span>I currently work here</span>
            </label>

            {/* Bullet Points */}
            <div className="mt-4 pt-3 border-t border-black/5">
              <div className="flex items-center justify-between mb-2">
                <Label>Key Achievements & Responsibilities</Label>
                <button
                  onClick={() => addBullet(idx)}
                  className="text-xs text-[#305CDE] hover:text-[#264bb5] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-[#305CDE]" />
                  <span>Add Bullet</span>
                </button>
              </div>
              <div className="space-y-2">
                {exp.bulletPoints.map((bp, bIdx) => (
                  <div key={bIdx} className="flex gap-2">
                    <textarea
                      className="input-field min-h-12 resize-y flex-1 text-xs"
                      value={bp}
                      onChange={(e) => updateBullet(idx, bIdx, e.target.value)}
                      placeholder="Describe your achievement..."
                    />
                    <button
                      onClick={() => removeBullet(idx, bIdx)}
                      className="p-1.5 self-start rounded-lg text-[#86868b] hover:text-[#ef4444] transition-colors cursor-pointer"
                      title="Remove bullet point"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 4: Projects / Volunteer Experience ──────────────────────

function ProjectsStep({
  resume,
  templateId,
  updateField,
}: {
  resume: Resume;
  templateId: TemplateId;
  updateField: <K extends keyof Resume>(key: K, value: Resume[K]) => void;
}) {
  const isChronological = templateId === "chronological";

  const addProject = () => {
    const newEntry: ProjectEntry = {
      id: generateId(),
      name: "",
      role: "",
      technologies: "",
      link: "",
      startDate: "",
      endDate: "",
      bulletPoints: [""],
    };
    updateField("projects", [...resume.projects, newEntry]);
  };

  const updateProject = (index: number, patch: Partial<ProjectEntry>) => {
    const updated = [...resume.projects];
    updated[index] = { ...updated[index], ...patch };
    updateField("projects", updated);
  };

  const removeProject = (index: number) => {
    updateField(
      "projects",
      resume.projects.filter((_, i) => i !== index)
    );
  };

  const addBullet = (projIndex: number) => {
    const updated = [...resume.projects];
    updated[projIndex] = {
      ...updated[projIndex],
      bulletPoints: [...updated[projIndex].bulletPoints, ""],
    };
    updateField("projects", updated);
  };

  const updateBullet = (projIndex: number, bulletIndex: number, value: string) => {
    const updated = [...resume.projects];
    const bullets = [...updated[projIndex].bulletPoints];
    bullets[bulletIndex] = value;
    updated[projIndex] = { ...updated[projIndex], bulletPoints: bullets };
    updateField("projects", updated);
  };

  const removeBullet = (projIndex: number, bulletIndex: number) => {
    const updated = [...resume.projects];
    updated[projIndex] = {
      ...updated[projIndex],
      bulletPoints: updated[projIndex].bulletPoints.filter(
        (_, i) => i !== bulletIndex
      ),
    };
    updateField("projects", updated);
  };

  return (
    <div>
      <SectionHeader
        title={isChronological ? "Volunteer Experience" : "Projects"}
        onAdd={addProject}
        addLabel={isChronological ? "Add Volunteer Role" : "Add Project"}
      />

      {resume.projects.length === 0 && (
        <div className="text-center py-8 px-4 bg-[#fafafc] rounded-2xl border border-dashed border-black/10">
          {isChronological ? (
            <HeartHandshake className="w-8 h-8 text-[#305CDE]/40 mx-auto mb-2" />
          ) : (
            <FolderGit2 className="w-8 h-8 text-[#305CDE]/40 mx-auto mb-2" />
          )}
          <p className="text-xs text-[#86868b] font-medium">
            {isChronological
              ? 'No volunteer experience added yet. Click "Add Volunteer Role" to showcase community service or leadership.'
              : 'No projects added yet. Click "Add Project" to showcase your work.'}
          </p>
        </div>
      )}

      <div className="space-y-5">
        {resume.projects.map((proj, idx) => (
          <div
            key={proj.id}
            className="p-4.5 rounded-2xl bg-[#fafafc] border border-black/8 shadow-xs"
          >
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold text-[#1d1d1f]">
                {isChronological ? `Volunteer Role ${idx + 1}` : `Project ${idx + 1}`}
              </span>
              <button
                onClick={() => removeProject(idx)}
                className="p-1.5 rounded-lg text-[#ef4444] hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label required>
                  {isChronological ? "Organization / Activity Name" : "Project Name"}
                </Label>
                <input
                  className="input-field"
                  value={proj.name}
                  onChange={(e) => updateProject(idx, { name: e.target.value })}
                  placeholder={isChronological ? "Philippine Red Cross Youth" : "Campus Flow"}
                />
              </div>
              <div>
                <Label>{isChronological ? "Role / Position" : "Role"}</Label>
                <input
                  className="input-field"
                  value={proj.role || ""}
                  onChange={(e) => updateProject(idx, { role: e.target.value })}
                  placeholder={isChronological ? "Volunteer Coordinator" : "Full-Stack Developer"}
                />
              </div>
              <div>
                <Label>{isChronological ? "Cause / Focus (optional)" : "Technologies"}</Label>
                <input
                  className="input-field"
                  value={proj.technologies || ""}
                  onChange={(e) =>
                    updateProject(idx, { technologies: e.target.value })
                  }
                  placeholder={isChronological ? "Community Health & Outreach" : "React, Python, PostgreSQL"}
                />
              </div>
              <div>
                <Label>Link (optional)</Label>
                <input
                  className="input-field"
                  value={proj.link || ""}
                  onChange={(e) => updateProject(idx, { link: e.target.value })}
                  placeholder="https://project.com"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <input
                  className="input-field"
                  value={proj.startDate || ""}
                  onChange={(e) =>
                    updateProject(idx, { startDate: e.target.value })
                  }
                  placeholder="Jan 2024"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <input
                  className="input-field"
                  value={proj.endDate || ""}
                  onChange={(e) =>
                    updateProject(idx, { endDate: e.target.value })
                  }
                  placeholder="Present"
                />
              </div>
            </div>

            {/* Bullet Points */}
            <div className="mt-4 pt-3 border-t border-black/5">
              <div className="flex items-center justify-between mb-2">
                <Label>
                  {isChronological
                    ? "Key Contributions & Responsibilities"
                    : "Project Details & Achievements"}
                </Label>
                <button
                  onClick={() => addBullet(idx)}
                  className="text-xs text-[#305CDE] hover:text-[#264bb5] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-[#305CDE]" />
                  <span>Add Bullet</span>
                </button>
              </div>
              <div className="space-y-2">
                {proj.bulletPoints.map((bp, bIdx) => (
                  <div key={bIdx} className="flex gap-2">
                    <textarea
                      className="input-field min-h-12 resize-y flex-1 text-xs"
                      value={bp}
                      onChange={(e) => updateBullet(idx, bIdx, e.target.value)}
                      placeholder={
                        isChronological
                          ? "Coordinated community outreach programs and volunteer events..."
                          : "Describe what you built..."
                      }
                    />
                    <button
                      onClick={() => removeBullet(idx, bIdx)}
                      className="p-1.5 self-start rounded-lg text-[#86868b] hover:text-[#ef4444] transition-colors cursor-pointer"
                      title="Remove bullet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 5: Certifications / Achievements ─────────────────────────

function CertsStep({
  resume,
  templateId,
  updateField,
}: {
  resume: Resume;
  templateId: TemplateId;
  updateField: <K extends keyof Resume>(key: K, value: Resume[K]) => void;
}) {
  const isTraditional =
    templateId === "chronological" ||
    templateId === "functional" ||
    templateId === "combination";

  const addCert = () => {
    const newEntry: CertificationEntry = {
      id: generateId(),
      name: "",
      issuer: "",
      date: "",
    };
    updateField("certifications", [...resume.certifications, newEntry]);
  };

  const updateCert = (index: number, patch: Partial<CertificationEntry>) => {
    const updated = [...resume.certifications];
    updated[index] = { ...updated[index], ...patch };
    updateField("certifications", updated);
  };

  const removeCert = (index: number) => {
    updateField(
      "certifications",
      resume.certifications.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <SectionHeader
        title={isTraditional ? "Achievements & Awards" : "Certifications"}
        onAdd={addCert}
        addLabel={isTraditional ? "Add Achievement" : "Add Certification"}
      />

      {resume.certifications.length === 0 && (
        <div className="text-center py-8 px-4 bg-[#fafafc] rounded-2xl border border-dashed border-black/10">
          <Award className="w-8 h-8 text-[#305CDE]/40 mx-auto mb-2" />
          <p className="text-xs text-[#86868b] font-medium">
            {isTraditional
              ? 'No achievements added yet. Click "Add Achievement" to include academic honors or awards.'
              : "No certifications added yet."}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {resume.certifications.map((cert, idx) => (
          <div
            key={cert.id}
            className="p-4.5 rounded-2xl bg-[#fafafc] border border-black/8 shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#1d1d1f]">
                {isTraditional ? `Achievement ${idx + 1}` : `Certification ${idx + 1}`}
              </span>
              <button
                onClick={() => removeCert(idx)}
                className="p-1.5 rounded-lg text-[#ef4444] hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label required>
                  {isTraditional ? "Achievement / Award Name" : "Certification Name"}
                </Label>
                <input
                  className="input-field"
                  value={cert.name}
                  onChange={(e) => updateCert(idx, { name: e.target.value })}
                  placeholder={
                    isTraditional
                      ? "Dean's Lister - Academic Excellence Award"
                      : "AWS Solutions Architect"
                  }
                />
              </div>
              <div>
                <Label>{isTraditional ? "Awarding Body / Institution" : "Issuer"}</Label>
                <input
                  className="input-field"
                  value={cert.issuer}
                  onChange={(e) => updateCert(idx, { issuer: e.target.value })}
                  placeholder={
                    isTraditional
                      ? "University of Santo Tomas"
                      : "Amazon Web Services"
                  }
                />
              </div>
              <div>
                <Label>{isTraditional ? "Date / Period" : "Date"}</Label>
                <input
                  className="input-field"
                  value={cert.date}
                  onChange={(e) => updateCert(idx, { date: e.target.value })}
                  placeholder={isTraditional ? "Academic Year 2023–2024" : "July 2024"}
                />
              </div>
              <div className="col-span-2">
                <Label>Link (optional)</Label>
                <input
                  className="input-field"
                  value={cert.link || ""}
                  onChange={(e) => updateCert(idx, { link: e.target.value })}
                  placeholder="https://cert-link.com"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 6: Education ─────────────────────────────────────────────

function EducationStep({
  resume,
  templateId,
  updateField,
}: {
  resume: Resume;
  templateId: TemplateId;
  updateField: <K extends keyof Resume>(key: K, value: Resume[K]) => void;
}) {
  const isTraditional =
    templateId === "chronological" ||
    templateId === "functional" ||
    templateId === "combination";

  const addEdu = () => {
    const newEntry: EducationEntry = {
      id: generateId(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
    };
    updateField("education", [...resume.education, newEntry]);
  };

  const updateEdu = (index: number, patch: Partial<EducationEntry>) => {
    const updated = [...resume.education];
    updated[index] = { ...updated[index], ...patch };
    updateField("education", updated);
  };

  const removeEdu = (index: number) => {
    updateField(
      "education",
      resume.education.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <SectionHeader title="Education" onAdd={addEdu} addLabel="Add Education" />

      {resume.education.length === 0 && (
        <div className="text-center py-8 px-4 bg-[#fafafc] rounded-2xl border border-dashed border-black/10">
          <GraduationCap className="w-8 h-8 text-[#305CDE]/40 mx-auto mb-2" />
          <p className="text-xs text-[#86868b] font-medium">
            No education added yet.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {resume.education.map((edu, idx) => (
          <div
            key={edu.id}
            className="p-4.5 rounded-2xl bg-[#fafafc] border border-black/8 shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#1d1d1f]">
                Education {idx + 1}
              </span>
              <button
                onClick={() => removeEdu(idx)}
                className="p-1.5 rounded-lg text-[#ef4444] hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete education"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label required>Institution</Label>
                <input
                  className="input-field"
                  value={edu.institution}
                  onChange={(e) =>
                    updateEdu(idx, { institution: e.target.value })
                  }
                  placeholder={
                    isTraditional
                      ? "Polytechnic University of the Philippines"
                      : "University of Example"
                  }
                />
              </div>
              <div>
                <Label required>Degree</Label>
                <input
                  className="input-field"
                  value={edu.degree}
                  onChange={(e) => updateEdu(idx, { degree: e.target.value })}
                  placeholder={
                    isTraditional
                      ? "Bachelor of Science in Information Technology"
                      : "Bachelor of Science"
                  }
                />
              </div>
              <div>
                <Label>Field of Study</Label>
                <input
                  className="input-field"
                  value={edu.fieldOfStudy || ""}
                  onChange={(e) =>
                    updateEdu(idx, { fieldOfStudy: e.target.value })
                  }
                  placeholder={
                    isTraditional ? "Major in Software Development" : "Computer Science"
                  }
                />
              </div>
              <div>
                <Label>Location</Label>
                <input
                  className="input-field"
                  value={edu.location || ""}
                  onChange={(e) => updateEdu(idx, { location: e.target.value })}
                  placeholder={isTraditional ? "Manila, Philippines" : "City, Country"}
                />
              </div>
              <div>
                <Label>GWA / Honors (optional)</Label>
                <input
                  className="input-field"
                  value={edu.gpa || ""}
                  onChange={(e) => updateEdu(idx, { gpa: e.target.value })}
                  placeholder={isTraditional ? "GWA: 1.25 (Magna Cum Laude)" : "GWA: 1.25 or With Honors"}
                />
              </div>
              <div>
                <Label>Start Year</Label>
                <input
                  className="input-field"
                  value={edu.startDate || ""}
                  onChange={(e) =>
                    updateEdu(idx, { startDate: e.target.value })
                  }
                  placeholder="2020"
                />
              </div>
              <div>
                <Label>End Year</Label>
                <input
                  className="input-field"
                  value={edu.endDate || ""}
                  onChange={(e) => updateEdu(idx, { endDate: e.target.value })}
                  placeholder="2024"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 7: Skills / Skills Summary ───────────────────────────────

function SkillsStep({
  resume,
  templateId,
  updateField,
}: {
  resume: Resume;
  templateId: TemplateId;
  updateField: <K extends keyof Resume>(key: K, value: Resume[K]) => void;
}) {
  const isSkillsSummary =
    templateId === "functional" || templateId === "combination";

  const addCategory = () => {
    const newEntry: SkillCategory = {
      id: generateId(),
      category: "",
      skills: [""],
    };
    updateField("skills", [...resume.skills, newEntry]);
  };

  const updateCategory = (index: number, patch: Partial<SkillCategory>) => {
    const updated = [...resume.skills];
    updated[index] = { ...updated[index], ...patch };
    updateField("skills", updated);
  };

  const removeCategory = (index: number) => {
    updateField(
      "skills",
      resume.skills.filter((_, i) => i !== index)
    );
  };

  const updateSkills = (catIndex: number, skillsStr: string) => {
    const updated = [...resume.skills];
    updated[catIndex] = {
      ...updated[catIndex],
      skills: skillsStr.split(",").map((s) => s.trim()),
    };
    updateField("skills", updated);
  };

  return (
    <div>
      <SectionHeader
        title={isSkillsSummary ? "Skills Summary" : "Skills"}
        onAdd={addCategory}
        addLabel={isSkillsSummary ? "Add Skill Category" : "Add Category"}
      />

      {resume.skills.length === 0 && (
        <div className="text-center py-8 px-4 bg-[#fafafc] rounded-2xl border border-dashed border-black/10">
          <Wrench className="w-8 h-8 text-[#305CDE]/40 mx-auto mb-2" />
          <p className="text-xs text-[#86868b] font-medium">
            {isSkillsSummary
              ? 'No skill categories added yet. Click "Add Skill Category" to organize your functional competencies.'
              : 'No skills added yet. Click "Add Category" to organize your skills.'}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {resume.skills.map((cat, idx) => (
          <div
            key={cat.id}
            className="p-4.5 rounded-2xl bg-[#fafafc] border border-black/8 shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#1d1d1f]">
                Category {idx + 1}
              </span>
              <button
                onClick={() => removeCategory(idx)}
                className="p-1.5 rounded-lg text-[#ef4444] hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <Label required>Category Name</Label>
                <input
                  className="input-field"
                  value={cat.category}
                  onChange={(e) =>
                    updateCategory(idx, { category: e.target.value })
                  }
                  placeholder={
                    isSkillsSummary
                      ? "e.g. Core Technical Proficiencies, Leadership & Management"
                      : "e.g. Languages, Frameworks, Tools"
                  }
                />
              </div>
              <div>
                <Label>Skills (comma-separated)</Label>
                <input
                  className="input-field"
                  value={cat.skills.join(", ")}
                  onChange={(e) => updateSkills(idx, e.target.value)}
                  placeholder={
                    isSkillsSummary
                      ? "System Analysis, Agile Management, UI/UX Design"
                      : "TypeScript, React, Node.js, PostgreSQL"
                  }
                />
              </div>
              {/* Tags preview */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cat.skills
                  .filter((s) => s.trim())
                  .map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#305CDE]/10 text-[#305CDE] border border-[#305CDE]/20 font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 8: References ────────────────────────────────────────────

function RefsStep({
  resume,
  templateId,
  updateField,
}: {
  resume: Resume;
  templateId: TemplateId;
  updateField: <K extends keyof Resume>(key: K, value: Resume[K]) => void;
}) {
  const isTraditional =
    templateId === "chronological" ||
    templateId === "functional" ||
    templateId === "combination";

  const addRef = () => {
    const newEntry: ReferenceEntry = {
      id: generateId(),
      name: "",
      title: "",
      company: "",
      contact: "",
    };
    updateField("references", [...resume.references, newEntry]);
  };

  const updateRef = (index: number, patch: Partial<ReferenceEntry>) => {
    const updated = [...resume.references];
    updated[index] = { ...updated[index], ...patch };
    updateField("references", updated);
  };

  const removeRef = (index: number) => {
    updateField(
      "references",
      resume.references.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <SectionHeader
        title={isTraditional ? "Character References" : "References"}
        onAdd={addRef}
        addLabel="Add Reference"
      />

      {resume.references.length === 0 && (
        <div className="text-center py-8 px-4 bg-[#fafafc] rounded-2xl border border-dashed border-black/10">
          <Users className="w-8 h-8 text-[#305CDE]/40 mx-auto mb-2" />
          <p className="text-xs text-[#86868b] font-medium">
            {isTraditional
              ? 'No character references added yet. Click "Add Reference" to include professors, advisers, or former managers.'
              : "No references added yet. This section is optional."}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {resume.references.map((ref, idx) => (
          <div
            key={ref.id}
            className="p-4.5 rounded-2xl bg-[#fafafc] border border-black/8 shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#1d1d1f]">
                {isTraditional ? `Character Reference ${idx + 1}` : `Reference ${idx + 1}`}
              </span>
              <button
                onClick={() => removeRef(idx)}
                className="p-1.5 rounded-lg text-[#ef4444] hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete reference"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label required>Name</Label>
                <input
                  className="input-field"
                  value={ref.name}
                  onChange={(e) => updateRef(idx, { name: e.target.value })}
                  placeholder={isTraditional ? "Engr. Roberto Santos, PECE" : "Jane Smith"}
                />
              </div>
              <div>
                <Label>Title</Label>
                <input
                  className="input-field"
                  value={ref.title}
                  onChange={(e) => updateRef(idx, { title: e.target.value })}
                  placeholder={
                    isTraditional
                      ? "Department Chair & Professor"
                      : "Engineering Manager"
                  }
                />
              </div>
              <div>
                <Label>Company / Organization</Label>
                <input
                  className="input-field"
                  value={ref.company}
                  onChange={(e) => updateRef(idx, { company: e.target.value })}
                  placeholder={isTraditional ? "College of Engineering" : "Acme Corp"}
                />
              </div>
              <div>
                <Label>Contact Info</Label>
                <input
                  className="input-field"
                  value={ref.contact}
                  onChange={(e) => updateRef(idx, { contact: e.target.value })}
                  placeholder={
                    isTraditional
                      ? "+63 917 890 1234 / rsantos@univ.edu.ph"
                      : "jane@acme.com"
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
