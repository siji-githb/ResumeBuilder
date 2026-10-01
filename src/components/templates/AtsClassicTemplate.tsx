"use client";

import type { Resume } from "@/types/resume";

interface Props {
  data: Resume;
}

/* ── Scaled pt helper ────────────────────────────────────────────── */
const s = (pt: number) => `calc(${pt}pt * var(--r-scale, 1))`;

/**
 * ATS Classic Template
 *
 * Strict single-column layout designed to pass Applicant Tracking Systems.
 * Uses semantic HTML headings, standard fonts, and zero graphics.
 * All text is selectable vector content in the printed PDF.
 */
export default function AtsClassicTemplate({ data }: Props) {
  const { basics, summary, experience, projects, certifications, education, skills, references } = data;

  return (
    <div className="ats-classic leading-[1.4] text-black bg-white p-8 w-full min-h-full" style={{ fontSize: s(11) }}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="text-center border-b border-gray-400 pb-3 mb-4">
        <h1 className="font-bold tracking-wide uppercase" style={{ fontSize: s(18) }}>
          {basics.fullName || "Your Name"}
        </h1>
        <div className="text-gray-700 mt-1 flex flex-wrap justify-center gap-x-2 gap-y-0.5" style={{ fontSize: s(9.5) }}>
          {basics.location && <span>{basics.location}</span>}
          {basics.location && basics.email && <span>|</span>}
          {basics.email && <span>{basics.email}</span>}
          {basics.email && basics.phone && <span>|</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {basics.phone && basics.website && <span>|</span>}
          {basics.website && <span>{basics.website}</span>}
          {basics.website && basics.linkedin && <span>|</span>}
          {basics.linkedin && <span>{basics.linkedin}</span>}
          {basics.linkedin && basics.github && <span>|</span>}
          {basics.github && <span>{basics.github}</span>}
        </div>
      </header>

      {/* ── Summary ─────────────────────────────────────────── */}
      {summary && (
        <section className="mb-3">
          <h2 className="font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5" style={{ fontSize: s(12) }}>
            Summary
          </h2>
          <p className="leading-[1.45]" style={{ fontSize: s(10) }}>{summary}</p>
        </section>
      )}

      {/* ── Experience ──────────────────────────────────────── */}
      {experience.length > 0 && (
        <section className="mb-3">
          <h2 className="font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5" style={{ fontSize: s(12) }}>
            Experience
          </h2>
          {experience.map((job) => (
            <div key={job.id} className="mb-2.5 page-break-avoid">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold" style={{ fontSize: s(11) }}>{job.role}</h3>
                <span className="text-gray-600 shrink-0 ml-4" style={{ fontSize: s(9.5) }}>
                  {job.location}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="italic" style={{ fontSize: s(10) }}>{job.company}</span>
                <span className="text-gray-600 shrink-0 ml-4" style={{ fontSize: s(9.5) }}>
                  {job.startDate}
                  {job.endDate ? ` – ${job.current ? "Present" : job.endDate}` : ""}
                </span>
              </div>
              {job.bulletPoints.length > 0 && (
                <ul className="list-disc ml-5 mt-1 space-y-0.5">
                  {job.bulletPoints.map((bp, i) => (
                    <li key={i} className="leading-[1.4]" style={{ fontSize: s(10) }}>
                      {bp}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ── Projects ────────────────────────────────────────── */}
      {projects.length > 0 && (
        <section className="mb-3">
          <h2 className="font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5" style={{ fontSize: s(12) }}>
            Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-2.5 page-break-avoid">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold" style={{ fontSize: s(11) }}>
                  {proj.name}
                  {proj.technologies && (
                    <span className="font-normal text-gray-600 ml-2" style={{ fontSize: s(9.5) }}>
                      | {proj.technologies}
                    </span>
                  )}
                </h3>
                {proj.link && (
                  <span className="text-blue-700 shrink-0 ml-4" style={{ fontSize: s(9) }}>
                    {proj.link}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-baseline">
                {proj.role && (
                  <span className="italic" style={{ fontSize: s(10) }}>{proj.role}</span>
                )}
                <span className="text-gray-600 shrink-0 ml-4" style={{ fontSize: s(9.5) }}>
                  {proj.startDate}
                  {proj.endDate ? ` – ${proj.endDate}` : ""}
                </span>
              </div>
              {proj.bulletPoints.length > 0 && (
                <ul className="list-disc ml-5 mt-1 space-y-0.5">
                  {proj.bulletPoints.map((bp, i) => (
                    <li key={i} className="leading-[1.4]" style={{ fontSize: s(10) }}>
                      {bp}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ── Certifications ──────────────────────────────────── */}
      {certifications.length > 0 && (
        <section className="mb-3">
          <h2 className="font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5" style={{ fontSize: s(12) }}>
            Certifications
          </h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between items-baseline mb-1 page-break-avoid">
              <div>
                <span className="font-semibold" style={{ fontSize: s(10) }}>{cert.name}</span>
                {cert.issuer && (
                  <span className="text-gray-600 ml-2" style={{ fontSize: s(9.5) }}>
                    — {cert.issuer}
                  </span>
                )}
              </div>
              <span className="text-gray-600 shrink-0 ml-4" style={{ fontSize: s(9.5) }}>
                {cert.date}
              </span>
            </div>
          ))}
        </section>
      )}

      {/* ── Education ───────────────────────────────────────── */}
      {education.length > 0 && (
        <section className="mb-3">
          <h2 className="font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5" style={{ fontSize: s(12) }}>
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2 page-break-avoid">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold" style={{ fontSize: s(11) }}>{edu.institution}</h3>
                <span className="text-gray-600 shrink-0 ml-4" style={{ fontSize: s(9.5) }}>
                  {edu.location}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="italic" style={{ fontSize: s(10) }}>
                  {edu.degree}
                  {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                </span>
                <span className="text-gray-600 shrink-0 ml-4" style={{ fontSize: s(9.5) }}>
                  {edu.startDate}
                  {edu.endDate ? ` – ${edu.endDate}` : ""}
                </span>
              </div>
              {edu.gpa && (
                <p className="text-gray-700 mt-0.5" style={{ fontSize: s(9.5) }}>
                  {edu.gpa.startsWith("GWA") ? edu.gpa : `GWA: ${edu.gpa}`}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ── Skills ──────────────────────────────────────────── */}
      {skills.length > 0 && (
        <section className="mb-3">
          <h2 className="font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5" style={{ fontSize: s(12) }}>
            Skills
          </h2>
          <div className="space-y-1">
            {skills.map((cat) => (
              <div key={cat.id} style={{ fontSize: s(10) }}>
                <span className="font-semibold">{cat.category}: </span>
                <span>{cat.skills.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── References ──────────────────────────────────────── */}
      {references.length > 0 && (
        <section className="mb-3">
          <h2 className="font-bold uppercase border-b border-gray-300 pb-0.5 mb-1.5" style={{ fontSize: s(12) }}>
            References
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {references.map((ref) => (
              <div key={ref.id} className="page-break-avoid" style={{ fontSize: s(10) }}>
                <p className="font-semibold">{ref.name}</p>
                <p className="text-gray-700">
                  {ref.title}, {ref.company}
                </p>
                <p className="text-gray-600">{ref.contact}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
