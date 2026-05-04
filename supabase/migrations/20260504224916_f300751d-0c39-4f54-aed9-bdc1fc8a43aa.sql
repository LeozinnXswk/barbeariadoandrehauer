
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'barber', 'client');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Barbers
CREATE TABLE public.barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view barbers" ON public.barbers FOR SELECT USING (true);
CREATE POLICY "Admins manage barbers" ON public.barbers FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  service_price NUMERIC(10,2) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(barber_id, appointment_date, appointment_time)
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_appointments_barber_date ON public.appointments(barber_id, appointment_date);

CREATE POLICY "Clients view own appointments" ON public.appointments FOR SELECT
  USING (auth.uid() = client_id);
CREATE POLICY "Barbers view their appointments" ON public.appointments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.barbers b WHERE b.id = barber_id AND b.user_id = auth.uid()));
CREATE POLICY "Admins view all appointments" ON public.appointments FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users create appointments" ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients cancel own appointments" ON public.appointments FOR UPDATE
  USING (auth.uid() = client_id);
CREATE POLICY "Barbers update their appointments" ON public.appointments FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.barbers b WHERE b.id = barber_id AND b.user_id = auth.uid()));

-- Public view of busy slots (no personal data) so anyone can see what's taken
CREATE OR REPLACE VIEW public.busy_slots AS
  SELECT barber_id, appointment_date, appointment_time
  FROM public.appointments
  WHERE status <> 'cancelled';

GRANT SELECT ON public.busy_slots TO anon, authenticated;

-- Trigger: auto create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed barbers
INSERT INTO public.barbers (name, phone) VALUES
  ('André', '5541955300001'),
  ('José', '5541914391490'),
  ('Vinícius', NULL),
  ('Kauê', '5541982449450');
