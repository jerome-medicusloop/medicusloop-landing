'use client'

import { useEffect } from 'react'

export default function PageAnimations() {
  useEffect(() => {
    // ─── Scroll reveal + stagger ────────────────────────────────────────────
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            revealObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    )

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.classList.add('reveal')
      revealObserver.observe(el)
    })

    document.querySelectorAll('[data-stagger]').forEach((parent) => {
      Array.from(parent.children).forEach((child, i) => {
        const el = child as HTMLElement
        /* Avantages Pionniers liste complète : pas de reveal (sinon opacity 0 jusqu’au viewport + conflit avec l’état grisé) */
        if (el.classList.contains('pionniers-avantage-card--liste-pleine')) return
        el.classList.add('reveal')
        el.style.transitionDelay = `${i * 110}ms`
        revealObserver.observe(el)
      })
    })

    // ─── Section underlines ─────────────────────────────────────────────────
    const underlineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            underlineObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )
    document.querySelectorAll('.section-underline').forEach((el) => {
      underlineObserver.observe(el)
    })

    // ─── Counter animation ──────────────────────────────────────────────────
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const target = parseInt(el.dataset.counter ?? '0', 10)
          const duration = 1200
          const start = performance.now()

          const tick = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            el.textContent = Math.round(eased * target).toString()
            if (progress < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
          counterObserver.unobserve(el)
        })
      },
      { threshold: 0.5 }
    )
    document.querySelectorAll('[data-counter]').forEach((el) => {
      counterObserver.observe(el)
    })

    // ─── 3D card tilt ───────────────────────────────────────────────────────
    const handleTiltMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px) scale(1.02)`
    }
    const handleTiltLeave = (e: MouseEvent) => {
      ;(e.currentTarget as HTMLElement).style.transform = ''
    }

    const tiltCards = document.querySelectorAll('[data-tilt]')
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', handleTiltMove as EventListener)
      card.addEventListener('mouseleave', handleTiltLeave as EventListener)
    })

    // ─── Magnetic CTAs ──────────────────────────────────────────────────────
    const handleMagneticMove = (e: MouseEvent) => {
      const btn = e.currentTarget as HTMLElement
      const rect = btn.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25
      const y = (e.clientY - rect.top - rect.height / 2) * 0.25
      btn.style.transform = `translate(${x}px, ${y}px)`
    }
    const handleMagneticLeave = (e: MouseEvent) => {
      ;(e.currentTarget as HTMLElement).style.transform = ''
    }

    const magneticBtns = document.querySelectorAll('[data-magnetic]')
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', handleMagneticMove as EventListener)
      btn.addEventListener('mouseleave', handleMagneticLeave as EventListener)
    })

    // ─── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      revealObserver.disconnect()
      underlineObserver.disconnect()
      counterObserver.disconnect()
      tiltCards.forEach((card) => {
        card.removeEventListener('mousemove', handleTiltMove as EventListener)
        card.removeEventListener('mouseleave', handleTiltLeave as EventListener)
      })
      magneticBtns.forEach((btn) => {
        btn.removeEventListener('mousemove', handleMagneticMove as EventListener)
        btn.removeEventListener('mouseleave', handleMagneticLeave as EventListener)
      })
    }
  }, [])

  return null
}
