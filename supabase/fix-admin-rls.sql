-- ============================================================================
-- FIX COMPLET: Politiques RLS pour l'admin
-- Exécuter ce script dans le SQL Editor de Supabase
-- https://supabase.com/dashboard/project/hshtooxvekmfsksxcvvj/sql/new
-- ============================================================================

-- 1. Supprimer TOUTES les anciennes politiques sur institutions
DROP POLICY IF EXISTS "Admins can update all institutions" ON institutions;
DROP POLICY IF EXISTS "Admins can view all institutions" ON institutions;
DROP POLICY IF EXISTS "Users can view their own institution" ON institutions;
DROP POLICY IF EXISTS "Users can update their own institution" ON institutions;
DROP POLICY IF EXISTS "Authenticated users can create institutions" ON institutions;

-- 2. Recréer la fonction is_admin avec votre email
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = user_id
        AND (
            raw_user_meta_data->>'role' = 'admin'
            OR email = 'alainpaluku@proton.me'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Créer les nouvelles politiques pour institutions

-- Admins peuvent TOUT voir
CREATE POLICY "Admins can view all institutions"
    ON institutions FOR SELECT
    USING (is_admin(auth.uid()));

-- Admins peuvent TOUT modifier
CREATE POLICY "Admins can update all institutions"
    ON institutions FOR UPDATE
    USING (is_admin(auth.uid()));

-- Les utilisateurs peuvent voir leur propre institution
CREATE POLICY "Users can view their own institution"
    ON institutions FOR SELECT
    USING (created_by = auth.uid());

-- Les utilisateurs peuvent modifier leur propre institution
CREATE POLICY "Users can update their own institution"
    ON institutions FOR UPDATE
    USING (created_by = auth.uid());

-- Les utilisateurs authentifiés peuvent créer des institutions
CREATE POLICY "Authenticated users can create institutions"
    ON institutions FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Marquer votre compte comme admin
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'alainpaluku@proton.me';

-- 5. Vérification - affiche votre utilisateur admin
SELECT id, email, raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'alainpaluku@proton.me';

-- 6. Vérification - affiche les institutions en attente
SELECT id, name, email, kyc_status, kyc_submitted_at
FROM institutions
WHERE kyc_status = 'pending'
ORDER BY kyc_submitted_at;
