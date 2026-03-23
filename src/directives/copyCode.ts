import type { Directive } from 'vue'

interface HTMLElementWithCopyCleanup extends HTMLElement {
  _copyCodeCleanup?: () => void
}

const COPY_TEXT = 'Copy'
const COPIED_TEXT = 'Copied!'
const RESET_DELAY_MS = 2000

const injectCopyButtons = (el: HTMLElementWithCopyCleanup) => {
  el._copyCodeCleanup?.()

  const cleanupFns: Array<() => void> = []

  el.querySelectorAll('pre.hljs').forEach((pre) => {
    if (pre.querySelector('.vuescape-copy-btn')) {
      return
    }

    const btn = document.createElement('button')
    btn.className = 'vuescape-copy-btn'
    btn.textContent = COPY_TEXT

    Object.assign(btn.style, {
      position: 'absolute',
      top: '0.375rem',
      right: '0.375rem',
      padding: '0.2rem 0.5rem',
      fontSize: '0.75rem',
      lineHeight: '1.25',
      cursor: 'pointer',
      border: '1px solid rgba(0,0,0,0.15)',
      borderRadius: '0.25rem',
      background: 'rgba(255,255,255,0.85)',
      color: '#333',
      opacity: '0',
      transition: 'opacity 0.15s'
    })

    const showBtn = () => {
      btn.style.opacity = '1'
    }
    const hideBtn = () => {
      btn.style.opacity = '0'
    }

    pre.addEventListener('mouseenter', showBtn)
    pre.addEventListener('mouseleave', hideBtn)

    let resetTimer: ReturnType<typeof setTimeout> | null = null

    const onClick = () => {
      const code = (pre.querySelector('code') as HTMLElement | null)?.innerText ?? ''
      void navigator.clipboard.writeText(code).then(() => {
        btn.textContent = COPIED_TEXT
        if (resetTimer) {
          clearTimeout(resetTimer)
        }
        resetTimer = setTimeout(() => {
          btn.textContent = COPY_TEXT
        }, RESET_DELAY_MS)
      })
    }

    btn.addEventListener('click', onClick)
    ;(pre as HTMLElement).style.position = 'relative'
    pre.appendChild(btn)

    cleanupFns.push(() => {
      pre.removeEventListener('mouseenter', showBtn)
      pre.removeEventListener('mouseleave', hideBtn)
      btn.removeEventListener('click', onClick)
      if (resetTimer) {
        clearTimeout(resetTimer)
      }
      btn.remove()
    })
  })

  el._copyCodeCleanup = () => cleanupFns.forEach((fn) => fn())
}

/**
 * Vue directive that injects hover-activated copy-to-clipboard buttons into
 * highlight.js code blocks (pre.hljs) within the bound element.
 * Uses the native Clipboard API — requires a secure context (HTTPS or localhost).
 */
const copyCodeDirective: Directive<HTMLElementWithCopyCleanup> = {
  mounted: injectCopyButtons,
  updated: injectCopyButtons,
  unmounted(el: HTMLElementWithCopyCleanup) {
    el._copyCodeCleanup?.()
  }
}

export default copyCodeDirective
