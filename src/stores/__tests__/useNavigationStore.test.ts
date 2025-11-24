import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useNavigationStore } from '../useNavigationStore'

describe('useNavigationStore', () => {
  let store: ReturnType<typeof useNavigationStore>

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useNavigationStore()
  })

  describe('Initial State', () => {
    it('has correct default UI state', () => {
      expect(store.isPinned).toBe(false)
      expect(store.isOpen).toBe(false)
      expect(store.navWidth).toBe(360)
    })

    it('has correct default content state', () => {
      expect(store.title).toBe('Menu')
      expect(store.navLinks).toEqual([])
      expect(store.dialogContentHtml).toBe('<p>This is the navigation menu.</p>')
    })
  })

  describe('setNavigationContent', () => {
    it('updates title when provided', () => {
      store.setNavigationContent({ title: 'New Title' })
      expect(store.title).toBe('New Title')
    })

    it('updates navLinks when provided', () => {
      const links = [
        { label: 'Home', icon: 'pi pi-home', route: '/home' },
        { label: 'About', icon: 'pi pi-info', route: '/about' }
      ]

      store.setNavigationContent({ navLinks: links })
      expect(store.navLinks).toEqual(links)
    })

    it('updates dialogContentHtml when provided', () => {
      const html = '<p>Custom content</p>'
      store.setNavigationContent({ dialogContentHtml: html })
      expect(store.dialogContentHtml).toBe(html)
    })

    it('updates multiple properties at once', () => {
      const config = {
        title: 'Combined Test',
        navLinks: [{ label: 'Test', icon: 'pi pi-test', route: '/test' }],
        dialogContentHtml: '<p>Combined HTML</p>'
      }

      store.setNavigationContent(config)

      expect(store.title).toBe('Combined Test')
      expect(store.navLinks).toEqual(config.navLinks)
      expect(store.dialogContentHtml).toBe('<p>Combined HTML</p>')
    })

    it('does not update properties when undefined', () => {
      store.setNavigationContent({ title: 'Test' })
      const originalLinks = store.navLinks
      const originalHtml = store.dialogContentHtml

      store.setNavigationContent({ title: 'New Test' })

      expect(store.navLinks).toBe(originalLinks)
      expect(store.dialogContentHtml).toBe(originalHtml)
    })

    it('creates a copy of navLinks array', () => {
      const links = [{ label: 'Test', icon: 'pi pi-test', route: '/test' }]
      store.setNavigationContent({ navLinks: links })

      // Modify original array
      links.push({ label: 'New', icon: 'pi pi-new', route: '/new' })

      // Store should not be affected
      expect(store.navLinks.length).toBe(1)
    })
  })

  describe('resetNavigationContent', () => {
    it('resets title to default', () => {
      store.setNavigationContent({ title: 'Custom' })
      store.resetNavigationContent()
      expect(store.title).toBe('Menu')
    })

    it('resets navLinks to default', () => {
      const links = [{ label: 'Test', icon: 'pi pi-test', route: '/test' }]
      store.setNavigationContent({ navLinks: links })
      store.resetNavigationContent()
      expect(store.navLinks).toEqual([])
    })

    it('resets dialogContentHtml to default', () => {
      store.setNavigationContent({ dialogContentHtml: '<p>Custom</p>' })
      store.resetNavigationContent()
      expect(store.dialogContentHtml).toBe('<p>This is the navigation menu.</p>')
    })
  })

  describe('toggleNavPin', () => {
    it('toggles isPinned from false to true', () => {
      expect(store.isPinned).toBe(false)
      store.toggleNavPin()
      expect(store.isPinned).toBe(true)
    })

    it('toggles isPinned from true to false', () => {
      store.isPinned = true
      store.toggleNavPin()
      expect(store.isPinned).toBe(false)
    })
  })

  describe('openNav', () => {
    it('opens drawer when not pinned', () => {
      store.isPinned = false
      store.openNav()
      expect(store.isOpen).toBe(true)
    })

    it('does not open drawer when pinned', () => {
      store.isPinned = true
      store.openNav()
      expect(store.isOpen).toBe(false)
    })
  })

  describe('closeNav', () => {
    it('closes the drawer', () => {
      store.isOpen = true
      store.closeNav()
      expect(store.isOpen).toBe(false)
    })

    it('works when drawer is already closed', () => {
      store.isOpen = false
      store.closeNav()
      expect(store.isOpen).toBe(false)
    })
  })

  describe('setNavWidth', () => {
    it('updates the navigation width', () => {
      store.setNavWidth(400)
      expect(store.navWidth).toBe(400)
    })

    it('accepts different width values', () => {
      store.setNavWidth(250)
      expect(store.navWidth).toBe(250)

      store.setNavWidth(500)
      expect(store.navWidth).toBe(500)
    })
  })

  describe('Integration scenarios', () => {
    it('handles complete navigation setup and teardown', () => {
      // Setup navigation
      store.setNavigationContent({
        title: 'Test Navigation',
        navLinks: [
          { label: 'Page 1', icon: 'pi pi-file', route: '/page1' },
          { label: 'Page 2', icon: 'pi pi-file', route: '/page2' }
        ],
        dialogContentHtml: '<p>Test dialog content</p>'
      })
      store.openNav()

      expect(store.title).toBe('Test Navigation')
      expect(store.navLinks.length).toBe(2)
      expect(store.isOpen).toBe(true)

      // Teardown
      store.closeNav()
      store.resetNavigationContent()

      expect(store.title).toBe('Menu')
      expect(store.navLinks).toEqual([])
      expect(store.isOpen).toBe(false)
    })

    it('maintains pin state independently of content', () => {
      store.toggleNavPin()
      expect(store.isPinned).toBe(true)

      store.setNavigationContent({ title: 'New Title' })
      expect(store.isPinned).toBe(true)

      store.resetNavigationContent()
      expect(store.isPinned).toBe(true)
    })
  })
})
