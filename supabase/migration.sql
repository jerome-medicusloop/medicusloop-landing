CREATE TABLE IF NOT EXISTS public.waitlist_pionniers (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         TIMESTAMPTZ DEFAULT now() NOT NULL,
  prenom             TEXT NOT NULL,
  nom                TEXT NOT NULL,
  email              TEXT NOT NULL UNIQUE,
  -- Parrainage : identifiant public = MD5 hex (32 car.) de trim(lower(email)), aligné avec `emailSourceHash` (serveur).
  source             TEXT,
  ville              TEXT,
  region             TEXT,
  annees_experience  TEXT,
  validated          BOOLEAN NOT NULL DEFAULT false,
  profil             TEXT NOT NULL CHECK (profil IN ('remplacant', 'etablissement', 'les_deux')),
  unsubscribe_token  UUID NOT NULL DEFAULT gen_random_uuid(),
  email_communication_status TEXT NOT NULL DEFAULT 'subscribed' CHECK (email_communication_status IN ('subscribed', 'unsubscribed')),
  unsubscribed_at    TIMESTAMPTZ,
  unsubscribe_reason TEXT,
  register_date      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_modified_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist_pionniers ENABLE ROW LEVEL SECURITY;

-- Bases déjà créées sans cette colonne : ajout avant les politiques qui référencent `validated`.
ALTER TABLE public.waitlist_pionniers ADD COLUMN IF NOT EXISTS validated BOOLEAN NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "insert_waitlist_pionniers_public" ON public.waitlist_pionniers;
CREATE POLICY "insert_waitlist_pionniers_public"
  ON public.waitlist_pionniers
  FOR INSERT
  WITH CHECK (validated = false);

DROP POLICY IF EXISTS "select_waitlist_pionniers_deny" ON public.waitlist_pionniers;
CREATE POLICY "select_waitlist_pionniers_deny"
  ON public.waitlist_pionniers
  FOR SELECT
  USING (false);

GRANT INSERT ON public.waitlist_pionniers TO anon, authenticated;

-- Étendre la contrainte profil si la table existait déjà (anciennes migrations sans « les_deux »).
ALTER TABLE public.waitlist_pionniers DROP CONSTRAINT IF EXISTS waitlist_pionniers_profil_check;
ALTER TABLE public.waitlist_pionniers ADD CONSTRAINT waitlist_pionniers_profil_check
  CHECK (profil IN ('remplacant', 'etablissement', 'les_deux'));

-- Bases créées avant `source` dans le CREATE : ajout + backfill (même règle que l’app : md5(trim(lower(email)))).
ALTER TABLE public.waitlist_pionniers ADD COLUMN IF NOT EXISTS source TEXT;

UPDATE public.waitlist_pionniers
SET source = md5(trim(lower(email)))
WHERE source IS NULL OR btrim(source) = '';

COMMENT ON COLUMN public.waitlist_pionniers.source IS
  'Parrainage : MD5 hex (32) de l’e-mail inscrit (trim + lower). Lien perso ?source= après inscription ; pas le hash du parrain dans l’URL.';

-- E-mails liste d’attente : token opaque (UUID) pour page /desabonnement (pas d’e-mail dans l’URL).
ALTER TABLE public.waitlist_pionniers ADD COLUMN IF NOT EXISTS unsubscribe_token UUID;
ALTER TABLE public.waitlist_pionniers ADD COLUMN IF NOT EXISTS email_communication_status TEXT NOT NULL DEFAULT 'subscribed';
ALTER TABLE public.waitlist_pionniers DROP CONSTRAINT IF EXISTS waitlist_pionniers_email_communication_status_check;
ALTER TABLE public.waitlist_pionniers ADD CONSTRAINT waitlist_pionniers_email_communication_status_check
  CHECK (email_communication_status IN ('subscribed', 'unsubscribed'));

ALTER TABLE public.waitlist_pionniers ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;
ALTER TABLE public.waitlist_pionniers ADD COLUMN IF NOT EXISTS unsubscribe_reason TEXT;

UPDATE public.waitlist_pionniers
SET unsubscribe_token = gen_random_uuid()
WHERE unsubscribe_token IS NULL;

DROP INDEX IF EXISTS waitlist_pionniers_unsubscribe_token_key;
CREATE UNIQUE INDEX waitlist_pionniers_unsubscribe_token_key ON public.waitlist_pionniers (unsubscribe_token);

ALTER TABLE public.waitlist_pionniers ALTER COLUMN unsubscribe_token SET NOT NULL;

COMMENT ON COLUMN public.waitlist_pionniers.unsubscribe_token IS
  'Jeton secret pour la page de désabonnement ; jamais devinable (UUID), une ligne = un jeton.';
COMMENT ON COLUMN public.waitlist_pionniers.email_communication_status IS
  'subscribed = peut recevoir des e-mails d’info ; unsubscribed = désinscrit via /desabonnement.';
COMMENT ON COLUMN public.waitlist_pionniers.unsubscribe_reason IS
  'Motif libellé + détail optionnel saisis sur le formulaire de désabonnement.';

ALTER TABLE public.waitlist_pionniers ADD COLUMN IF NOT EXISTS register_date TIMESTAMPTZ;
ALTER TABLE public.waitlist_pionniers ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ;

UPDATE public.waitlist_pionniers
SET
  register_date = COALESCE(register_date, created_at),
  last_modified_at = COALESCE(last_modified_at, created_at);

ALTER TABLE public.waitlist_pionniers ALTER COLUMN register_date SET DEFAULT now();
ALTER TABLE public.waitlist_pionniers ALTER COLUMN last_modified_at SET DEFAULT now();
ALTER TABLE public.waitlist_pionniers ALTER COLUMN register_date SET NOT NULL;
ALTER TABLE public.waitlist_pionniers ALTER COLUMN last_modified_at SET NOT NULL;

COMMENT ON COLUMN public.waitlist_pionniers.register_date IS
  'Date de première inscription (inchangée si l’utilisateur se réabonne après désabonnement e-mail).';
COMMENT ON COLUMN public.waitlist_pionniers.last_modified_at IS
  'Dernière mise à jour de la ligne (inscription, réabonnement, désabonnement, etc.).';

-- Aligner la casse avec l’app (lower(trim)) pour retrouver les lignes existantes à la réinscription.
UPDATE public.waitlist_pionniers
SET email = lower(trim(email))
WHERE lower(trim(email)) IS DISTINCT FROM email;

-- Comptage public (jauge / pages légales) : validés ET encore abonnés aux e-mails.
-- Défini en fin de fichier pour que `email_communication_status` existe sur les anciennes bases.
CREATE OR REPLACE FUNCTION public.count_waitlist_pionniers()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::bigint
  FROM public.waitlist_pionniers
  WHERE validated = true
    AND email_communication_status = 'subscribed';
$$;

REVOKE ALL ON FUNCTION public.count_waitlist_pionniers() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.count_waitlist_pionniers() TO anon, authenticated;
