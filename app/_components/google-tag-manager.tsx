import Script from 'next/script'

/**
 * Conteneur GTM public. Surcharge possible : `NEXT_PUBLIC_GTM_ID=GTM-XXXX` dans `.env.local`.
 * À coordonner avec Axeptio (consent mode / déclenchement des tags) dans l’interface GTM.
 */
const DEFAULT_GTM_ID = 'GTM-PQLS8DFS'

function gtmContainerId(): string {
  const raw = (process.env.NEXT_PUBLIC_GTM_ID ?? DEFAULT_GTM_ID).trim()
  return /^GTM-[A-Z0-9]+$/i.test(raw) ? raw : DEFAULT_GTM_ID
}

const GTM_ID = gtmContainerId()

/** Script GTM — le plus haut possible dans `<head>` (`beforeInteractive`). */
export function GoogleTagManagerHead() {
  return (
    <>
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      <Script
        id="google-tag-manager"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
        }}
      />
    </>
  )
}

/** Fallback sans JS — juste après l’ouverture de `<body>`. */
export function GoogleTagManagerNoscript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(GTM_ID)}`}
        height={0}
        width={0}
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
