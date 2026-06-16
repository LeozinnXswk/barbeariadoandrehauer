DROP POLICY IF EXISTS "Anyone can view barbers" ON public.barbers;
CREATE POLICY "Authenticated users can view barbers" ON public.barbers FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.barbers FROM anon;