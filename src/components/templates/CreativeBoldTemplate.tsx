"use client";

import type { Resume } from "@/types/resume";

interface Props {
  data: Resume;
}

/* ── Scaled pt helper ────────────────────────────────────────────── */
const s = (pt: number) => `calc(${pt}pt * var(--r-scale, 1))`;

/**
 * Creative Bold Template
 *
 * Bold, expressive layout with a large header section featuring
 * the name over a colored banner, skill tags as badges, and
 * timeline-style section markers.
 */
export default function CreativeBoldTemplate({ data }: Props) {
  const { basics, summary, experience, projects, certifications, education, skills, references } = data;
  const accent = data.settings.primaryColor || "#7c3aed";

  return (
    <div
      className="creative-bold leading-[1.45] text-gray-900 bg-white w-full min-h-full"
      style={{ fontSize: s(10.5) }}
    >
      {/* ── Hero Banner ─────────────────────────────────────── */}
      <header
        className="px-8 pt-8 pb-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 50%, ${accent}99 100%)`,
        }}
      >
        <div className="flex items-center gap-5">
          {basics.photoUrl && (
            <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white/80 shadow-lg bg-white/10 shrink-0">
              <img
                src={basics.photoUrl}
                alt={basics.fullName || "Profile"}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          )}
          <div className="min-w-0">
            <h1
              className="font-extrabold tracking-tight leading-none"
              style={{ fontSize: s(28) }}
            >
              {basics.fullName || "Your Name"}
            </h1>
            {basics.headline && (
              <p
                className="font-light text-white/80 mt-1"
                style={{ fontSize: s(13) }}
              >
                {basics.headline}
              </p>
            )}
          </div>
        </div>
        <div
          className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-white/75"
          style={{ fontSize: s(9) }}
        >
          {basics.email && <span>✉ {basics.email}</span>}
          {basics.phone && <span>☎ {basics.phone}</span>}
          {basics.location && <span>📍 {basics.location}</span>}
          {basics.website && <span>🌐 {basics.website}</span>}
          {basics.linkedin && <span>in {basics.linkedin}</span>}
          {basics.github && <span>⌨ {basics.github}</span>}
        </div>
      </header>

      <div className="px-8 py-6">
        {/* ── Summary ─────────────────────────────────────────── */}
        {summary && (
          <section className="mb-5">
            <SectionHeading color={accent}>About Me</SectionHeading>
            <p
              className="leading-[1.55] text-gray-700 mt-2"
              style={{ fontSize: s(10) }}
            >
              {summary}
            </p>
          </section>
        )}

        {/* ── Skills Badges ───────────────────────────────────── */}
        {skills.length > 0 && (
          <section className="mb-5">
            <SectionHeading color={accent}>Skills</SectionHeading>
            <div className="mt-2 space-y-2">
              {skills.map((cat) => (
                <div key={cat.id}>
                  <span
                    className="font-bold text-gray-500 uppercase tracking-wider"
                    style={{ fontSize: s(9) }}
                  >
                    {cat.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {cat.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full font-medium text-white"
                        style={{ backgroundColor: accent, fontSize: s(8.5) }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Experience ──────────────────────────────────────── */}
        {experience.length > 0 && (
          <section className="mb-5">
            <SectionHeading color={accent}>Experience</SectionHeading>
            <div
              className="mt-2 space-y-4 border-l-2 pl-5 ml-1"
              style={{ borderColor: `${accent}40` }}
            >
              {experience.map((job) => (
                <div key={job.id} className="relative page-break-avoid">
                  {/* Timeline dot */}
                  <div
                    className="absolute left-[-1.6rem] top-1 w-3 h-3 rounded-full border-2 bg-white"
                    style={{ borderColor: accent }}
                  />
                  <div className="flex justify-between items-baseline">
                    <h3
                      className="font-bold text-gray-900"
                      style={{ fontSize: s(11) }}
                    >
                      {job.role}
                    </h3>
                    <span
                      className="text-gray-400 shrink-0 ml-3"
                      style={{ fontSize: s(8.5) }}
                    >
                      {job.startDate} – {job.current ? "Present" : job.endDate}
                    </span>
                  </div>
                  <p
                    className="font-medium"
                    style={{ color: accent, fontSize: s(9.5) }}
                  >
                    {job.company}
                    {job.location ? ` · ${job.location}` : ""}
                  </p>
                  {job.bulletPoints.length > 0 && (
                    <ul className="list-disc ml-4 mt-1 space-y-0.5">
                      {job.bulletPoints.map((bp, i) => (
                        <li
                          key={i}
                          className="leading-[1.4] text-gray-700"
                          style={{ fontSize: s(9.5) }}
                        >
                          {bp}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Projects ────────────────────────────────────────── */}
        {projects.length > 0 && (
          <section className="mb-5">
            <SectionHeading color={accent}>Projects</SectionHeading>
            <div
              className="mt-2 space-y-4 border-l-2 pl-5 ml-1"
              style={{ borderColor: `${accent}40` }}
            >
              {projects.map((proj) => (
                <div key={proj.id} className="relative page-break-avoid">
                  <div
                    className="absolute left-[-1.6rem] top-1 w-3 h-3 rounded-full border-2 bg-white"
                    style={{ borderColor: accent }}
                  />
                  <div className="flex justify-between items-baseline">
                    <h3
                      className="font-bold text-gray-900"
                      style={{ fontSize: s(11) }}
                    >
                      {proj.name}
                    </h3>
                    <span
                      className="text-gray-400 shrink-0 ml-3"
                      style={{ fontSize: s(8.5) }}
                    >
                      {proj.startDate}
                      {proj.endDate ? ` – ${proj.endDate}` : ""}
                    </span>
                  </div>
                  {proj.technologies && (
                    <p className="text-gray-500" style={{ fontSize: s(9) }}>
                      {proj.technologies}
                    </p>
                  )}
                  {proj.link && (
                    <p style={{ color: accent, fontSize: s(8.5) }}>
                      {proj.link}
                    </p>
                  )}
                  {proj.bulletPoints.length > 0 && (
                    <ul className="list-disc ml-4 mt-1 space-y-0.5">
                      {proj.bulletPoints.map((bp, i) => (
                        <li
                          key={i}
                          className="leading-[1.4] text-gray-700"
                          style={{ fontSize: s(9.5) }}
                        >
                          {bp}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Education & Certs side by side ───────────────── */}
        <div className="grid grid-cols-2 gap-6 mb-5">
          {education.length > 0 && (
            <section>
              <SectionHeading color={accent}>Education</SectionHeading>
              <div className="mt-2 space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="page-break-avoid">
                    <p className="font-bold" style={{ fontSize: s(10) }}>
                      {edu.degree}
                    </p>
                    <p className="text-gray-600" style={{ fontSize: s(9.5) }}>
                      {edu.institution}
                    </p>
                    <p className="text-gray-400" style={{ fontSize: s(8.5) }}>
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
              <SectionHeading color={accent}>Certifications</SectionHeading>
              <div className="mt-2 space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="page-break-avoid">
                    <p className="font-semibold" style={{ fontSize: s(10) }}>
                      {cert.name}
                    </p>
                    <p className="text-gray-500" style={{ fontSize: s(8.5) }}>
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
            <SectionHeading color={accent}>References</SectionHeading>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {references.map((ref) => (
                <div key={ref.id} className="page-break-avoid" style={{ fontSize: s(9.5) }}>
                  <p className="font-semibold">{ref.name}</p>
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
    </div>
  );
}

/** Reusable bold underline section heading for the Creative template */
function SectionHeading({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <h2
      className="font-extrabold uppercase tracking-wider relative pb-1"
      style={{ fontSize: s(13) }}
    >
      <span style={{ color }}>{children}</span>
      <span
        className="absolute bottom-0 left-0 h-0.75 w-10 rounded"
        style={{ backgroundColor: color }}
      />
    </h2>
  );
}
