"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { applySmartPageBreaks } from "@/lib/page-breaks";

interface Props {
  /** id of the #resume-print-target element to observe */
  targetId: string;
  /** Height of one page in CSS pixels (1056 for Letter, 1123 for A4) */
  pageHeightPx: number;
  /** Page margin in CSS pixels (96 for 1in / 2.54cm, 48 for 0.5in / 1.27cm) */
  marginPx?: number;
  /** Callback fired whenever the detected page count changes */
  onPageCountChange?: (pageCount: number) => void;
}

/**
 * Renders realistic page breaks between sheets in the live resume preview.
 *
 * Positioned as an absolutely-placed sibling of #resume-print-target so it is
 * never captured by html2canvas during PDF export. A ResizeObserver watches
 * the target element and redraws the rulers whenever content height changes.
 *
 * Also applies smart page breaks so elements crossing page boundaries are pushed
 * cleanly into the next page, guaranteeing the ruler always sits in empty white space
 * and no text is ever sliced.
 */
export default function PageBreakRuler({
  targetId,
  pageHeightPx,
  marginPx = 48,
  onPageCountChange,
}: Props) {
  const [pageCount, setPageCount] = useState(1);
  const isPaginatingRef = useRef(false);

  const measureAndPaginate = useCallback(() => {
    const el = document.getElementById(targetId);
    if (!el || isPaginatingRef.current) return;

    try {
      isPaginatingRef.current = true;
      const { pageCount: newCount } = applySmartPageBreaks(
        el,
        pageHeightPx,
        marginPx
      );
      setPageCount(newCount);
      onPageCountChange?.(newCount);
    } finally {
      setTimeout(() => {
        isPaginatingRef.current = false;
      }, 40);
    }
  }, [targetId, pageHeightPx, marginPx, onPageCountChange]);

  useEffect(() => {
    measureAndPaginate();

    const el = document.getElementById(targetId);
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      if (isPaginatingRef.current) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        measureAndPaginate();
      }, 60);
    });

    ro.observe(el);
    return () => {
      clearTimeout(timeoutId);
      ro.disconnect();
    };
  }, [measureAndPaginate, targetId]);

  // Only render rulers when content spans more than one page
  if (pageCount <= 1) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none print:hidden"
      style={{ zIndex: 10 }}
    >
      {Array.from({ length: pageCount - 1 }, (_, i) => {
        const top = (i + 1) * pageHeightPx;
        return (
          <div
            key={i}
            className="absolute left-0 right-0 flex items-center justify-center"
            style={{
              top: top - 12,
              height: 24,
            }}
          >
            {/* Realistic desk canvas gap band matching editor background */}
            <div
              className="absolute -inset-x-4 h-full bg-[#e6e6e6]"
              style={{
                boxShadow:
                  "inset 0 3px 6px -2px rgba(0,0,0,0.12), inset 0 -3px 6px -2px rgba(0,0,0,0.12)",
              }}
            />

            {/* Outgoing page bottom edge separator */}
            <div className="absolute top-0 -inset-x-4 h-[1.5px] bg-[#c4c4c8]" />

            {/* Incoming page top edge separator */}
            <div className="absolute bottom-0 -inset-x-4 h-[1.5px] bg-[#c4c4c8]" />

            {/* Floating page number badge */}
            <div className="relative z-10 flex items-center gap-1.5 bg-white px-3 py-0.5 rounded-full border border-black/10 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#305CDE]" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#5a5a5e] select-none">
                Page {i + 2}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
