
DROP VIEW IF EXISTS public.busy_slots;
CREATE VIEW public.busy_slots WITH (security_invoker = true) AS
  SELECT barber_id, appointment_date, appointment_time
  FROM public.appointments
  WHERE status <> 'cancelled';

-- Allow anyone to read busy slots through a SECURITY DEFINER function instead of broad SELECT on appointments
CREATE OR REPLACE FUNCTION public.get_busy_slots(_barber_id UUID, _date DATE)
RETURNS TABLE(appointment_time TIME)
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT appointment_time FROM public.appointments
  WHERE barber_id = _barber_id AND appointment_date = _date AND status <> 'cancelled'
$$;

REVOKE ALL ON FUNCTION public.get_busy_slots(UUID, DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_busy_slots(UUID, DATE) TO authenticated;
