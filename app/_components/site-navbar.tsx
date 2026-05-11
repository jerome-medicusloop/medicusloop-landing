'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { inscriptionCtaFromListePleine } from '@/lib/pionnier-constants'
import MedicusLoopLogo from './medicusloop-logo'

const NAV_SECTION_LINKS = [
  { label: 'Comment ça marche', href: '/#comment-ca-marche' },
  { label: 'Comparatif', href: '/#comparatif' },
  { label: 'LoopExpérience', href: '/#loopexperience' },
  { label: 'Pionniers', href: '/#pionniers' },
  { label: 'Tarifs', href: '/#tarifs' },
] as const

/** Liens du tiroir mobile : accueil + mêmes ancres que la nav desktop (`/#` pour les sous-pages). */
const NAV_HOME = { label: 'Accueil', href: '/#intro' } as const
const NAV_DRAWER_LINKS = [NAV_HOME, ...NAV_SECTION_LINKS]

type NavbarProps = {
  /** Places Pionniers épuisées : CTA « M’inscrire » au lieu de « Devenir Pionnier ». */
  listePleinePionniers?: boolean
}

export default function Navbar({ listePleinePionniers = false }: NavbarProps) {
  const cta = inscriptionCtaFromListePleine(listePleinePionniers)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerTitleId = useId()

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  useEffect(() => {
    if (!drawerOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [drawerOpen, closeDrawer])

  const drawerMarkup = (
    <div className="nav-drawer-root" role="presentation">
      <button
        type="button"
        className="nav-drawer-backdrop"
        aria-label="Fermer le menu"
        onClick={closeDrawer}
      />
      <div
        id="nav-drawer-panel"
        className="nav-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={drawerTitleId}
      >
        <div className="nav-drawer-panel__head">
          <a
            id={drawerTitleId}
            href="/#intro"
            className="nav-drawer-panel__brand"
            onClick={closeDrawer}
            aria-label="MedicusLoop — menu de navigation"
          >
            <MedicusLoopLogo className="nav-drawer-panel__logo" />
          </a>
          <button
            type="button"
            className="nav-drawer-close nav-theme-btn"
            onClick={closeDrawer}
            aria-label="Fermer le menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }} aria-hidden="true">
              close
            </span>
          </button>
        </div>
        <nav className="nav-drawer-links" aria-label="Navigation (menu mobile)">
          {NAV_DRAWER_LINKS.map((link) => (
            <a key={link.href + link.label} href={link.href} className="nav-drawer-link" onClick={closeDrawer}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )

  const drawer =
    drawerOpen && typeof document !== 'undefined' ? createPortal(drawerMarkup, document.body) : null

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'var(--navbar-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--navbar-border)',
          boxShadow: 'var(--navbar-shadow)',
          padding: `0 var(--ml-content-inline)`,
        }}
        aria-label="Navigation principale"
      >
        <div
          style={{
            maxWidth: 'var(--ml-content-max)',
            margin: '0 auto',
            padding: 0,
            height: 'var(--ml-navbar-inner-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div
            className="nav-brand-cluster"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}
          >
            <button
              type="button"
              className="nav-theme-btn nav-drawer-toggle"
              onClick={() => setDrawerOpen(true)}
              aria-expanded={drawerOpen}
              aria-controls="nav-drawer-panel"
              aria-haspopup="dialog"
              aria-label="Ouvrir le menu des sections"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }} aria-hidden="true">
                menu
              </span>
            </button>
            <a
              href="/#intro"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                textDecoration: 'none',
                color: 'inherit',
              }}
              aria-label="MedicusLoop — retour à l’accueil"
            >
              <MedicusLoopLogo />
            </a>
          </div>

          <div className="nav-links-wrap">
            <nav
              className="nav-links"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}
              aria-label="Sections de la page"
            >
              {NAV_SECTION_LINKS.map((link) => (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  style={{
                    color: 'var(--nav-link)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    transition: 'color 200ms, background 200ms',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                  className="nav-link"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="nav-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <a href="/#inscription" className="nav-cta" aria-label={cta.ariaNav}>
              <span className="material-symbols-outlined nav-cta__icon" aria-hidden="true">
                {cta.icon}
              </span>
              <span className="nav-cta__label">{cta.label}</span>
            </a>
          </div>
        </div>
      </nav>
      {drawer}
    </>
  )
}
