"use client";

import type { Resume } from "@/types/resume";
import { MapPin, Phone, Mail, Globe, Link2, Code2 } from "lucide-react";

interface Props {
  data: Resume;
}

/* ── Scaled pt helper ────────────────────────────────────────────── */
const s = (pt: number) => `calc(${pt}pt * var(--r-scale, 1))`;

/**
 * Modern Sidebar Resume Template
 *
 * Distinctive two-column layout with a prominent circular profile photo,
 * contrast sidebar with light silver pill badges for Contact and Skills,
 * and high-contrast pill headers for the right content area.
 */
export default function ModernSidebarTemplate({ data }: Props) {
  const {
    basics,
    summary,
    experience,
    projects,
    certifications,
    education,
    skills,
    references,
  } = data;

  const accent = data.settings.primaryColor || "#111827";

  // Separate skills into soft vs technical if categories match or split
  const softSkillsCategory = skills.find(
    (c) =>
      c.category.toLowerCase().includes("soft") ||
      c.category.toLowerCase().includes("interpersonal")
  );
  const techSkillsCategory = skills.find(
    (c) =>
      c.category.toLowerCase().includes("tech") ||
      c.category.toLowerCase().includes("hard") ||
      c.category.toLowerCase().includes("language") ||
      c.category.toLowerCase().includes("tool")
  );

  const softSkills = (
    softSkillsCategory
      ? softSkillsCategory.skills
      : skills.length > 1
      ? skills[0].skills
      : []
  ).filter((s) => s.trim());

  const techSkills = (
    techSkillsCategory
      ? techSkillsCategory.skills
      : skills.length > 1
      ? skills[1].skills
      : skills.length === 1
      ? skills[0].skills
      : []
  ).filter((s) => s.trim());

  const otherSkillCategories = skills
    .filter((c) => c !== softSkillsCategory && c !== techSkillsCategory)
    .map((c) => ({ ...c, skills: c.skills.filter((s) => s.trim()) }))
    .filter((c) => c.skills.length > 0);

  const hasContactInfo = Boolean(
    basics.location ||
      basics.phone ||
      basics.email ||
      basics.website ||
      basics.linkedin ||
      basics.github
  );

  return (
    <div
      className="modern-sidebar leading-[1.38] text-gray-900 bg-white w-full flex min-h-full shadow-xs"
      style={{
        fontSize: s(10),
      }}
    >
      {/* ── Left Sidebar (Dark / Accent Background) ──────────── */}
      <aside
        className="w-66 shrink-0 text-white flex flex-col relative overflow-hidden"
        style={{ backgroundColor: accent }}
      >
        {/* Top curved white backdrop for round avatar */}
        <div className="relative pt-6 pb-4 px-4 flex flex-col items-center">
          {/* Decorative curved white arc in background */}
          <div
            className="absolute top-0 left-0 w-full h-32 bg-white rounded-br-[90px]"
            style={{ zIndex: 0 }}
          />

          {/* Round Profile Photo */}
          <div className="relative z-10 my-2">
            <div
              className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center"
              style={{ boxShadow: `0 0 0 3px ${accent}` }}
            >
              {basics.photoUrl ? (
                <img
                  src={basics.photoUrl}
                  alt={basics.fullName || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center text-white font-bold"
                  style={{ backgroundColor: accent }}
                >
                  <span className="text-3xl tracking-wider">
                    {basics.fullName
                      ? basics.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "PHOTO"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Body Sections */}
        <div className="px-5 pb-8 space-y-6 flex-1 flex flex-col">
          {/* ── Contact Section ──────────────────────────────── */}
          {hasContactInfo && (
            <section className="page-break-avoid">
              <div className="bg-[#d1d5db] text-[#111827] font-extrabold text-xs uppercase tracking-wider py-1.5 px-5 rounded-r-full inline-block mb-3.5 -ml-5 shadow-xs">
                Contact
              </div>
              <ul className="space-y-2.5 text-white/95" style={{ fontSize: s(9) }}>
                {basics.location && (
                  <li className="flex items-start gap-2.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-white/80" />
                    <span className="leading-snug">{basics.location}</span>
                  </li>
                )}
                {basics.phone && (
                  <li className="flex items-center gap-2.5 min-w-0">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-white/80" />
                    <span className="break-all">{basics.phone}</span>
                  </li>
                )}
                {basics.email && (
                  <li className="flex items-center gap-2.5 min-w-0">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-white/80" />
                    <a
                      href={`mailto:${basics.email}`}
                      className="hover:underline text-white break-all leading-tight"
                    >
                      {basics.email}
                    </a>
                  </li>
                )}
                {basics.website && (
                  <li className="flex items-center gap-2.5 min-w-0">
                    <Globe className="w-3.5 h-3.5 shrink-0 text-white/80" />
                    <span className="break-all leading-tight">{basics.website}</span>
                  </li>
                )}
                {basics.linkedin && (
                  <li className="flex items-center gap-2.5 min-w-0">
                    <Link2 className="w-3.5 h-3.5 shrink-0 text-white/80" />
                    <span className="break-all leading-tight">{basics.linkedin}</span>
                  </li>
                )}
                {basics.github && (
                  <li className="flex items-center gap-2.5 min-w-0">
                    <Code2 className="w-3.5 h-3.5 shrink-0 text-white/80" />
                    <span className="break-all leading-tight">{basics.github}</span>
                  </li>
                )}
              </ul>
            </section>
          )}

          {/* ── Soft Skills Section ──────────────────────────── */}
          {softSkills.length > 0 && (
            <section className="page-break-avoid">
              <div className="bg-[#d1d5db] text-[#111827] font-extrabold text-xs uppercase tracking-wider py-1.5 px-5 rounded-r-full inline-block mb-3.5 -ml-5 shadow-xs">
                {softSkillsCategory ? softSkillsCategory.category : "Soft Skills"}
              </div>
              <ul className="space-y-1.5 text-white/95" style={{ fontSize: s(9.5) }}>
                {softSkills.map((skill, idx) => (
                  <li key={idx} className="leading-snug font-medium">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* ── Technical Skills Section ─────────────────────── */}
          {techSkills.length > 0 && (
            <section className="page-break-avoid">
              <div className="bg-[#d1d5db] text-[#111827] font-extrabold text-xs uppercase tracking-wider py-1.5 px-5 rounded-r-full inline-block mb-3.5 -ml-5 shadow-xs">
                {techSkillsCategory ? techSkillsCategory.category : "Technical Skills"}
              </div>
              <ul className="space-y-1.5 text-white/95" style={{ fontSize: s(9.5) }}>
                {techSkills.map((skill, idx) => (
                  <li key={idx} className="leading-snug font-medium">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Other Skills Categories if user added more */}
          {otherSkillCategories.length > 0 &&
            otherSkillCategories.map((cat) => (
              <section key={cat.id} className="page-break-avoid">
                <div className="bg-[#d1d5db] text-[#111827] font-extrabold text-xs uppercase tracking-wider py-1.5 px-5 rounded-r-full inline-block mb-3.5 -ml-5 shadow-xs">
                  {cat.category}
                </div>
                <ul className="space-y-1.5 text-white/95" style={{ fontSize: s(9.5) }}>
                  {cat.skills.map((skill, idx) => (
                    <li key={idx} className="leading-snug font-medium">
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

          {/* Character References in Sidebar if available */}
          {references.length > 0 && (
            <section className="page-break-avoid pt-2">
              <div className="bg-[#d1d5db] text-[#111827] font-extrabold text-xs uppercase tracking-wider py-1.5 px-5 rounded-r-full inline-block mb-3.5 -ml-5 shadow-xs">
                References
              </div>
              <div className="space-y-2.5 text-white/95" style={{ fontSize: s(8.5) }}>
                {references.map((ref) => (
                  <div key={ref.id}>
                    <div className="font-bold text-white">{ref.name}</div>
                    <div className="text-white/80">{ref.title}</div>
                    <div className="text-white/70">{ref.company}</div>
                    {ref.contact && <div className="text-white/80">{ref.contact}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </aside>

      {/* ── Right Content Area (White Background) ─────────────── */}
      <main className="flex-1 text-[#111827] flex flex-col space-y-5" style={{ padding: "var(--r-margin, 1in)" }}>
        {/* Full Name Header */}
        {basics.fullName && (
          <header className="mb-2">
            <h1
              className="font-extrabold text-[#111827] tracking-tight leading-none"
              style={{ fontSize: s(28) }}
            >
              {basics.fullName}
            </h1>
            {basics.headline && (
              <p
                className="font-semibold text-gray-500 mt-1 uppercase tracking-wider"
                style={{ fontSize: s(11) }}
              >
                {basics.headline}
              </p>
            )}
          </header>
        )}

        {/* ── About Me (Summary / Objective) ────────────────── */}
        {summary && (
          <section className="page-break-avoid">
            <div
              className="text-white font-bold text-xs uppercase tracking-wider py-1 px-5 rounded-full inline-block mb-2.5 shadow-xs"
              style={{ backgroundColor: accent }}
            >
              About Me
            </div>
            <p
              className="text-gray-800 text-justify leading-relaxed"
              style={{ fontSize: s(9.5) }}
            >
              {summary}
            </p>
          </section>
        )}

        {/* ── Education ─────────────────────────────────────── */}
        {education.length > 0 && (
          <section className="page-break-avoid">
            <div
              className="text-white font-bold text-xs uppercase tracking-wider py-1 px-5 rounded-full inline-block mb-3 shadow-xs"
              style={{ backgroundColor: accent }}
            >
              Education
            </div>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="page-break-avoid">
                  <div
                    className="font-bold text-[#111827]"
                    style={{ fontSize: s(10.5) }}
                  >
                    {edu.institution}
                  </div>
                  <ul className="list-disc ml-5 space-y-0.5 text-gray-800 mt-0.5">
                    {(edu.startDate || edu.endDate) && (
                      <li style={{ fontSize: s(9) }}>
                        {edu.startDate}
                        {edu.endDate ? ` - ${edu.endDate}` : " - Present"}
                      </li>
                    )}
                    {edu.location && (
                      <li style={{ fontSize: s(9) }}>{edu.location}</li>
                    )}
                    {edu.degree && (
                      <li style={{ fontSize: s(9) }}>
                        {edu.degree}
                        {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                      </li>
                    )}
                    {edu.gpa && (
                      <li className="font-medium" style={{ fontSize: s(9) }}>
                        {edu.gpa.replace(/^GPA:?\s*/i, "GWA: ")}
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Experience ────────────────────────────────────── */}
        {(experience.length > 0 || projects.length > 0) && (
          <section className="page-break-avoid">
            <div
              className="text-white font-bold text-xs uppercase tracking-wider py-1 px-5 rounded-full inline-block mb-3 shadow-xs"
              style={{ backgroundColor: accent }}
            >
              Experience
            </div>

            {/* Work experience positions */}
            <div className="space-y-3.5">
              {experience.map((job) => (
                <div key={job.id} className="page-break-avoid">
                  <div
                    className="font-bold text-[#111827]"
                    style={{ fontSize: s(10.5) }}
                  >
                    {job.role}
                  </div>
                  <div
                    className="text-gray-600 font-medium mb-1"
                    style={{ fontSize: s(9) }}
                  >
                    {job.company}
                    {job.startDate || job.endDate
                      ? ` | ${job.startDate} ${job.endDate ? `- ${job.current ? "Present" : job.endDate}` : ""}`
                      : ""}
                  </div>
                  {(() => {
                    const validBullets = (job.bulletPoints || []).filter((bp) => bp.trim().length > 0);
                    if (validBullets.length === 0) return null;
                    return (
                      <ul className="list-disc ml-5 space-y-0.5 text-gray-800">
                        {validBullets.map((bp, i) => (
                          <li key={i} style={{ fontSize: s(9) }}>
                            {bp}
                          </li>
                        ))}
                      </ul>
                    );
                  })()}
                </div>
              ))}

              {/* Projects under Experience (matches sample structure) */}
              {projects.length > 0 && (
                <div className="pt-2 space-y-3">
                  <div
                    className="font-bold text-[#111827] uppercase tracking-wide border-b border-gray-200 pb-1 mb-2"
                    style={{ fontSize: s(9.5) }}
                  >
                    Projects &amp; Academic Work
                  </div>
                  {projects.map((proj) => (
                    <div key={proj.id} className="page-break-avoid">
                      <div
                        className="font-bold text-[#111827]"
                        style={{ fontSize: s(10) }}
                      >
                        {proj.name}
                        {proj.startDate ? ` | ${proj.startDate}` : ""}
                        {proj.endDate ? ` - ${proj.endDate}` : ""}
                      </div>
                      {proj.role && (
                        <div className="text-gray-600 italic text-[11px] mb-0.5">
                          {proj.role}
                          {proj.technologies ? ` (${proj.technologies})` : ""}
                        </div>
                      )}
                      {(() => {
                        const validBullets = (proj.bulletPoints || []).filter((bp) => bp.trim().length > 0);
                        if (validBullets.length === 0) return null;
                        return (
                          <ul className="list-disc ml-5 space-y-0.5 text-gray-800">
                            {validBullets.map((bp, i) => (
                              <li key={i} style={{ fontSize: s(9) }}>
                                {bp}
                              </li>
                            ))}
                          </ul>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Achievements & Certifications ─────────────────── */}
        {certifications.length > 0 && (
          <section className="page-break-avoid">
            <div
              className="text-white font-bold text-xs uppercase tracking-wider py-1 px-5 rounded-full inline-block mb-3 shadow-xs"
              style={{ backgroundColor: accent }}
            >
              Achievements
            </div>
            <ul className="list-disc ml-5 space-y-1 text-gray-800">
              {certifications.map((cert) => (
                <li key={cert.id} style={{ fontSize: s(9) }}>
                  <span className="font-semibold text-black">{cert.name}</span>
                  {cert.issuer ? ` – ${cert.issuer}` : ""}
                  {cert.date ? ` (${cert.date})` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
