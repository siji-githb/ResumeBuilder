"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/resume-store";
import {
  TEMPLATES,
  type TemplateId,
  type TemplateCategory,
  type TemplateDefinition,
  RESUME_COLOR_PRESETS,
} from "@/types/resume";
import { getSampleResumeForTemplate } from "@/lib/sample-data";
import ResumeRenderer from "@/components/templates/ResumeRenderer";
import { ArrowLeft, Check, X, ShieldCheck, Palette, PenTool, Crown, Eye } from "lucide-react";

const CATEGORY_ALL = "All" as const;
type FilterCategory = typeof CATEGORY_ALL | TemplateCategory;

const CATEGORY_TABS: { label: FilterCategory; icon: React.ReactNode }[] = [
  { label: "All", icon: null },
  { label: "ATS-Friendly", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { label: "Modern", icon: <Palette className="w-3.5 h-3.5" /> },
  { label: "Creative", icon: <PenTool className="w-3.5 h-3.5" /> },
  { label: "Executive", icon: <Crown className="w-3.5 h-3.5" /> },
];

export default function TemplateGalleryPage() {
  const router = useRouter();
  const { createResume, setActiveResume } = useResumeStore();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");
  const [previewTemplate, setPreviewTemplate] =
    useState<TemplateDefinition | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const filtered =
    activeFilter === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeFilter);

  const handleUseTemplate = (templateId: TemplateId, color?: string) => {
    const newId = createResume(templateId, color);
    setActiveResume(newId);
    router.push(`/editor/${newId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e6e6e6] text-[#1d1d1f]">
      {/* ── Apple Frosted Header ──────────────────────────────── */}
      <header className="sticky top-0 z-50 apple-frosted-nav">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="btn-ghost p-2! rounded-xl shrink-0"
            id="back-to-dashboard"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-[#305CDE]" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#1d1d1f] tracking-tight">
              Choose a Template
            </h1>
            <p className="text-xs text-[#86868b] -mt-0.5">
              Select a design to start your resume. You can switch anytime.
            </p>
          </div>
        </div>
      </header>

      {/* ── Category Filter Tabs (Apple Pill Bar) ─────────────── */}
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-2 flex gap-2 overflow-x-auto w-full">
          {CATEGORY_TABS.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setActiveFilter(label)}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold
                transition-all duration-200 cursor-pointer
                ${
                  activeFilter === label
                    ? "bg-linear-to-b from-[#3d6df2] to-[#305CDE] text-white shadow-[0_4px_12px_rgba(48,92,222,0.35)] border border-white/20"
                    : "bg-white text-[#5a5a5e] hover:text-[#305CDE] hover:bg-white/90 border border-black/5 shadow-xs"
                }
              `}
            >
              {icon && <span className={activeFilter === label ? "text-white" : "text-[#305CDE]"}>{icon}</span>}
              <span>{label}</span>
            </button>
          ))}
        </div>

      {/* ── Template Grid ───────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
          {filtered.map((template) => (
            <div
              key={template.id}
              className="clay-card group flex flex-col overflow-hidden cursor-pointer"
              onClick={() => setPreviewTemplate(template)}
            >
              {/* Mini Preview Window */}
              <div className="relative bg-white overflow-hidden border-b border-black/5" style={{ height: "230px" }}>
                <div
                  className="origin-top-left"
                  style={{
                    transform: "scale(0.28)",
                    width: "8.5in",
                    minHeight: "11in",
                    pointerEvents: "none",
                  }}
                >
                  <ResumeRenderer
                    data={getSampleResumeForTemplate(template.id)}
                    templateId={template.id}
                  />
                </div>
                {/* Hover overlay with preview prompt */}
                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <span className="text-xs font-semibold text-[#1d1d1f] px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#305CDE]" />
                    Quick Preview
                  </span>
                </div>
              </div>

              {/* Card Body & Footer */}
              <div className="p-4 bg-white flex flex-col flex-1 justify-between">
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-sm font-bold text-[#1d1d1f] tracking-tight">
                      {template.name}
                    </h3>
                    <span className="shrink-0 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#305CDE]/10 text-[#305CDE] border border-[#305CDE]/20">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#5a5a5e] leading-relaxed flex-1">
                    {template.description}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template.id);
                  }}
                  className="btn-primary w-full mt-4 justify-center text-xs py-2! whitespace-nowrap"
                  id={`use-template-${template.id}`}
                >
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Use This Template</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Full-Screen Preview Modal (Apple Clay Modal) ─────── */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-100 bg-black/40 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => {
            setPreviewTemplate(null);
            setSelectedColor(null);
          }}
        >
          <div
            className="relative bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] max-w-4xl w-full max-h-[92vh] overflow-hidden animate-scale-in flex flex-col border border-white/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-black/5 bg-[#fafafa] gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#1d1d1f]">
                    {previewTemplate.name}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#305CDE]/10 text-[#305CDE] border border-[#305CDE]/20">
                    {previewTemplate.category}
                  </span>
                </div>
                <p className="text-xs text-[#86868b] mt-0.5">
                  {previewTemplate.description}
                </p>

                {/* Color swatches for color-customizable templates */}
                {(previewTemplate.id === "modern-sidebar" ||
                  previewTemplate.id === "modern-clean" ||
                  previewTemplate.id === "creative-bold" ||
                  previewTemplate.id === "executive") && (
                  <div className="flex items-center gap-2 mt-2 pt-1 border-t border-black/5">
                    <span className="text-[11px] font-bold text-[#1d1d1f]">
                      Style Color:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {RESUME_COLOR_PRESETS.map((preset) => {
                        const sample = getSampleResumeForTemplate(previewTemplate.id);
                        const currentHex =
                          selectedColor ||
                          sample.settings.primaryColor ||
                          (previewTemplate.id === "modern-sidebar" ? "#111827" : "#1e40af");
                        const isSelected =
                          currentHex.toLowerCase() === preset.hex.toLowerCase();
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setSelectedColor(preset.hex)}
                            className={`w-5 h-5 rounded-full border border-black/15 shadow-2xs transition-transform flex items-center justify-center cursor-pointer ${
                              isSelected
                                ? "scale-115 ring-2 ring-[#305CDE] ring-offset-1"
                                : "hover:scale-110"
                            }`}
                            style={{ backgroundColor: preset.hex }}
                            title={preset.name}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                <button
                  onClick={() =>
                    handleUseTemplate(
                      previewTemplate.id,
                      selectedColor || undefined
                    )
                  }
                  className="btn-primary text-xs px-4 py-2 shrink-0 whitespace-nowrap"
                >
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Use This Template</span>
                </button>
                <button
                  onClick={() => {
                    setPreviewTemplate(null);
                    setSelectedColor(null);
                  }}
                  className="btn-ghost p-2! rounded-xl shrink-0"
                  title="Close preview"
                >
                  <X className="w-4 h-4 text-[#86868b]" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable Resume Sheet */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#e6e6e6]">
              <div className="resume-preview-container mx-auto" style={{ width: "8.5in" }}>
                {(() => {
                  const sample = getSampleResumeForTemplate(previewTemplate.id);
                  const displaySample = selectedColor
                    ? {
                        ...sample,
                        settings: {
                          ...sample.settings,
                          primaryColor: selectedColor,
                        },
                      }
                    : sample;
                  return (
                    <ResumeRenderer
                      data={displaySample}
                      templateId={previewTemplate.id}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
