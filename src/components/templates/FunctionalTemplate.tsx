"use client";

import type { Resume } from "@/types/resume";

interface Props {
  data: Resume;
}

/* ── Scaled pt helper ────────────────────────────────────────────── */
const s = (pt: number) => `calc(${pt}pt * var(--r-scale, 1))`;

/**
 * Functional Resume Template
 *
 * Emphasizes skills and capabilities first before education and brief work history.
 * Header starts directly with applicant's name and contact info.
 * Clean horizontal divider lines between every section.
 */
export default function FunctionalTemplate({ data }: Props) {
  const { basics, summary, experience, certifications, education, skills, references } = data;

  const hasContactInfo =
    Boolean(
      basics.fullName ||
        basics.headline ||
        basics.location ||
        basics.phone ||
        basics.email ||
        basics.linkedin ||
        basics.website ||
        basics.github
    );

  return (
    <div
      className="functional-resume leading-[1.38] text-black bg-white w-full min-h-full"
      style={{
        padding: "var(--r-margin, 1in)",
        fontSize: s(11),
      }}
    >
      {/* ── Header: Personal Info ─────────────────────────────── */}
      {hasContactInfo && (
        <header className="mb-2">
          {basics.fullName && (
            <h1
              className="font-bold uppercase text-black tracking-wide"
              style={{ fontSize: s(13.5) }}
            >
              {basics.fullName}
            </h1>
          )}
          {basics.headline && (
            <div className="font-semibold text-gray-800" style={{ fontSize: s(10.5) }}>
              {basics.headline}
            </div>
          )}
          <div className="text-black mt-0.5 leading-snug" style={{ fontSize: s(10) }}>
            {basics.location && <div>{basics.location}</div>}
            {basics.phone && <div>Phone: {basics.phone}</div>}
            {basics.email && (
              <div>
                Email:{" "}
                <a
                  href={`mailto:${basics.email}`}
                  className="text-blue-700 underline"
                >
                  {basics.email}
                </a>
              </div>
            )}
            {basics.website && (
              <div>
                Website:{" "}
                <a
                  href={basics.website.startsWith("http") ? basics.website : `https://${basics.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 underline"
                >
                  {basics.website}
                </a>
              </div>
            )}
            {basics.linkedin && (
              <div>
                LinkedIn:{" "}
                <span className="text-blue-700 underline">{basics.linkedin}</span>
              </div>
            )}
            {basics.github && (
              <div>
                GitHub:{" "}
                <a
                  href={basics.github.startsWith("http") ? basics.github : `https://${basics.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 underline"
                >
                  {basics.github}
                </a>
              </div>
            )}
          </div>
          <hr className="border-t border-black my-2.5" />
        </header>
      )}

      {/* ── Objective ─────────────────────────────────────────── */}
      {summary && (
        <section className="mb-2.5 page-break-avoid">
          <h2
            className="font-bold uppercase tracking-wide text-black mb-1"
            style={{ fontSize: s(11.5) }}
          >
            OBJECTIVE
          </h2>
          <p className="text-black text-justify leading-relaxed" style={{ fontSize: s(10) }}>
            {summary}
          </p>
          <hr className="border-t border-black my-2.5" />
        </section>
      )}

      {/* ── Skills Summary (Placed FIRST in Functional Resume) ─── */}
      {skills.length > 0 && skills.some((c) => c.category.trim() || c.skills.some((s) => s.trim())) && (
        <section className="mb-2.5 page-break-avoid">
          <h2
            className="font-bold uppercase tracking-wide text-black mb-1.5"
            style={{ fontSize: s(11.5) }}
          >
            SKILLS SUMMARY
          </h2>
          <div className="space-y-2.5">
            {skills.map((category) => {
              const activeSkills = category.skills.filter((s) => s.trim().length > 0);
              if (!category.category.trim() && activeSkills.length === 0) return null;
              return (
                <div key={category.id} className="page-break-avoid">
                  {category.category.trim() && (
                    <div className="font-bold text-black" style={{ fontSize: s(10.5) }}>
                      {category.category}
                    </div>
                  )}
                  {activeSkills.length > 0 && (
                    <ul className="list-disc ml-5 mt-0.5 space-y-0.5 text-black">
                      {activeSkills.map((skill, idx) => (
                        <li key={idx} style={{ fontSize: s(9.5) }}>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
          <hr className="border-t border-black my-2.5" />
        </section>
      )}

      {/* ── Education ─────────────────────────────────────────── */}
      {education.length > 0 && (
        <section className="mb-2.5 page-break-avoid">
          <h2
            className="font-bold uppercase tracking-wide text-black mb-1.5"
            style={{ fontSize: s(11.5) }}
          >
            EDUCATION
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="page-break-avoid">
                <div className="font-bold text-black" style={{ fontSize: s(10.5) }}>
                  {edu.degree}
                  {edu.fieldOfStudy && !edu.degree.includes(edu.fieldOfStudy)
                    ? ` (${edu.fieldOfStudy})`
                    : ""}
                </div>
                <div className="text-black" style={{ fontSize: s(10) }}>
                  {edu.institution}
                  {edu.location ? ` – ${edu.location}` : ""}
                </div>
                {(edu.startDate || edu.endDate) && (
                  <div className="italic text-black" style={{ fontSize: s(9.5) }}>
                    {edu.startDate}
                    {edu.endDate ? ` – ${edu.endDate}` : " – Present"}
                  </div>
                )}
                {edu.gpa && (
                  <ul className="list-disc ml-5 mt-0.5">
                    <li className="text-black" style={{ fontSize: s(9.5) }}>
                      {edu.gpa.replace(/^GPA:?\s*/i, "GWA: ")}
                    </li>
                  </ul>
                )}
              </div>
            ))}
          </div>
          <hr className="border-t border-black my-2.5" />
        </section>
      )}

      {/* ── Relevant Experience ─────────────────────────────────── */}
      {experience.length > 0 && (
        <section className="mb-2.5 page-break-avoid">
          <h2
            className="font-bold uppercase tracking-wide text-black mb-0.5"
            style={{ fontSize: s(11.5) }}
          >
            RELEVANT EXPERIENCE
          </h2>
          <p
            className="italic text-black mb-2"
            style={{ fontSize: s(9.5) }}
          >
            (Listed briefly because functional resumes prioritize skills.)
          </p>
          <div className="space-y-2">
            {experience.map((job) => {
              const roleTitle = [job.role, job.company].filter(Boolean).join(" – ");
              const validBps = (job.bulletPoints || []).filter((bp) => bp.trim().length > 0);
              return (
                <div key={job.id} className="page-break-avoid">
                  {roleTitle && (
                    <div className="font-bold text-black" style={{ fontSize: s(10.5) }}>
                      {roleTitle}
                    </div>
                  )}
                  {job.location && (
                    <div className="text-black" style={{ fontSize: s(10) }}>
                      {job.location}
                    </div>
                  )}
                  {(job.startDate || job.endDate) && (
                    <div className="italic text-black" style={{ fontSize: s(9.5) }}>
                      {job.startDate}
                      {job.endDate ? ` – ${job.current ? "Present" : job.endDate}` : ""}
                    </div>
                  )}
                  {validBps.length > 0 && (
                    <ul className="list-disc ml-5 mt-1 space-y-0.5 text-black">
                      {validBps.map((bp, i) => (
                        <li key={i} style={{ fontSize: s(9.5) }}>
                          {bp}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
          <hr className="border-t border-black my-2.5" />
        </section>
      )}

      {/* ── Achievements ──────────────────────────────────────── */}
      {certifications.length > 0 && (
        <section className="mb-2.5 page-break-avoid">
          <h2
            className="font-bold uppercase tracking-wide text-black mb-1.5"
            style={{ fontSize: s(11.5) }}
          >
            ACHIEVEMENTS
          </h2>
          <ul className="list-disc ml-5 space-y-0.5 text-black">
            {certifications.map((cert) => (
              cert.name?.trim() ? (
                <li key={cert.id} style={{ fontSize: s(9.5) }}>
                  {cert.name}
                  {cert.date ? ` (${cert.date})` : ""}
                </li>
              ) : null
            ))}
          </ul>
          <hr className="border-t border-black my-2.5" />
        </section>
      )}

      {/* ── Character References ──────────────────────────────── */}
      {references.length > 0 && (
        <section className="mb-2 page-break-avoid">
          <h2
            className="font-bold uppercase tracking-wide text-black mb-1.5"
            style={{ fontSize: s(11.5) }}
          >
            CHARACTER REFERENCES
          </h2>
          <ul className="list-disc ml-5 space-y-2.5 text-black">
            {references.map((ref) => (
              ref.name?.trim() ? (
                <li key={ref.id} className="page-break-avoid" style={{ fontSize: s(9.5) }}>
                  <div className="font-bold">{ref.name}</div>
                  {ref.title && <div>{ref.title}</div>}
                  {ref.company && <div>{ref.company}</div>}
                  {ref.contact && (
                    <div>
                      {ref.contact.includes("@") ? (
                        <a href={`mailto:${ref.contact}`} className="text-blue-700 underline">
                          {ref.contact}
                        </a>
                      ) : (
                        ref.contact
                      )}
                    </div>
                  )}
                </li>
              ) : null
            ))}
          </ul>
          <hr className="border-t border-black my-2.5" />
        </section>
      )}
    </div>
  );
}
