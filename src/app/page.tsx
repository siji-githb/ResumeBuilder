"use client";

import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/resume-store";
import {
  Plus,
  FileText,
  MoreVertical,
  Copy,
  Trash2,
  Clock,
  LayoutDashboard,
  ArrowRight,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ResumeRenderer from "@/components/templates/ResumeRenderer";

export default function DashboardPage() {
  const router = useRouter();
  const { resumes, deleteResume, duplicateResume, setActiveResume } =
    useResumeStore();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [resumeToDelete, setResumeToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const triggerButtonRef = useRef<HTMLElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const dialogCardRef = useRef<HTMLDivElement | null>(null);

  const closeDeleteDialog = () => {
    setResumeToDelete(null);
    // Restore focus to the triggering Delete menu button when closed
    requestAnimationFrame(() => {
      if (triggerButtonRef.current && document.contains(triggerButtonRef.current)) {
        triggerButtonRef.current.focus();
      }
    });
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = () => setMenuOpen(null);
    if (menuOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [menuOpen]);

  // Move keyboard focus into the dialog when opened
  useEffect(() => {
    if (resumeToDelete) {
      const timer = setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [resumeToDelete]);

  // Handle Escape key to close delete modal or menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (resumeToDelete) {
          e.preventDefault();
          closeDeleteDialog();
        } else if (menuOpen) {
          setMenuOpen(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resumeToDelete, menuOpen]);

  // Trap keyboard focus within the dialog
  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeDeleteDialog();
      return;
    }

    if (e.key === "Tab") {
      const dialog = dialogCardRef.current;
      if (!dialog) return;

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const handleOpenResume = (id: string) => {
    setActiveResume(id);
    router.push(`/editor/${id}`);
  };

  const handleDuplicate = (id: string) => {
    duplicateResume(id);
    setMenuOpen(null);
  };

  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e6e6e6] text-[#1d1d1f]">
      {/* Background content made inert when delete dialog is open */}
      <div
        inert={resumeToDelete ? true : undefined}
        aria-hidden={Boolean(resumeToDelete) || undefined}
        className="flex-1 flex flex-col"
      >
        {/* ── Apple Frosted Header ──────────────────────────────── */}
      <header className="sticky top-0 z-50 apple-frosted-nav">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Resume Builder Logo"
              className="w-10 h-10 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
            />
            <div>
              <h1 className="text-base font-bold text-[#1d1d1f] tracking-tight flex items-center gap-1.5">
                Resume Builder
              </h1>
              <p className="text-[11px] text-[#86868b] font-medium -mt-0.5">
                Build by ciddd.dev
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => router.push("/templates/new")}
              className="btn-primary text-xs px-4 py-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Resume</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        {/* Title & Stats Pill */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/5 shadow-[0_2px_6px_rgba(0,0,0,0.03)] text-[11px] font-semibold text-[#305CDE] mb-2">
              <LayoutDashboard className="w-3 h-3 text-[#305CDE]" />
              <span>Dashboard</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#1d1d1f] tracking-tight">
              My Resumes
            </h2>
            <p className="text-sm text-[#5a5a5e] mt-1 font-normal">
              Create, customize, and export professional resumes.
            </p>
          </div>

          <div className="text-xs font-medium text-[#86868b] bg-white px-3.5 py-1.5 rounded-full border border-black/5 shadow-xs">
            {resumes.length} {resumes.length === 1 ? "document" : "documents"} saved
          </div>
        </div>

        {/* ── Content: Empty State OR Populated Grid ────────── */}
        {resumes.length === 0 ? (
          <div className="w-full clay-card p-12 sm:p-16 text-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-[#305CDE]/10 text-[#305CDE] flex items-center justify-center mx-auto mb-5 shadow-[0_4px_12px_rgba(48,92,222,0.12)]">
              <FileText className="w-8 h-8 text-[#305CDE]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">No resumes yet</h3>
            <p className="text-sm text-[#5a5a5e] mt-2 mb-8 max-w-lg mx-auto leading-relaxed">
              Create your first professional resume with ATS-friendly templates.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <button
                onClick={() => router.push("/templates/new")}
                className="btn-primary text-sm px-6 py-2.5 shadow-clay-btn font-semibold"
                id="create-first-resume"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Resume</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
            {/* Create New Card */}
            <button
              id="create-new-resume"
              onClick={() => router.push("/templates/new")}
              className="clay-card group flex flex-col items-center justify-center min-h-75 border-2 border-dashed border-[#c8c8cc] hover:border-[#305CDE] cursor-pointer p-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#305CDE]/10 group-hover:bg-[#305CDE] flex items-center justify-center mb-4 transition-all duration-200 shadow-[0_3px_8px_rgba(48,92,222,0.1)] group-hover:shadow-[0_8px_20px_rgba(48,92,222,0.4)]">
                <Plus className="w-8 h-8 text-[#305CDE] group-hover:text-white transition-colors duration-200" />
              </div>
              <span className="text-[#1d1d1f] font-bold text-sm tracking-tight group-hover:text-[#305CDE] transition-colors">
                Create New Resume
              </span>
              <span className="text-[#86868b] text-xs mt-1 font-medium">
                Choose from curated ATS-friendly templates
              </span>
            </button>

            {/* Existing Resume Cards */}
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="clay-card group relative flex flex-col overflow-hidden cursor-pointer"
                onClick={() => handleOpenResume(resume.id)}
              >
                {/* Mini Preview Box */}
                <div className="relative bg-white overflow-hidden border-b border-black/5" style={{ height: "210px" }}>
                  <div
                    className="origin-top-left"
                    style={{
                      transform: "scale(0.28)",
                      width: "8.5in",
                      minHeight: "11in",
                      pointerEvents: "none",
                    }}
                  >
                    <ResumeRenderer data={resume} />
                  </div>
                  {/* Subtle hover gradient scrim */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1d1d1f] bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md">
                      Open Editor <ArrowRight className="w-3 h-3 text-[#305CDE]" />
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-white flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <h3 className="text-sm font-bold text-[#1d1d1f] truncate tracking-tight">
                      {resume.settings.documentTitle || "Untitled Resume"}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-[#305CDE]" />
                      <span className="text-xs text-[#86868b]">
                        {getRelativeTime(resume.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Context Menu */}
                  <div className="relative shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === resume.id ? null : resume.id);
                      }}
                      className="p-1.5 rounded-xl hover:bg-[#e6e6e6]/60 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                      title="Resume options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {menuOpen === resume.id && (
                      <div
                        className="absolute right-0 bottom-full mb-1.5 w-40 bg-white border border-black/10 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] py-1.5 z-50 animate-scale-in"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleDuplicate(resume.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#1d1d1f] hover:bg-[#305CDE]/8 hover:text-[#305CDE] transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#305CDE]" />
                          Duplicate
                        </button>
                        <button
                          onClick={(e) => {
                            triggerButtonRef.current = e.currentTarget;
                            setResumeToDelete({
                              id: resume.id,
                              title: resume.settings.documentTitle || "Untitled Resume",
                            });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#ef4444] hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#ef4444]" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      </div>

      {/* ── Delete Confirmation Modal ──────────────────────── */}
      {resumeToDelete && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fade-in"
          onClick={() => closeDeleteDialog()}
        >
          <div
            ref={dialogCardRef}
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)] border border-black/8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleDialogKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            tabIndex={-1}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-[#ef4444] flex items-center justify-center shrink-0 shadow-xs">
                <Trash2 className="w-6 h-6 text-[#ef4444]" />
              </div>
              <button
                type="button"
                onClick={() => closeDeleteDialog()}
                className="p-1.5 rounded-xl hover:bg-black/5 text-[#86868b] hover:text-[#1d1d1f] transition-colors cursor-pointer"
                title="Cancel"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 id="delete-modal-title" className="text-lg font-bold text-[#1d1d1f] tracking-tight">
                Delete Resume?
              </h3>
              <p className="text-xs text-[#5a5a5e] mt-2 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#1d1d1f]">"{resumeToDelete.title}"</span>?
                This action cannot be undone and your resume will be permanently removed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-black/6">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={() => closeDeleteDialog()}
                className="btn-ghost text-xs px-4 py-2 font-semibold text-[#5a5a5e] hover:text-[#1d1d1f] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteResume(resumeToDelete.id);
                  setResumeToDelete(null);
                  setMenuOpen(null);
                  triggerButtonRef.current = null;
                }}
                className="bg-[#ef4444] hover:bg-[#dc2626] active:bg-[#b91c1c] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-[0_4px_12px_rgba(239,68,68,0.35)] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
                <span>Delete Resume</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
