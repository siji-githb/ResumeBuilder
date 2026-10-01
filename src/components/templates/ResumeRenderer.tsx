"use client";

import type { Resume, TemplateId } from "@/types/resume";
import { getFontFamilyCss, getResumeFontSizeScale } from "@/types/resume";
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
 * Sets `--r-scale` CSS variable so every template can use
 * `calc(Xpt * var(--r-scale))` for proportional font scaling.
 */
export default function ResumeRenderer({ data, templateId }: Props) {
  const id = templateId ?? data.settings.templateId;
  const fontCss = getFontFamilyCss(data.settings.fontFamily);
  const scale = getResumeFontSizeScale(data.settings.fontSize);

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
        } as React.CSSProperties
      }
      className="w-full"
    >
      {renderTemplate()}
    </div>
  );
}
