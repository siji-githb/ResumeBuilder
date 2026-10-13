"use client";

import type { Resume, TemplateId } from "@/types/resume";
import {
  getFontFamilyCss,
  getResumeFontSizeScale,
  MARGIN_OPTIONS,
} from "@/types/resume";
import AtsClassicTemplate from "@/components/templates/AtsClassicTemplate";
import ModernCleanTemplate from "@/components/templates/ModernCleanTemplate";
import ModernSidebarTemplate from "@/components/templates/ModernSidebarTemplate";
import CreativeBoldTemplate from "@/components/templates/CreativeBoldTemplate";
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate";
import ChronologicalTemplate from "@/components/templates/ChronologicalTemplate";
import FunctionalTemplate from "@/components/templates/FunctionalTemplate";
import CombinationTemplate from "@/components/templates/CombinationTemplate";

interface Props {
  data: Resume;
  templateId?: TemplateId;
}

/**
 * Dispatches to the correct template component based on the
 * resume's settings.templateId (or an override prop).
 *
 * Sets:
 * - `--r-scale`: Proportional font scaling
 * - `--r-margin`: User-selected margin (1in / 2.54cm or 0.5in / 1.27cm)
 * - `--r-margin-px`: Margin in CSS pixels (96 or 48)
 */
export default function ResumeRenderer({ data, templateId }: Props) {
  const id = templateId ?? data.settings.templateId;
  const fontCss = getFontFamilyCss(data.settings.fontFamily);
  const scale = getResumeFontSizeScale(data.settings.fontSize);

  const marginSetting = data.settings.margin || "normal";
  const marginOption =
    MARGIN_OPTIONS.find((m) => m.id === marginSetting) || MARGIN_OPTIONS[0];

  const renderTemplate = () => {
    switch (id) {
      case "modern-sidebar":
        return <ModernSidebarTemplate data={data} />;
      case "chronological":
        return <ChronologicalTemplate data={data} />;
      case "functional":
        return <FunctionalTemplate data={data} />;
      case "combination":
        return <CombinationTemplate data={data} />;
      case "ats-classic":
        return <AtsClassicTemplate data={data} />;
      case "modern-clean":
        return <ModernCleanTemplate data={data} />;
      case "creative-bold":
        return <CreativeBoldTemplate data={data} />;
      case "executive":
        return <ExecutiveTemplate data={data} />;
      default:
        return <AtsClassicTemplate data={data} />;
    }
  };

  return (
    <div
      style={
        {
          fontFamily: fontCss,
          "--r-scale": scale,
          "--r-margin": marginOption.cssValue,
          "--r-margin-px": `${marginOption.cssPx}px`,
        } as React.CSSProperties
      }
      className="w-full"
    >
      {renderTemplate()}
    </div>
  );
}
