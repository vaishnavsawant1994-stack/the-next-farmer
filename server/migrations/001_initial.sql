BEGIN;
CREATE TABLE IF NOT EXISTS tnf_users (
  id uuid PRIMARY KEY, email text NOT NULL UNIQUE, password_hash text NOT NULL,
  display_name varchar(100) NOT NULL, role text NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer','expert','editor','admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tnf_sessions (
  token_hash char(64) PRIMARY KEY, user_id uuid NOT NULL REFERENCES tnf_users(id) ON DELETE CASCADE,
  csrf_token char(43) NOT NULL, expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tnf_sessions_user_idx ON tnf_sessions(user_id);
CREATE TABLE IF NOT EXISTS tnf_farms (
  id uuid PRIMARY KEY, user_id uuid NOT NULL REFERENCES tnf_users(id) ON DELETE CASCADE,
  name varchar(100) NOT NULL, village varchar(100) NOT NULL DEFAULT '',
  area_acres numeric(16,6) NOT NULL CHECK(area_acres>0 AND area_acres<=100000),
  irrigation text NOT NULL CHECK(irrigation IN ('Rainfed','Well','Borewell','Canal','Drip','Other')),
  created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,user_id)
);
CREATE INDEX IF NOT EXISTS tnf_farms_user_idx ON tnf_farms(user_id);
CREATE TABLE IF NOT EXISTS tnf_crops (
  id uuid PRIMARY KEY, user_id uuid NOT NULL REFERENCES tnf_users(id) ON DELETE CASCADE,
  farm_id uuid NOT NULL, name varchar(100) NOT NULL, sown_date date NOT NULL,
  status text NOT NULL CHECK(status IN ('planned','growing','harvested')),
  expected_yield_kg numeric(18,3) NOT NULL CHECK(expected_yield_kg>=0),
  expected_price_per_kg numeric(18,3) NOT NULL CHECK(expected_price_per_kg>=0),
  actual_revenue numeric(18,2) CHECK(actual_revenue>=0),
  created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(id,user_id),
  FOREIGN KEY(farm_id,user_id) REFERENCES tnf_farms(id,user_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS tnf_crops_user_idx ON tnf_crops(user_id);
CREATE TABLE IF NOT EXISTS tnf_expenses (
  id uuid PRIMARY KEY, user_id uuid NOT NULL REFERENCES tnf_users(id) ON DELETE CASCADE,
  crop_id uuid NOT NULL, category varchar(100) NOT NULL,
  description varchar(180) NOT NULL DEFAULT '', amount numeric(18,2) NOT NULL CHECK(amount>=0),
  date date NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY(crop_id,user_id) REFERENCES tnf_crops(id,user_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS tnf_expenses_user_idx ON tnf_expenses(user_id);
CREATE TABLE IF NOT EXISTS tnf_guides (
  id uuid PRIMARY KEY, title varchar(140) NOT NULL, locale text NOT NULL CHECK(locale IN ('en','mr','hi')),
  crop varchar(80) NOT NULL, region varchar(150) NOT NULL, summary varchar(800) NOT NULL,
  instructions text NOT NULL, source_url varchar(1000) NOT NULL, source_name varchar(160) NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','in_review','published','withdrawn')),
  author_id uuid NOT NULL REFERENCES tnf_users(id), reviewer_id uuid REFERENCES tnf_users(id),
  reviewed_at timestamptz, published_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(), version integer NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS tnf_guides_status_idx ON tnf_guides(status,locale);
CREATE TABLE IF NOT EXISTS tnf_cases (
  id uuid PRIMARY KEY, farmer_id uuid NOT NULL REFERENCES tnf_users(id) ON DELETE CASCADE,
  crop_id uuid, subject varchar(160) NOT NULL, symptoms text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','answered')),
  reply text, reply_source_url text, answered_by uuid REFERENCES tnf_users(id),
  created_at timestamptz NOT NULL DEFAULT now(), answered_at timestamptz,
  FOREIGN KEY(crop_id,farmer_id) REFERENCES tnf_crops(id,user_id) ON DELETE SET NULL (crop_id)
);
CREATE INDEX IF NOT EXISTS tnf_cases_farmer_idx ON tnf_cases(farmer_id);
CREATE TABLE IF NOT EXISTS tnf_audit (
  id bigserial PRIMARY KEY, actor_id uuid REFERENCES tnf_users(id) ON DELETE SET NULL,
  action text NOT NULL, target text NOT NULL, target_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tnf_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
INSERT INTO tnf_migrations(name) VALUES ('001_initial.sql') ON CONFLICT DO NOTHING;
COMMIT;
