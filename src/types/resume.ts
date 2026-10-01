// ─── Resume Data Model ─────────────────────────────────────────────
// Single source of truth. Every template component receives this shape.

export interface ResumeBasics {
  fullName: string;
  headline?: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photoUrl?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bulletPoints: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  role?: string;
  technologies?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  bulletPoints: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export interface ReferenceEntry {
  id: string;
  name: string;
  title: string;
  company: string;
  contact: string;
}

// ─── Template Definitions ──────────────────────────────────────────

export type TemplateId =
  | "ats-classic"
  | "modern-clean"
  | "modern-sidebar"
  | "creative-bold"
  | "executive"
  | "chronological"
  | "functional"
  | "combination";

export type TemplateCategory =
  | "ATS-Friendly"
  | "Modern"
  | "Creative"
  | "Executive";

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  category: TemplateCategory;
  description: string;
  tags: string[];
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "modern-sidebar",
    name: "Modern Sidebar",
    category: "Modern",
    description:
      "Bold two-column layout with a stylish round profile photo, silver contact and skills badges, and modern pill section headers.",
    tags: ["Photo", "Two-Column", "Modern", "Creative"],
  },
  {
    id: "chronological",
    name: "Chronological",
    category: "ATS-Friendly",
    description:
      "Classic academic and professional layout organized chronologically with clear divider lines. Emphasizes education, work history, volunteerism, and achievements.",
    tags: ["ATS-Friendly", "Chronological", "Traditional", "Academic"],
  },
  {
    id: "functional",
    name: "Functional",
    category: "ATS-Friendly",
    description:
      "Skills-focused resume layout highlighting categorized core competencies and achievements before brief relevant experience. Ideal for students and career switchers.",
    tags: ["ATS-Friendly", "Functional", "Skills-Based"],
  },
  {
    id: "combination",
    name: "Combination",
    category: "ATS-Friendly",
    description:
      "Balanced hybrid layout combining an in-depth categorized Skills Summary with full chronological work experience and education.",
    tags: ["ATS-Friendly", "Combination", "Hybrid"],
  },
  {
    id: "ats-classic",
    name: "ATS Classic",
    category: "ATS-Friendly",
    description:
      "Clean single-column layout optimized for Applicant Tracking Systems. Standard fonts, semantic headings, zero graphics.",
    tags: ["ATS-Friendly", "Single Column", "Professional"],
  },
  {
    id: "modern-clean",
    name: "Modern Clean",
    category: "Modern",
    description:
      "Contemporary two-column design with a subtle sidebar for skills and contact info. Accent color header.",
    tags: ["Modern", "Two Column", "Sidebar"],
  },
  {
    id: "creative-bold",
    name: "Creative Bold",
    category: "Creative",
    description:
      "Bold typography with unique section arrangements and visual flair for design-oriented roles.",
    tags: ["Creative", "Bold", "Design"],
  },
  {
    id: "executive",
    name: "Executive",
    category: "Executive",
    description:
      "Refined minimal layout with high-contrast serif typography. Elegant horizontal dividers for senior professionals.",
    tags: ["Executive", "Minimal", "Serif"],
  },
];

// ─── Color Preset Definitions ──────────────────────────────────────

export interface ColorPreset {
  id: string;
  name: string;
  hex: string;
}

export const RESUME_COLOR_PRESETS: ColorPreset[] = [
  { id: "black", name: "Onyx Black", hex: "#111827" },
  { id: "navy", name: "Navy Blue", hex: "#1e40af" },
  { id: "royal", name: "Royal Blue", hex: "#2563eb" },
  { id: "slate", name: "Slate Charcoal", hex: "#334155" },
  { id: "emerald", name: "Emerald Green", hex: "#065f46" },
  { id: "teal", name: "Deep Teal", hex: "#0f766e" },
  { id: "burgundy", name: "Burgundy", hex: "#881337" },
  { id: "purple", name: "Deep Purple", hex: "#581c87" },
];

// ─── Font Definitions ──────────────────────────────────────────────

export type FontFamily =
  | "Calibri"
  | "Arial"
  | "Georgia"
  | "Cambria"
  | "Times New Roman"
  | "Aptos"
  | "font-sans"
  | "font-serif"
  | "font-mono";

export interface FontOption {
  id: "Calibri" | "Arial" | "Georgia" | "Cambria" | "Times New Roman" | "Aptos";
  name: string;
  category: "Sans-Serif" | "Serif";
  cssFamily: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "Calibri",
    name: "Calibri",
    category: "Sans-Serif",
    cssFamily: 'Calibri, Carlito, "Segoe UI", Candara, Arial, sans-serif',
  },
  {
    id: "Arial",
    name: "Arial",
    category: "Sans-Serif",
    cssFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  },
  {
    id: "Times New Roman",
    name: "Times New Roman",
    category: "Serif",
    cssFamily: '"Times New Roman", Times, Georgia, Cambria, serif',
  },
  {
    id: "Georgia",
    name: "Georgia",
    category: "Serif",
    cssFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
  },
  {
    id: "Cambria",
    name: "Cambria",
    category: "Serif",
    cssFamily: 'Cambria, Caladea, Georgia, "Times New Roman", Times, serif',
  },
  {
    id: "Aptos",
    name: "Aptos",
    category: "Sans-Serif",
    cssFamily: 'Aptos, "Segoe UI", Calibri, "Inter", Arial, sans-serif',
  },
];

export function getFontFamilyCss(font?: string): string {
  switch (font) {
    case "Arial":
      return 'Arial, "Helvetica Neue", Helvetica, sans-serif';
    case "Times New Roman":
      return '"Times New Roman", Times, Georgia, Cambria, serif';
    case "Georgia":
      return 'Georgia, Cambria, "Times New Roman", Times, serif';
    case "Cambria":
      return 'Cambria, Caladea, Georgia, "Times New Roman", Times, serif';
    case "Aptos":
      return 'Aptos, "Segoe UI", Calibri, "Inter", Arial, sans-serif';
    case "font-serif":
      return '"Times New Roman", Times, Georgia, Cambria, serif';
    case "font-mono":
      return '"JetBrains Mono", monospace';
    case "Calibri":
    case "font-sans":
    default:
      return 'Calibri, Carlito, "Segoe UI", Candara, Arial, sans-serif';
  }
}

// ─── Font Size Definitions ─────────────────────────────────────────

export type FontSize = "sm" | "base" | "lg";

export interface FontSizeOption {
  id: FontSize;
  label: string;
  description: string;
  bodyPt: number;
}

export const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { id: "sm", label: "Small", description: "10pt body — fits more content", bodyPt: 10 },
  { id: "base", label: "Standard", description: "11pt body — recommended", bodyPt: 11 },
  { id: "lg", label: "Large", description: "12pt body — easy to read", bodyPt: 12 },
];

/**
 * Returns a unitless scale factor (relative to an 11pt baseline)
 * that templates multiply against every hard-coded `pt` value.
 *
 *   sm  → 10/11 ≈ 0.909
 *   base → 1.0
 *   lg  → 12/11 ≈ 1.091
 */
export function getResumeFontSizeScale(size?: FontSize): number {
  switch (size) {
    case "sm":
      return 10 / 11;
    case "lg":
      return 12 / 11;
    case "base":
    default:
      return 1;
  }
}

// ─── Paper Size Definitions ────────────────────────────────────────

export type PaperSize = "letter" | "a4";

export interface PaperSizeOption {
  id: PaperSize;
  name: string;
  dimensions: string;
  width: string;
  height: string;
}

export const PAPER_SIZE_OPTIONS: PaperSizeOption[] = [
  {
    id: "letter",
    name: "Letter",
    dimensions: '8.5" × 11"',
    width: "8.5in",
    height: "11in",
  },
  {
    id: "a4",
    name: "A4",
    dimensions: "210 × 297 mm",
    width: "210mm",
    height: "297mm",
  },
];

// ─── Resume Settings ───────────────────────────────────────────────

export interface ResumeSettings {
  templateId: TemplateId;
  fontFamily: FontFamily;
  fontSize: "sm" | "base" | "lg";
  paperSize?: PaperSize;
  primaryColor: string;
  documentTitle: string;
}

// ─── Top-Level Resume Object ───────────────────────────────────────

export interface Resume {
  id: string;
  createdAt: string;
  updatedAt: string;
  settings: ResumeSettings;
  basics: ResumeBasics;
  summary: string;
  experience: WorkExperience[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  education: EducationEntry[];
  skills: SkillCategory[];
  references: ReferenceEntry[];
}
