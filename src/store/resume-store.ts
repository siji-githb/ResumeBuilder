"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Resume, TemplateId } from "@/types/resume";
import { createBlankResume, generateId } from "@/lib/sample-data";

// ─── Store Shape ───────────────────────────────────────────────────

interface ResumeStore {
  /** All resumes keyed locally. */
  resumes: Resume[];

  /** Currently active resume id (for the editor). */
  activeResumeId: string | null;

  // ── CRUD ──────────────────────────────────────────────────────────

  /** Create a new resume with a given template pre-selected and return its id. */
  createResume: (templateId: TemplateId, initialColor?: string) => string;

  /** Duplicate an existing resume and return the new id. */
  duplicateResume: (id: string) => string | null;

  /** Delete a resume by id. */
  deleteResume: (id: string) => void;

  /** Set the active resume being edited. */
  setActiveResume: (id: string) => void;

  // ── Field Updates (granular to avoid full-object replacements) ───

  /** Shallow-merge partial updates into any top-level key of the active resume. */
  updateActiveResume: (patch: Partial<Resume>) => void;

  /** Replace a specific field on the active resume. */
  updateActiveField: <K extends keyof Resume>(
    key: K,
    value: Resume[K]
  ) => void;

  // ── Helpers ───────────────────────────────────────────────────────

  /** Get a resume by id. */
  getResume: (id: string) => Resume | undefined;

  /** Export all resumes as a JSON string (for backup). */
  exportAll: () => string;

  /** Import resumes from a JSON string (merge, not overwrite). */
  importAll: (json: string) => void;
}

// ─── Store Implementation ──────────────────────────────────────────

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumes: [],
      activeResumeId: null,

      createResume: (templateId, initialColor) => {
        const resume = createBlankResume(templateId);
        if (initialColor) {
          resume.settings.primaryColor = initialColor;
        }

        set((state) => ({
          resumes: [...state.resumes, resume],
          activeResumeId: resume.id,
        }));
        return resume.id;
      },

      duplicateResume: (id) => {
        const original = get().resumes.find((r) => r.id === id);
        if (!original) return null;

        const now = new Date().toISOString();
        const copy: Resume = {
          ...structuredClone(original),
          id: generateId(),
          createdAt: now,
          updatedAt: now,
          settings: {
            ...original.settings,
            documentTitle: `${original.settings.documentTitle} (Copy)`,
          },
        };

        set((state) => ({ resumes: [...state.resumes, copy] }));
        return copy.id;
      },

      deleteResume: (id) => {
        set((state) => ({
          resumes: state.resumes.filter((r) => r.id !== id),
          activeResumeId:
            state.activeResumeId === id ? null : state.activeResumeId,
        }));
      },

      setActiveResume: (id) => {
        set({ activeResumeId: id });
      },

      updateActiveResume: (patch) => {
        set((state) => {
          const idx = state.resumes.findIndex(
            (r) => r.id === state.activeResumeId
          );
          if (idx === -1) return state;
          const updated = [...state.resumes];
          updated[idx] = {
            ...updated[idx],
            ...patch,
            updatedAt: new Date().toISOString(),
          };
          return { resumes: updated };
        });
      },

      updateActiveField: (key, value) => {
        set((state) => {
          const idx = state.resumes.findIndex(
            (r) => r.id === state.activeResumeId
          );
          if (idx === -1) return state;
          const updated = [...state.resumes];
          updated[idx] = {
            ...updated[idx],
            [key]: value,
            updatedAt: new Date().toISOString(),
          };
          return { resumes: updated };
        });
      },

      getResume: (id) => {
        return get().resumes.find((r) => r.id === id);
      },

      exportAll: () => {
        return JSON.stringify(get().resumes, null, 2);
      },

      importAll: (json) => {
        try {
          const imported: Resume[] = JSON.parse(json);
          if (!Array.isArray(imported)) return;
          set((state) => {
            const existingIds = new Set(state.resumes.map((r) => r.id));
            const newResumes = imported.filter((r) => !existingIds.has(r.id));
            return { resumes: [...state.resumes, ...newResumes] };
          });
        } catch {
          console.error("Failed to import resumes: invalid JSON");
        }
      },
    }),
    {
      name: "resume-helper-storage",
    }
  )
);
