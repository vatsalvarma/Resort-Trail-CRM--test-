-- ============================================================
--  Village Trails Resort CRM — PostgreSQL Schema
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ── ENUMS ───────────────────────────────────────────────────

CREATE TYPE role_enum AS ENUM (
  'SUPER_ADMIN','MANAGER','RECEPTION','KITCHEN_HEAD','ACCOUNTANT','HOUSEKEEPING','MAINTENANCE'
);

CREATE TYPE room_status_enum AS ENUM (
  'AVAILABLE','OCCUPIED','MAINTENANCE','RESERVED','CLEANING'
);

CREATE TYPE room_category_enum AS ENUM (
  'STANDARD','DELUXE','SUITE','FAMILY','VILLA','DORMITORY'
);

CREATE TYPE booking_status_enum AS ENUM (
  'PENDING','CONFIRMED','CHECKED_IN','CHECKED_OUT','CANCELLED','NO_SHOW'
);

CREATE TYPE payment_status_enum AS ENUM (
  'PENDING','PARTIAL','PAID','REFUNDED','FAILED'
);

CREATE TYPE order_status_enum AS ENUM (
  'PENDING','ACCEPTED','PREPARING','READY','DELIVERED','CANCELLED'
);

-- ── STAFF ───────────────────────────────────────────────────

CREATE TABLE staff (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name           VARCHAR(120) NOT NULL,
  email          VARCHAR(180) NOT NULL UNIQUE,
  password_hash  TEXT         NOT NULL,
  role           role_enum    NOT NULL,
  department     VARCHAR(80)  NOT NULL,
  phone          VARCHAR(20),
  shift          VARCHAR(10)  CHECK (shift IN ('MORNING','EVENING','NIGHT')),
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  salary         NUMERIC(10,2),
  join_date      DATE,
  avatar_url     TEXT,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_staff_email  ON staff(email);
CREATE INDEX idx_staff_role   ON staff(role);

-- ── GUESTS ──────────────────────────────────────────────────

CREATE TABLE guests (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(120) NOT NULL,
  email           VARCHAR(180) NOT NULL UNIQUE,
  phone           VARCHAR(20)  NOT NULL,
  address         TEXT,
  id_type         VARCHAR(30),
  id_number       VARCHAR(50),
  nationality     VARCHAR(60),
  total_bookings  INT          NOT NULL DEFAULT 0,
  total_spent     NUMERIC(12,2) NOT NULL DEFAULT 0,
  last_visit      DATE,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guests_email ON guests(email);
CREATE INDEX idx_guests_name  ON guests USING GIN (name gin_trgm_ops);

-- ── ROOMS ───────────────────────────────────────────────────

CREATE TABLE rooms (
  id              UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number     VARCHAR(10)       NOT NULL UNIQUE,
  floor           SMALLINT          NOT NULL,
  category        room_category_enum NOT NULL,
  status          room_status_enum  NOT NULL DEFAULT 'AVAILABLE',
  price_per_night NUMERIC(10,2)     NOT NULL,
  capacity        SMALLINT          NOT NULL DEFAULT 2,
  image_url       TEXT,
  description     TEXT,
  last_cleaned    TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE TABLE room_amenities (
  room_id UUID        NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  amenity VARCHAR(80) NOT NULL,
  PRIMARY KEY (room_id, amenity)
);

CREATE INDEX idx_rooms_status   ON rooms(status);
CREATE INDEX idx_rooms_category ON rooms(category);

-- ── BOOKINGS ────────────────────────────────────────────────

CREATE TABLE bookings (
  id                  UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number      VARCHAR(20)          NOT NULL UNIQUE,
  guest_id            UUID                 NOT NULL REFERENCES guests(id),
  room_id             UUID                 NOT NULL REFERENCES rooms(id),
  check_in            DATE                 NOT NULL,
  check_out           DATE                 NOT NULL,
  nights              SMALLINT             NOT NULL,
  adults              SMALLINT             NOT NULL DEFAULT 1,
  children            SMALLINT             NOT NULL DEFAULT 0,
  status              booking_status_enum  NOT NULL DEFAULT 'PENDING',
  payment_status      payment_status_enum  NOT NULL DEFAULT 'PENDING',
  room_rate           NUMERIC(10,2)        NOT NULL,
  total_amount        NUMERIC(10,2)        NOT NULL,
  paid_amount         NUMERIC(10,2)        NOT NULL DEFAULT 0,
  balance_due         NUMERIC(10,2)        NOT NULL DEFAULT 0,
  gst_amount          NUMERIC(10,2)        NOT NULL DEFAULT 0,
  payment_method      VARCHAR(30),
  special_requests    TEXT,
  internal_notes      TEXT,
  cancellation_reason TEXT,
  refund_amount       NUMERIC(10,2),
  created_by          UUID                 REFERENCES staff(id),
  created_at          TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_dates CHECK (check_out > check_in)
);

CREATE INDEX idx_bookings_guest    ON bookings(guest_id);
CREATE INDEX idx_bookings_room     ON bookings(room_id);
CREATE INDEX idx_bookings_status   ON bookings(status);
CREATE INDEX idx_bookings_check_in ON bookings(check_in);

-- ── MENU ITEMS ──────────────────────────────────────────────

CREATE TABLE menu_items (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(120) NOT NULL,
  description      TEXT,
  category         VARCHAR(50)  NOT NULL,
  price            NUMERIC(8,2) NOT NULL,
  is_veg           BOOLEAN      NOT NULL DEFAULT TRUE,
  is_available     BOOLEAN      NOT NULL DEFAULT TRUE,
  preparation_time SMALLINT     NOT NULL DEFAULT 15,
  image_url        TEXT,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── FOOD ORDERS ─────────────────────────────────────────────

CREATE TABLE food_orders (
  id                   UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number         VARCHAR(20)        NOT NULL UNIQUE,
  booking_id           UUID               NOT NULL REFERENCES bookings(id),
  guest_id             UUID               NOT NULL REFERENCES guests(id),
  room_number          VARCHAR(10)        NOT NULL,
  status               order_status_enum  NOT NULL DEFAULT 'PENDING',
  total_amount         NUMERIC(10,2)      NOT NULL,
  gst_amount           NUMERIC(10,2)      NOT NULL,
  grand_total          NUMERIC(10,2)      NOT NULL,
  payment_status       payment_status_enum NOT NULL DEFAULT 'PENDING',
  special_instructions TEXT,
  estimated_time       SMALLINT,
  placed_at            TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  accepted_at          TIMESTAMPTZ,
  prepared_at          TIMESTAMPTZ,
  delivered_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  food_order_id UUID         NOT NULL REFERENCES food_orders(id) ON DELETE CASCADE,
  menu_item_id  UUID         NOT NULL REFERENCES menu_items(id),
  quantity      SMALLINT     NOT NULL DEFAULT 1,
  price         NUMERIC(8,2) NOT NULL,
  notes         VARCHAR(200),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_food_orders_status   ON food_orders(status);
CREATE INDEX idx_food_orders_guest    ON food_orders(guest_id);
CREATE INDEX idx_food_orders_placed   ON food_orders(placed_at DESC);

-- ── INVOICES ────────────────────────────────────────────────

CREATE TABLE invoices (
  id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number  VARCHAR(20)         NOT NULL UNIQUE,
  type            VARCHAR(20)         NOT NULL,
  booking_id      UUID                REFERENCES bookings(id),
  guest_id        UUID                NOT NULL REFERENCES guests(id),
  sub_total       NUMERIC(12,2)       NOT NULL,
  cgst            NUMERIC(10,2)       NOT NULL DEFAULT 0,
  sgst            NUMERIC(10,2)       NOT NULL DEFAULT 0,
  total_gst       NUMERIC(10,2)       NOT NULL DEFAULT 0,
  grand_total     NUMERIC(12,2)       NOT NULL,
  payment_status  payment_status_enum NOT NULL DEFAULT 'PENDING',
  issued_at       TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  due_date        TIMESTAMPTZ,
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE TABLE invoice_line_items (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id  UUID         NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description VARCHAR(200) NOT NULL,
  quantity    SMALLINT     NOT NULL DEFAULT 1,
  unit_price  NUMERIC(10,2) NOT NULL,
  amount      NUMERIC(10,2) NOT NULL,
  gst_rate    NUMERIC(5,2) NOT NULL DEFAULT 12,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_guest          ON invoices(guest_id);
CREATE INDEX idx_invoices_payment_status ON invoices(payment_status);

-- ── AUDIT LOGS ──────────────────────────────────────────────

CREATE TABLE audit_logs (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id   UUID         NOT NULL REFERENCES staff(id),
  action     VARCHAR(100) NOT NULL,
  entity     VARCHAR(100) NOT NULL,
  entity_id  VARCHAR(36),
  changes    JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_staff     ON audit_logs(staff_id);
CREATE INDEX idx_audit_logs_entity    ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_logs_created   ON audit_logs(created_at DESC);

-- ── AUTO-UPDATE updated_at ──────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'staff','guests','rooms','bookings','menu_items',
    'food_orders','order_items','invoices','invoice_line_items','audit_logs'
  ] LOOP
    EXECUTE format('
      CREATE TRIGGER trg_%s_updated_at
      BEFORE UPDATE ON %s
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    ', tbl, tbl);
  END LOOP;
END;
$$;
