import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface NavLink {
  label: string
  icon: string
  route: string
  description?: string
}

export interface NavigationContentConfig {
  title?: string
  navLinks?: NavLink[]
  dialogContentHtml?: string
}

// Default navigation configuration
const DEFAULT_TITLE = 'Menu'
const DEFAULT_NAV_LINKS: Array<NavLink> = []
const DEFAULT_DIALOG_CONTENT_HTML = '<p>This is the navigation menu.</p>'

/**
 * A Pinia store for managing navigation state and content.
 *
 * @returns {Object} The navigation store containing:
 * - `isPinned` {Ref<boolean>} - Whether the navigation is pinned.
 * - `isOpen` {Ref<boolean>} - Whether the navigation drawer is open (overlay mode).
 * - `navWidth` {Ref<number>} - The width of the navigation drawer in pixels.
 * - `title` {Ref<string>} - The navigation title.
 * - `navLinks` {Ref<NavLink[]>} - The navigation links.
 * - `dialogContentHtml` {Ref<string>} - The HTML content for the info dialog.
 * - `setNavigationContent` {Function} - Update navigation content (title, navLinks, and/or dialogContentHtml).
 * - `resetNavigationContent` {Function} - Reset navigation content to defaults.
 * - `toggleNavPin` {Function} - Toggle the pinned state.
 * - `openNav` {Function} - Open the navigation drawer.
 * - `closeNav` {Function} - Close the navigation drawer.
 * - `setNavWidth` {Function} - Set the navigation width.
 */
export const useNavigationStore = defineStore('useNavigationStore', () => {
  // UI State
  const isPinned = ref(false)
  const isOpen = ref(false) // Whether drawer is open in overlay mode
  const navWidth = ref(360) // Default width in pixels

  // Content State
  const title = ref(DEFAULT_TITLE)
  const navLinks = ref<NavLink[]>([...DEFAULT_NAV_LINKS])
  const dialogContentHtml = ref(DEFAULT_DIALOG_CONTENT_HTML)

  /**
   * Update navigation content.
   * @param config - Partial configuration to update (title, navLinks, and/or dialogContentHtml)
   */
  function setNavigationContent(config: NavigationContentConfig) {
    if (config.title !== undefined) {
      title.value = config.title
    }
    if (config.navLinks !== undefined) {
      navLinks.value = [...config.navLinks]
    }
    if (config.dialogContentHtml !== undefined) {
      dialogContentHtml.value = config.dialogContentHtml
    }
  }

  /**
   * Reset navigation content to default values.
   */
  function resetNavigationContent() {
    title.value = DEFAULT_TITLE
    navLinks.value = [...DEFAULT_NAV_LINKS]
    dialogContentHtml.value = DEFAULT_DIALOG_CONTENT_HTML
  }

  /**
   * Toggle the pinned state of the navigation.
   */
  function toggleNavPin() {
    isPinned.value = !isPinned.value
  }

  /**
   * Open the navigation drawer (when not pinned).
   */
  function openNav() {
    if (!isPinned.value) {
      isOpen.value = true
    }
  }

  /**
   * Close the navigation drawer.
   */
  function closeNav() {
    isOpen.value = false
  }

  /**
   * Set the navigation width.
   * @param width - The new width in pixels
   */
  function setNavWidth(width: number) {
    navWidth.value = width
  }

  return {
    // UI State
    isPinned,
    isOpen,
    navWidth,
    // Content State
    title,
    navLinks,
    dialogContentHtml,
    // Content Methods
    setNavigationContent,
    resetNavigationContent,
    // UI Control Methods
    toggleNavPin,
    openNav,
    closeNav,
    setNavWidth
  }
})
