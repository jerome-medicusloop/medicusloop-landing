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
  profil             TEXT NOT NULL CHECK (profil IN ('remplacant', 'etablissement', 'les_deux'))
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

-- Comptage public : uniquement les inscriptions validées (sans SELECT sur les lignes ; la RLS « deny » reste).
CREATE OR REPLACE FUNCTION public.count_waitlist_pionniers()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::bigint FROM public.waitlist_pionniers WHERE validated = true;
$$;

REVOKE ALL ON FUNCTION public.count_waitlist_pionniers() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.count_waitlist_pionniers() TO anon, authenticated;

-- Bases créées avant `source` dans le CREATE : ajout + backfill (même règle que l’app : md5(trim(lower(email)))).
ALTER TABLE public.waitlist_pionniers ADD COLUMN IF NOT EXISTS source TEXT;

UPDATE public.waitlist_pionniers
SET source = md5(trim(lower(email)))
WHERE source IS NULL OR btrim(source) = '';

COMMENT ON COLUMN public.waitlist_pionniers.source IS
  'Parrainage : MD5 hex (32) de l’e-mail inscrit (trim + lower). Lien perso ?source= après inscription ; pas le hash du parrain dans l’URL.';
