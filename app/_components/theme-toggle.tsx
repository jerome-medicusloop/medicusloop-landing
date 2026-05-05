'use client'

import type { CSSProperties } from 'react'
import { useCallback, useLayoutEffect, useState } from 'react'

const STORAGE_KEY = 'medicusloop-theme'

type ThemeChoice = 'light' | 'dark'

function applyDomTheme(mode: ThemeChoice) {
  document.documentElement.setAttribute('data-theme', mode)
}

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<ThemeChoice>('light')

  useLayoutEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const mode: ThemeChoice = raw === 'dark' ? 'dark' : 'light'
      setThemeState(mode)
      applyDomTheme(mode)
    } catch {
      setThemeState('light')
      applyDomTheme('light')
    }
  }, [])

  const setTheme = useCallback((mode: ThemeChoice) => {
    setThemeState(mode)
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      /* ignore */
    }
    applyDomTheme(mode)
  }, [])

  const cycle = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  const icon = theme === 'light' ? 'light_mode' : 'dark_mode'

  const iconStyle: CSSProperties =
    theme === 'light'
      ? { fontSize: '22px', color: 'var(--accent-gold)', fontVariationSettings: "'FILL' 1" }
      : { fontSize: '22px', color: 'var(--accent-violet)', fontVariationSettings: "'FILL' 1" }

  const ariaLabel =
    theme === 'light'
      ? 'Cliquer pour passer en mode sombre.'
      : 'Cliquer pour passer en mode clair.'

  const tooltipVisible =
    theme === 'light' ? 'Basculer en mode sombre.' : 'Basculer en mode clair.'

  const srText = theme === 'light' ? 'Mode clair' : 'Mode sombre'

  return (
    <button
      type="button"
      className="nav-theme-btn"
      onClick={cycle}
      aria-label={ariaLabel}
      title={tooltipVisible}
    >
      <span className="material-symbols-outlined" style={iconStyle} aria-hidden="true">
        {icon}
      </span>
      <span
        className="nav-theme-tooltip"
        aria-hidden="true"
        style={{ position: 'absolute' }}
      >
        {tooltipVisible}
      </span>
      <span className="nav-theme-sr">{srText}</span>
    </button>
  )
}
