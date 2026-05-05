/**
 * Bloc confiance (MAR, contrat, signature) — intégré au hero (colonne texte `.hero-trust-slot`),
 * sans ancre nav ni section séparée.
 */
export default function HeroTrustBlock() {
  const items = [
    {
      icon: 'groups',
      label: 'Conçu avec des MAR',
      detail: 'Contraintes réelles du terrain MAR et établissement.',
    },
    {
      icon: 'gavel',
      label: 'Contrat type approuvé',
      detail: 'Droit médical libéral, clauses explicites.',
    },
    {
      icon: 'ink_pen',
      label: 'Signature électronique',
      detail: 'Horodatage et archivage des versions signées.',
    },
  ] as const

  return (
    <div
      className="trust-strip trust-strip--in-hero"
      role="region"
      aria-label="Pourquoi nous faire confiance : MAR au cœur du produit, contrat type, signature électronique"
    >
      <div className="trust-strip-inner trust-strip-inner--in-hero">
        <div className="trust-strip-grid">
          {items.map((item) => (
            <div key={item.icon} className="trust-strip-item">
              <div className="trust-strip-icon" aria-hidden="true">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div className="trust-strip-copy">
                <p className="trust-strip-title">{item.label}</p>
                <p className="trust-strip-detail">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
