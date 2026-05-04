UPDATE public.barbers SET phone = CASE name
  WHEN 'André' THEN '5541995530001'
  WHEN 'Andre' THEN '5541995530001'
  WHEN 'José' THEN '5541991439149'
  WHEN 'Jose' THEN '5541991439149'
  WHEN 'Kauê' THEN '5541998244945'
  WHEN 'Kaue' THEN '5541998244945'
  ELSE phone
END
WHERE name IN ('André','Andre','José','Jose','Kauê','Kaue');