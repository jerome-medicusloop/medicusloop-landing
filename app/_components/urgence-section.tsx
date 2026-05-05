'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import { PIONNIER_PLACES_TOTAL } from '@/lib/pionnier-constants'

type FounderCounterProps = {
  /** Nombre d’inscrits réels (SSR), plafonné à {@link PIONNIER_PLACES_TOTAL} côté affichage. */
  placesPrises: number
  /** id du bouton « Inviter un confrère » du bandeau associé (ouvre la même popup au clic sur le lien). */
  inviterButtonId?: string
}

const PIONNIER_CONFETTI_COLORS = [
  '#ffffff',
  '#fef08a',
  '#facc15',
  '#4ade80',
  '#22c55e',
  '#34d399',
  '#86efac',
  '#60a5fa',
  '#a78bfa',
  '#fbcfe8',
]

export default function FounderCounter({ placesPrises, inviterButtonId }: FounderCounterProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const confettiFiredRef = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            if (progressRef.current) {
              progressRef.current.classList.add('animate')
            }
          }
        })
      },
      { threshold: 0.3 }
    )
    if (wrapperRef.current) observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [hasAnimated])

  const prises = Math.min(Math.max(0, placesPrises), PIONNIER_PLACES_TOTAL)
  const restantes = PIONNIER_PLACES_TOTAL - prises
  const listePleine = restantes === 0
  const fillPct = `${(100 * prises) / PIONNIER_PLACES_TOTAL}%`
  const counterStyle = { '--pionnier-fill-pct': fillPct } as CSSProperties

  useEffect(() => {
    if (!listePleine || typeof window === 'undefined') {
      confettiFiredRef.current = false
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const host = wrapperRef.current
    if (!host) return

    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.className = 'pionnier-counter__confetti'
    host.appendChild(canvas)

    const syncSize = () => {
      const rect = host.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width))
      const h = Math.max(1, Math.round(rect.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }

    syncSize()
    const ro = new ResizeObserver(() => syncSize())
    ro.observe(host)

    const fire = async () => {
      if (confettiFiredRef.current || !canvas.isConnected) return
      confettiFiredRef.current = true
      const { default: confetti } = await import('canvas-confetti')
      const shoot = confetti.create(canvas, { resize: false, useWorker: false })
      const palette = PIONNIER_CONFETTI_COLORS

      shoot({
        particleCount: 150,
        spread: 72,
        origin: { x: 0.5, y: 0.14 },
        startVelocity: 48,
        gravity: 0.92,
        ticks: 260,
        colors: palette,
        scalar: 1.65,
        drift: 0.12,
      })
      window.setTimeout(() => {
        shoot({
          particleCount: 85,
          spread: 88,
          origin: { x: 0.28, y: 0.42 },
          angle: 130,
          startVelocity: 34,
          gravity: 0.88,
          ticks: 230,
          colors: palette,
          scalar: 1.42,
          drift: 0.1,
        })
      }, 120)
      window.setTimeout(() => {
        shoot({
          particleCount: 85,
          spread: 88,
          origin: { x: 0.72, y: 0.42 },
          angle: 50,
          startVelocity: 34,
          gravity: 0.88,
          ticks: 230,
          colors: palette,
          scalar: 1.42,
          drift: 0.1,
        })
      }, 220)
      /* Zone basse (barre / pied) : très lisible sous le texte */
      window.setTimeout(() => {
        shoot({
          particleCount: 160,
          spread: 165,
          origin: { x: 0.5, y: 0.96 },
          angle: 90,
          startVelocity: 38,
          gravity: 0.75,
          ticks: 280,
          colors: palette,
          scalar: 1.75,
          drift: 0.08,
        })
      }, 80)
    }

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (e?.isIntersecting) {
          void fire()
          io.disconnect()
        }
      },
      { threshold: 0.32, rootMargin: '0px' }
    )
    io.observe(host)

    return () => {
      io.disconnect()
      ro.disconnect()
      canvas.remove()
      confettiFiredRef.current = false
    }
  }, [listePleine])

  return (
    <div
      ref={wrapperRef}
      className={`pionnier-counter${listePleine ? ' pionnier-counter--liste-pleine pionnier-counter--section-bleed' : ''}`}
      data-reveal
      style={counterStyle}
    >
      <div className="pionnier-counter__glow" aria-hidden="true" />

      <div className="pionnier-counter__stats">
        <p
          className="pionnier-counter__figure"
          aria-label={
            listePleine
              ? `Liste Pionniers complète : ${prises} sur ${PIONNIER_PLACES_TOTAL} places`
              : `${prises} Pionniers inscrits sur ${PIONNIER_PLACES_TOTAL} places`
          }
        >
          {prises}
        </p>
        {listePleine ? (
          <>
            <p className="pionnier-counter__kicker">
              Les {PIONNIER_PLACES_TOTAL} places Pionniers sont <strong>complètes</strong> — merci aux premiers engagés.
            </p>
            <p className="pionnier-counter__sub pionnier-counter__sub--liste-pleine-lead">
              <strong>Inscrivez-vous</strong> pour être alerté du lancement et des prochaines étapes.
            </p>
            <ul className="pionnier-counter__liste-pleine-points" role="list">
              <li>
                <strong>Parrainage</strong> (bonus parrain, ex. première offre de rempla sans commission) :
                uniquement <strong>après</strong> inscription, via le lien affiché sur l’<strong>écran de confirmation</strong>.
              </li>
              <li>
                <strong>Sans inscription</strong> : recommandez le site via le bouton{' '}
                {inviterButtonId ? (
                  <a
                    href={`#${inviterButtonId}`}
                    className="pionnier-counter__inline-link"
                    onClick={(e) => {
                      e.preventDefault()
                      const btn = document.getElementById(inviterButtonId)
                      btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                      ;(btn as HTMLButtonElement | null)?.click()
                    }}
                    aria-label="Inviter un confrère — ouvrir la fenêtre de partage"
                  >
                    Inviter un confrère
                  </a>
                ) : (
                  <strong>Inviter un confrère</strong>
                )}
                {'.'}
              </li>
            </ul>
          </>
        ) : (
          <p className="pionnier-counter__kicker">
            Pionniers inscrits sur <strong>{PIONNIER_PLACES_TOTAL} places</strong>.
          </p>
        )}
      </div>

      <div className="pionnier-counter__foot">
        <div className="pionnier-counter__bar-meta">
          <span>
            Places Pionniers : {prises} / {PIONNIER_PLACES_TOTAL}
          </span>
          <span>{listePleine ? 'Liste complète' : `${restantes} places restantes`}</span>
        </div>
        <div
          className="pionnier-counter__track"
          role="progressbar"
          aria-valuenow={prises}
          aria-valuemin={0}
          aria-valuemax={PIONNIER_PLACES_TOTAL}
          aria-label={`${prises} sur ${PIONNIER_PLACES_TOTAL} places Pionniers prises`}
        >
          <div ref={progressRef} className="progress-fill" />
        </div>
      </div>
    </div>
  )
}
