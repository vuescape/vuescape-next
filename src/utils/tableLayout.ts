/**
 * The class of the app shell's content container (see App.vue). Its bottom is the bottom of the page's laid-out
 * content, including the shell's padding that keeps content clear of the fixed footer.
 */
export const APP_SHELL_CONTENT_CLASS = 'app__container--scroll'

/**
 * The classes of a report layout's side-by-side panes (see ReportLayoutRenderer.vue): the container of the panes, and
 * each pane's content.
 */
export const SPLIT_PANES_CLASS = 'report-layout__panes'
export const SPLIT_PANE_CLASS = 'report-layout__pane'

/**
 * Space to leave below a table when it is outside the app shell (e.g. in a dialog), where it cannot be measured.
 */
export const FALLBACK_SPACE_BELOW_TABLE = 84

/**
 * The most cells (rows × columns) a table can have and still have its virtual scroller only append rows. Appending
 * never removes rows or positions them by the fixed `itemSize`, so rows can wrap to any height without the scroll
 * position drifting. Bigger tables recycle rows to keep the page small, which needs every row to be exactly
 * `itemSize` tall. Counted in cells, not rows, since cells are what the page has to render.
 */
export const APPEND_ONLY_MAX_CELLS = 10_000

/**
 * How much the layout adds below an element, down to the bottom of the app shell's content: the padding of whatever
 * contains it (tab panels, panes) and the shell's room for the fixed footer. Measured rather than assumed, since
 * each of those has changed before and any drift shows as a page scrollbar.
 *
 * Measures to the shell's content container, not anything above it: the page wrapper has a min-height of the
 * screen, which would count empty space as layout.
 *
 * In a pane beside other panes, a taller pane next to it isn't space below it, so this measures to the bottom of its
 * own pane's content, then from the bottom of the panes to the bottom of the shell's content.
 */
export function getSpaceBelow(element: HTMLElement): number {
  const shellContent = element.closest(`.${APP_SHELL_CONTENT_CLASS}`)
  if (!shellContent) {
    return FALLBACK_SPACE_BELOW_TABLE
  }

  const pane = element.closest(`.${SPLIT_PANE_CLASS}`)
  const panes = pane?.closest(`.${SPLIT_PANES_CLASS}`)
  if (pane && panes) {
    // The panes' own bottom border and padding are below every pane
    const panesStyle = getComputedStyle(panes)
    const panesEdge =
      parseFloat(panesStyle.borderBottomWidth) + parseFloat(panesStyle.paddingBottom) || 0
    return (
      getDistanceBetweenBottoms(element, pane) +
      panesEdge +
      getDistanceBetweenBottoms(panes, shellContent)
    )
  }

  return getDistanceBetweenBottoms(element, shellContent)
}

function getDistanceBetweenBottoms(inner: Element, outer: Element): number {
  return Math.max(0, outer.getBoundingClientRect().bottom - inner.getBoundingClientRect().bottom)
}
