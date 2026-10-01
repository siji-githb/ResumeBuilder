"use client";

import type { Resume } from "@/types/resume";

interface Props {
  data: Resume;
}

/* ── Scaled pt helper ────────────────────────────────────────────── */
const s = (pt: number) => `calc(${pt}pt * var(--r-scale, 1))`;

/**
 * Modern Clean Template
 *
 * Two-column layout with a colored sidebar for contact & skills,
 * and a main content area for experience, projects, etc.
 */
export default function ModernCleanTemplate({ data }: Props) {
  const { basics, summary, experience, projects, certifications, education, skills, references } = data;
  const accent = data.settings.primaryColor || "#1e40af";

  return (
    <div
      className="modern-clean leading-[1.4] text-gray-900 bg-white w-full flex min-h-full"
      style={{ fontSize: s(10.5) }}
    >
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className="w-[2.4in] shrink-0 p-5 text-white"
        style={{ backgroundColor: accent }}
      >
        {/* Avatar - round photo or initials circle */}
        {basics.photoUrl ? (
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/50 shadow-md mx-auto mb-4 bg-white/10">
            <img
              src={basics.photoUrl}
              alt={basics.fullName || "Profile"}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-xs">
            <span className="text-2xl font-bold text-white/90">
              {basics.fullName
                ? basics.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "?"}
            </span>
          </div>
        )}

        {/* Contact */}
        <div className="mb-6">
          <h2
            className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2.5"
            style={{ fontSize: s(11) }}
          >
            Contact
          </h2>
          <div className="space-y-1.5 text-white/90" style={{ fontSize: s(9) }}>
            {basics.email && (
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5">✉</span>
                <span className="break-all">{basics.email}</span>
              </div>
            )}
            {basics.phone && (
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5">☎</span>
                <span>{basics.phone}</span>
              </div>
            )}
            {basics.location && (
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5">📍</span>
                <span>{basics.location}</span>
              </div>
            )}
            {basics.website && (
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5">🌐</span>
                <span className="break-all">{basics.website}</span>
              </div>
            )}
            {basics.linkedin && (
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5 font-bold" style={{ fontSize: s(8) }}>in</span>
                <span className="break-all">{basics.linkedin}</span>
              </div>
            )}
            {basics.github && (
              <div className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5">⌨</span>
                <span className="break-all">{basics.github}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2
              className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2.5"
              style={{ fontSize: s(11) }}
            >
              Skills
            </h2>
            <div className="space-y-3">
              {skills.map((cat) => (
                <div key={cat.id}>
                  <h3 className="font-semibold text-white/80 mb-1" style={{ fontSize: s(9.5) }}>
                    {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {cat.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded bg-white/15 text-white/90"
                        style={{ fontSize: s(8) }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2
              className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2.5"
              style={{ fontSize: s(11) }}
            >
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2.5" style={{ fontSize: s(9) }}>
                <p className="font-semibold text-white">{edu.degree}</p>
                <p className="text-white/80">{edu.institution}</p>
                <p className="text-white/60" style={{ fontSize: s(8) }}>
                  {edu.startDate}
                  {edu.endDate ? ` – ${edu.endDate}` : ""}
                </p>
                {edu.gpa && (
                  <p className="text-white/60" style={{ fontSize: s(8) }}>
                    {edu.gpa.startsWith("GWA") ? edu.gpa : `GWA: ${edu.gpa}`}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2
              className="font-bold uppercase tracking-wider border-b border-white/30 pb-1 mb-2.5"
              style={{ fontSize: s(11) }}
            >
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2" style={{ fontSize: s(9) }}>
                <p className="font-semibold text-white">{cert.name}</p>
                <p className="text-white/70" style={{ fontSize: s(8) }}>
                  {cert.issuer} · {cert.date}
                </p>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="flex-1 p-6">
        {/* Name & Headline */}
        <header className="mb-4 pb-3 border-b-2" style={{ borderColor: accent }}>
          <h1 className="font-bold" style={{ color: accent, fontSize: s(22) }}>
            {basics.fullName || "Your Name"}
          </h1>
          {basics.headline && (
            <p className="text-gray-500 mt-0.5 font-medium" style={{ fontSize: s(11) }}>
              {basics.headline}
            </p>
          )}
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-4">
            <h2
              className="font-bold uppercase tracking-wide pb-0.5 mb-1.5"
              style={{ color: accent, fontSize: s(12) }}
            >
              Profile
            </h2>
            <p className="leading-normal text-gray-700" style={{ fontSize: s(10) }}>{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-4">
            <h2
              className="font-bold uppercase tracking-wide pb-0.5 mb-1.5"
              style={{ color: accent, fontSize: s(12) }}
            >
              Experience
            </h2>
            {experience.map((job) => (
              <div key={job.id} className="mb-3 page-break-avoid">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900" style={{ fontSize: s(11) }}>
                    {job.role}
                  </h3>
                  <span className="text-gray-500 shrink-0 ml-3" style={{ fontSize: s(9) }}>
                    {job.startDate} – {job.current ? "Present" : job.endDate}
                  </span>
                </div>
                <p className="text-gray-600 italic" style={{ fontSize: s(10) }}>
                  {job.company}
                  {job.location ? ` · ${job.location}` : ""}
                </p>
                {job.bulletPoints.length > 0 && (
                  <ul className="list-disc ml-4 mt-1 space-y-0.5">
                    {job.bulletPoints.map((bp, i) => (
                      <li key={i} className="leading-[1.4] text-gray-700" style={{ fontSize: s(9.5) }}>
                        {bp}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-4">
            <h2
              className="font-bold uppercase tracking-wide pb-0.5 mb-1.5"
              style={{ color: accent, fontSize: s(12) }}
            >
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3 page-break-avoid">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900" style={{ fontSize: s(11) }}>
                    {proj.name}
                    {proj.technologies && (
                      <span className="font-normal text-gray-500 ml-2" style={{ fontSize: s(9) }}>
                        {proj.technologies}
                      </span>
                    )}
                  </h3>
                  <span className="text-gray-500 shrink-0 ml-3" style={{ fontSize: s(9) }}>
                    {proj.startDate}
                    {proj.endDate ? ` – ${proj.endDate}` : ""}
                  </span>
                </div>
                {proj.link && (
                  <p style={{ color: accent, fontSize: s(8.5) }}>
                    {proj.link}
                  </p>
                )}
                {proj.bulletPoints.length > 0 && (
                  <ul className="list-disc ml-4 mt-1 space-y-0.5">
                    {proj.bulletPoints.map((bp, i) => (
                      <li key={i} className="leading-[1.4] text-gray-700" style={{ fontSize: s(9.5) }}>
                        {bp}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* References */}
        {references.length > 0 && (
          <section>
            <h2
              className="font-bold uppercase tracking-wide pb-0.5 mb-1.5"
              style={{ color: accent, fontSize: s(12) }}
            >
              References
            </h2>
            <div className="grid grid-cols-2 gap-3">
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
      </main>
    </div>
  );
}
