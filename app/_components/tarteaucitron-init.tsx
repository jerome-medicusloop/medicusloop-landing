'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    tarteaucitron?: any
    __mlTacInitDone?: boolean
    __mlTacDebug?: { initCalled?: boolean; initError?: string; servicesReady?: boolean }
  }
}

export default function TarteaucitronInit() {
  useEffect(() => {
    let cancelled = false

    const boot = () => {
      if (cancelled || typeof window === 'undefined') return

      const tac = window.tarteaucitron
      if (!tac || typeof tac.init !== 'function') {
        window.setTimeout(boot, 40)
        return
      }

      if (window.__mlTacInitDone) return
      window.__mlTacInitDone = true

      tac.user = tac.user || {}
      tac.job = tac.job || []
      tac.services = tac.services || {}

      try {
        tac.init({
        privacyUrl: '/mentions-legales',
        bodyPosition: 'bottom',
        hashtag: '#tarteaucitron',
        cookieName: 'tarteaucitron',
        orientation: 'bottom',
        groupServices: true,
        showDetailsOnClick: true,
        serviceDefaultState: 'wait',
        showAlertSmall: false,
        cookieslist: false,
        cookieslistEmbed: false,
        closePopup: true,
        showIcon: true,
        iconPosition: 'BottomRight',
        adblocker: false,
        DenyAllCta: true,
        AcceptAllCta: true,
        highPrivacy: true,
        alwaysNeedConsent: false,
        handleBrowserDNTRequest: false,
        removeCredit: false,
        moreInfoLink: true,
        useExternalCss: false,
        useExternalJs: false,
        readmoreLink: '/mentions-legales',
        mandatory: true,
        mandatoryCta: false,
        googleConsentMode: false,
        dataLayer: false,
        serverSide: false,
        partnersList: true,
      })
        window.__mlTacDebug = { ...(window.__mlTacDebug || {}), initCalled: true }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        window.__mlTacDebug = { ...(window.__mlTacDebug || {}), initError: msg }
        console.error('[tarteaucitron] init failed', e)
        return
      }
      window.__mlTacDebug = { ...(window.__mlTacDebug || {}), servicesReady: true }
    }

    boot()
    return () => {
      cancelled = true
    }
  }, [])

  return null
}
