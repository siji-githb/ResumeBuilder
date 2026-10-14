/**
 * src/lib/page-breaks.ts
 *
 * Automatically detects elements crossing physical page boundaries (Letter / A4)
 * and shifts them cleanly down to the top of the next page.
 *
 * Guarantees:
 * - No text line, bullet point, heading, or item is ever sliced in half.
 * - Section headings are kept with their content (no orphan headings).
 * - Page cut lines always fall in clean white space.
 * - Accurate page count: Measures the actual bottommost text/content element
 *   so empty phantom pages are NEVER created.
 * - Sized to exact full page multiples (pageCount * pageHeightPx)
 *   so Page 2 or any next page has the exact same full physical paper height as Page 1.
 */

export interface PageBreakResult {
  pageCount: number;
  totalPaperHeight: number;
}

/**
 * Finds the bottommost content element inside the container
 * relative to the container's top.
 */
function getRealContentBottom(container: HTMLElement): number {
  const containerRect = container.getBoundingClientRect();
  const candidates = container.querySelectorAll<HTMLElement>(
    "section, header, footer, .page-break-avoid, [class*='space-y'] > div, .grid > div, p, li, h1, h2, h3, h4"
  );

  let maxBottom = 0;
  candidates.forEach((el) => {
    // Only inspect leaf nodes or block containers that have real layout
    if (el.children.length === 0 || el.tagName === "SECTION" || el.classList.contains("page-break-avoid")) {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0 && rect.width > 0) {
        const bottom = rect.bottom - containerRect.top;
        if (bottom > maxBottom) {
          maxBottom = bottom;
        }
      }
    }
  });

  return maxBottom;
}

export function applySmartPageBreaks(
  container: HTMLElement,
  pageHeightPx: number,
  marginPx: number = 96
): PageBreakResult {
  if (!container) return { pageCount: 1, totalPaperHeight: pageHeightPx };

  // 1. Release forced heights so the flex layout sizes to content naturally.
  //    Use "auto" not "" — empty string collapses flex:1 children to zero height.
  container.style.height = "auto";
  container.style.minHeight = "auto";

  const rendererWrapper = container.firstElementChild as HTMLElement | null;
  if (rendererWrapper) {
    rendererWrapper.style.height = "auto";
    rendererWrapper.style.minHeight = "auto";

    const templateRoot = rendererWrapper.firstElementChild as HTMLElement | null;
    if (templateRoot) {
      templateRoot.style.height = "auto";
      templateRoot.style.minHeight = "auto";
    }
  }

  // 2. Reset any previously pushed elements
  const previouslyPushed = container.querySelectorAll<HTMLElement>(
    "[data-pushed-page-break='true']"
  );
  previouslyPushed.forEach((el) => {
    el.style.marginTop = "";
    el.removeAttribute("data-pushed-page-break");
  });

  const maxPages = 8;

  // 3. Run smart page breaks pass for each boundary
  for (let page = 1; page <= maxPages; page++) {
    const boundary = page * pageHeightPx;
    // Printable bottom of the outgoing page
    const cutLine = boundary - marginPx;
    // Printable top of the incoming page (boundary + exact margin)
    const targetBoundaryTop = boundary + marginPx;

    // Check where the actual content ends before deciding if we need to check this boundary
    const currentBottom = getRealContentBottom(container);
    // If real content does not reach into the bottom margin of this page, no split is needed
    if (currentBottom <= cutLine) {
      break;
    }

    // A single page boundary may have multiple elements crossing it across parallel columns
    // (e.g. ModernSidebar has both a left <aside> and right <main>, or multi-column grids).
    // We iterate on this boundary until NO elements cross cutLine or sit in [cutLine, targetBoundaryTop).
    let boundaryPass = 0;
    const maxPassesPerPage = 8;

    while (boundaryPass < maxPassesPerPage) {
      boundaryPass++;
      const currentContainerRect = container.getBoundingClientRect();

      const allCandidates = Array.from(
        container.querySelectorAll<HTMLElement>(
          ".page-break-avoid, section, li, [class*='space-y'] > div, .grid > div"
        )
      );

      let candidateToPush: HTMLElement | null = null;
      let calculatedPushDown = 0;

      for (let i = 0; i < allCandidates.length; i++) {
        const el = allCandidates[i];
        if (!el.isConnected) continue;

        const rect = el.getBoundingClientRect();
        if (rect.height <= 0 || rect.width <= 0) continue;

        const elTop = rect.top - currentContainerRect.top;
        const elBottom = rect.bottom - currentContainerRect.top;

        // Element already starts on or past the new page printable top
        if (elTop >= targetBoundaryTop) {
          continue;
        }

        // Check if element:
        // (a) crosses the bottom cutLine (straddles page 1 and page margin), OR
        // (b) starts inside the forbidden margin band [cutLine, targetBoundaryTop)
        const crossesCutLine = elTop < cutLine && elBottom > cutLine;
        const inMarginBand = elTop >= cutLine && elTop < targetBoundaryTop;

        if (crossesCutLine || inMarginBand) {
          // If this element contains child candidates that ALSO match,
          // check if any child candidate finishes cleanly before cutLine.
          // If so, keep the parent container and push the child item instead.
          let hasChildFittingOnPage = false;
          for (let j = 0; j < allCandidates.length; j++) {
            const child = allCandidates[j];
            if (child !== el && el.contains(child)) {
              const childRect = child.getBoundingClientRect();
              if (childRect.height <= 0 || childRect.width <= 0) continue;

              const childTop = childRect.top - currentContainerRect.top;
              const childBottom = childRect.bottom - currentContainerRect.top;
              if (childTop < cutLine && childBottom > 0 && childBottom <= cutLine) {
                hasChildFittingOnPage = true;
                break;
              }
            }
          }

          if (hasChildFittingOnPage) {
            // Container has leading children that fit on this page — keep container here
            // and let the loop evaluate its children
            continue;
          }

          // If element is larger than 85% of a page, don't push as a whole;
          // let smaller children (e.g. li's) be pushed instead
          if (rect.height >= pageHeightPx * 0.85) {
            continue;
          }

          let targetEl: HTMLElement = el;

          // Check if targetEl is preceded by an h1/h2/h3 heading in its section that would become orphaned
          const parentSection = el.closest("section");
          if (parentSection && parentSection !== el) {
            const heading = parentSection.querySelector("h1, h2, h3, header");
            if (heading) {
              const headingRect = heading.getBoundingClientRect();
              const headingTop = headingRect.top - currentContainerRect.top;
              // If heading is near the cutLine (within 80px before cutLine) or already past it,
              // push the entire parent section so the heading and content stay together
              if (headingTop >= cutLine - 80 && headingTop < targetBoundaryTop) {
                targetEl = parentSection;
              }
            }
          }

          const targetRect = targetEl.getBoundingClientRect();
          const targetTop = targetRect.top - currentContainerRect.top;
          const pushDown = targetBoundaryTop - targetTop;

          if (pushDown > 0) {
            candidateToPush = targetEl;
            calculatedPushDown = pushDown;
            break;
          }
        }
      }

      if (candidateToPush && calculatedPushDown > 0) {
        const currentMargin = parseFloat(candidateToPush.style.marginTop || "0");
        candidateToPush.style.marginTop = `${currentMargin + calculatedPushDown}px`;
        candidateToPush.setAttribute("data-pushed-page-break", "true");
      } else {
        // No candidates on this boundary need pushing — boundary is clean
        break;
      }
    }
  }

  // 4. Measure where the actual content ends after shifts
  const actualContentBottom = getRealContentBottom(container);
  // Add bottom margin buffer
  const effectiveHeight = actualContentBottom + marginPx;

  // Calculate real page count using a 20px tolerance threshold so tiny subpixel overflows
  // never spawn a phantom empty page
  const pageCount = Math.max(
    1,
    Math.ceil((effectiveHeight - 20) / pageHeightPx)
  );
  const totalPaperHeight = pageCount * pageHeightPx;

  // 5. Lock the container to full whole-page dimensions
  container.style.height = `${totalPaperHeight}px`;
  container.style.minHeight = `${totalPaperHeight}px`;

  if (rendererWrapper) {
    rendererWrapper.style.height = `${totalPaperHeight}px`;
    rendererWrapper.style.minHeight = `${totalPaperHeight}px`;

    const templateRoot = rendererWrapper.firstElementChild as HTMLElement | null;
    if (templateRoot) {
      templateRoot.style.height = `${totalPaperHeight}px`;
      templateRoot.style.minHeight = `${totalPaperHeight}px`;
    }
  }

  return { pageCount, totalPaperHeight };
}
