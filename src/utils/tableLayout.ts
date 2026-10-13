/**
 * The class of the app shell's content container (see App.vue). Its bottom is the bottom of the page's laid-out
 * content, including the shell's padding that keeps content clear of the fixed footer.
 */
export const APP_SHELL_CONTENT_CLASS = 'app__container--scroll'

/**
 * Space to leave below a table when it is outside the app shell (e.g. in a dialog), where it cannot be measured.
 */
export const FALLBACK_SPACE_BELOW_TABLE = 84

/**
 * How much the layout adds below an element, down to the bottom of the app shell's content: the padding of whatever
 * contains it (tab panels, panes) and the shell's room for the fixed footer. Measured rather than assumed, since
 * each of those has changed before and any drift shows as a page scrollbar.
 *
 * Measures to the shell's content container, not anything above it: the page wrapper has a min-height of the
 * screen, which would count empty space as layout.
 */
export function getSpaceBelow(element: HTMLElement): number {
  const shellContent = element.closest(`.${APP_SHELL_CONTENT_CLASS}`)
  if (!shellContent) {
    return FALLBACK_SPACE_BELOW_TABLE
  }

  const spaceBelow =
    shellContent.getBoundingClientRect().bottom - element.getBoundingClientRect().bottom
  return Math.max(0, spaceBelow)
}
