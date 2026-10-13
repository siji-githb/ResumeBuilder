"use client";

import type { Resume } from "@/types/resume";

interface Props {
  data: Resume;
}

/* ── Scaled pt helper ────────────────────────────────────────────── */
const s = (pt: number) => `calc(${pt}pt * var(--r-scale, 1))`;

/**
 * Executive Template
 *
 * Refined, high-contrast serif layout with elegant horizontal
 * dividers and generous whitespace for senior professionals.
 */
export default function ExecutiveTemplate({ data }: Props) {
  const { basics, summary, experience, projects, certifications, education, skills, references } = data;
  const accent = data.settings.primaryColor || "#1e293b";

  return (
    <div
      className="executive leading-normal text-gray-900 bg-white w-full min-h-full"
      style={{ padding: "var(--r-margin, 1in)", fontSize: s(10.5) }}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="text-center mb-6">
        <h1
          className="font-normal tracking-[0.15em] uppercase"
          style={{ color: accent, fontSize: s(26) }}
        >
          {basics.fullName || "Your Name"}
        </h1>
        {basics.headline && (
          <p
            className="text-gray-500 mt-1 tracking-wider font-light"
            style={{ fontSize: s(11) }}
          >
            {basics.headline}
          </p>
        )}
        <div
          className="h-0.5 w-24 mx-auto mt-4 mb-3"
          style={{ backgroundColor: accent }}
        />
        <div
          className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-gray-500 tracking-wide"
          style={{ fontSize: s(9) }}
        >
          {basics.location && <span>{basics.location}</span>}
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {basics.website && <span>{basics.website}</span>}
          {basics.linkedin && <span>{basics.linkedin}</span>}
          {basics.github && <span>{basics.github}</span>}
        </div>
      </header>

      {/* ── Summary ─────────────────────────────────────────── */}
      {summary && (
        <section className="mb-5">
          <ExecutiveSectionHeading color={accent}>
            Executive Summary
          </ExecutiveSectionHeading>
          <p
            className="leading-[1.6] text-gray-700 mt-2 text-justify"
            style={{ fontSize: s(10) }}
          >
            {summary}
          </p>
        </section>
      )}

      {/* ── Experience ──────────────────────────────────────── */}
      {experience.length > 0 && (
        <section className="mb-5">
          <ExecutiveSectionHeading color={accent}>
            Professional Experience
          </ExecutiveSectionHeading>
          <div className="mt-2 space-y-4">
            {experience.map((job) => (
              <div key={job.id} className="page-break-avoid">
                <div className="flex justify-between items-baseline">
                  <h3
                    className="font-semibold"
                    style={{ color: accent, fontSize: s(11) }}
                  >
                    {job.role}
                  </h3>
                  <span
                    className="text-gray-400 shrink-0 ml-3 tracking-wide"
                    style={{ fontSize: s(9) }}
                  >
                    {job.startDate} – {job.current ? "Present" : job.endDate}
                  </span>
                </div>
                <p className="text-gray-500 italic" style={{ fontSize: s(10) }}>
                  {job.company}
                  {job.location ? `, ${job.location}` : ""}
                </p>
                {(() => {
                  const validBullets = (job.bulletPoints || []).filter((bp) => bp.trim().length > 0);
                  if (validBullets.length === 0) return null;
                  return (
                    <ul className="mt-1.5 space-y-1">
                      {validBullets.map((bp, i) => (
                        <li
                          key={i}
                          className="leading-[1.45] text-gray-700 pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-gray-400"
                          style={{ fontSize: s(9.5) }}
                        >
                          {bp}
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Projects ────────────────────────────────────────── */}
      {projects.length > 0 && (
        <section className="mb-5">
          <ExecutiveSectionHeading color={accent}>
            Key Projects
          </ExecutiveSectionHeading>
          <div className="mt-2 space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="page-break-avoid">
                <div className="flex justify-between items-baseline">
                  <h3
                    className="font-semibold"
                    style={{ color: accent, fontSize: s(11) }}
                  >
                    {proj.name}
                  </h3>
                  <span
                    className="text-gray-400 shrink-0 ml-3 tracking-wide"
                    style={{ fontSize: s(9) }}
                  >
                    {proj.startDate}
                    {proj.endDate ? ` – ${proj.endDate}` : ""}
                  </span>
                </div>
                {proj.technologies && (
                  <p className="text-gray-500 italic" style={{ fontSize: s(9) }}>
                    {proj.technologies}
                  </p>
                )}
                {proj.link && (
                  <p style={{ color: accent, fontSize: s(8.5) }}>
                    {proj.link}
                  </p>
                )}
                {(() => {
                  const validBullets = (proj.bulletPoints || []).filter((bp) => bp.trim().length > 0);
                  if (validBullets.length === 0) return null;
                  return (
                    <ul className="mt-1.5 space-y-1">
                      {validBullets.map((bp, i) => (
                        <li
                          key={i}
                          className="leading-[1.45] text-gray-700 pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-gray-400"
                          style={{ fontSize: s(9.5) }}
                        >
                          {bp}
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Skills ──────────────────────────────────────────── */}
      {skills.length > 0 && (
        <section className="mb-5">
          <ExecutiveSectionHeading color={accent}>
            Core Competencies
          </ExecutiveSectionHeading>
          <div className="mt-2 space-y-1.5">
            {skills.map((cat) => (
              <div key={cat.id} style={{ fontSize: s(10) }}>
                <span className="font-semibold" style={{ color: accent }}>
                  {cat.category}:{" "}
                </span>
                <span className="text-gray-700">{cat.skills.join(" · ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Education & Certifications ────────────────────── */}
      <div className="grid grid-cols-2 gap-8 mb-5">
        {education.length > 0 && (
          <section>
            <ExecutiveSectionHeading color={accent}>
              Education
            </ExecutiveSectionHeading>
            <div className="mt-2 space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="page-break-avoid">
                  <p className="font-semibold" style={{ color: accent, fontSize: s(10) }}>
                    {edu.degree}
                  </p>
                  <p className="text-gray-600" style={{ fontSize: s(9.5) }}>{edu.institution}</p>
                  <p className="text-gray-400 tracking-wide" style={{ fontSize: s(8.5) }}>
                    {edu.startDate}
                    {edu.endDate ? ` – ${edu.endDate}` : ""}
                    {edu.gpa ? (edu.gpa.startsWith("GWA") ? ` · ${edu.gpa}` : ` · GWA: ${edu.gpa}`) : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <ExecutiveSectionHeading color={accent}>
              Certifications
            </ExecutiveSectionHeading>
            <div className="mt-2 space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="page-break-avoid">
                  <p className="font-semibold" style={{ color: accent, fontSize: s(10) }}>
                    {cert.name}
                  </p>
                  <p className="text-gray-500 tracking-wide" style={{ fontSize: s(8.5) }}>
                    {cert.issuer} · {cert.date}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── References ──────────────────────────────────────── */}
      {references.length > 0 && (
        <section>
          <ExecutiveSectionHeading color={accent}>
            References
          </ExecutiveSectionHeading>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {references.map((ref) => (
              <div key={ref.id} className="page-break-avoid" style={{ fontSize: s(9.5) }}>
                <p className="font-semibold" style={{ color: accent }}>
                  {ref.name}
                </p>
                <p className="text-gray-600">
                  {ref.title}, {ref.company}
                </p>
                <p className="text-gray-500">{ref.contact}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/** Elegant section heading with thin horizontal rule */
function ExecutiveSectionHeading({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <h2
        className="font-semibold uppercase tracking-[0.12em] shrink-0"
        style={{ color, fontSize: s(11) }}
      >
        {children}
      </h2>
      <div className="h-px flex-1 bg-gray-300" />
    </div>
  );
}
