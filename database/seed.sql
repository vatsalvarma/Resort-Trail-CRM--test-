-- ============================================================
--  Village Trails Resort CRM — Seed Data
--  Passwords are BCrypt of "password123"
-- ============================================================

-- ── STAFF ───────────────────────────────────────────────────

INSERT INTO staff (id, name, email, password_hash, role, department, phone, shift, is_active, join_date) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Arjun Sharma',   'admin@villagetrails.in',      '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewis9m.ylS3T7E2', 'SUPER_ADMIN',  'Management',   '9876543210', 'MORNING', TRUE, '2022-01-01'),
  ('11111111-0000-0000-0000-000000000002', 'Priya Nair',     'manager@villagetrails.in',    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewis9m.ylS3T7E2', 'MANAGER',      'Management',   '9876543211', 'MORNING', TRUE, '2022-03-15'),
  ('11111111-0000-0000-0000-000000000003', 'Rohit Verma',    'reception@villagetrails.in',  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewis9m.ylS3T7E2', 'RECEPTION',    'Front Office', '9876543212', 'MORNING', TRUE, '2022-05-01'),
  ('11111111-0000-0000-0000-000000000004', 'Meena Pillai',   'kitchen@villagetrails.in',    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewis9m.ylS3T7E2', 'KITCHEN_HEAD', 'Kitchen',      '9876543213', 'MORNING', TRUE, '2022-04-10'),
  ('11111111-0000-0000-0000-000000000005', 'Suresh Kumar',   'accounts@villagetrails.in',   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewis9m.ylS3T7E2', 'ACCOUNTANT',   'Finance',      '9876543214', 'MORNING', TRUE, '2022-06-01'),
  ('11111111-0000-0000-0000-000000000006', 'Lakshmi Devi',   'housekeeping@villagetrails.in','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewis9m.ylS3T7E2','HOUSEKEEPING', 'Housekeeping', '9876543215', 'MORNING', TRUE, '2022-07-01');

-- ── GUESTS ──────────────────────────────────────────────────

INSERT INTO guests (id, name, email, phone, address, nationality, total_bookings, total_spent) VALUES
  ('22222222-0000-0000-0000-000000000001', 'Rahul Mehta',    'rahul.mehta@gmail.com',    '9898989801', 'Mumbai, Maharashtra',   'Indian', 3, 45000.00),
  ('22222222-0000-0000-0000-000000000002', 'Anita Desai',    'anita.desai@yahoo.com',    '9898989802', 'Pune, Maharashtra',     'Indian', 1, 12000.00),
  ('22222222-0000-0000-0000-000000000003', 'James Wilson',   'james.w@example.com',      '9898989803', 'London, UK',            'British',2, 38000.00),
  ('22222222-0000-0000-0000-000000000004', 'Sneha Patil',    'sneha.patil@gmail.com',    '9898989804', 'Nashik, Maharashtra',   'Indian', 2, 24000.00),
  ('22222222-0000-0000-0000-000000000005', 'Vikram Singh',   'vikram.singh@outlook.com', '9898989805', 'Delhi, India',          'Indian', 5, 89000.00);

-- ── ROOMS ───────────────────────────────────────────────────

INSERT INTO rooms (id, room_number, floor, category, status, price_per_night, capacity, description) VALUES
  ('33333333-0000-0000-0000-000000000001', '101', 1, 'STANDARD', 'AVAILABLE',   2500.00, 2, 'Cozy standard room with garden view'),
  ('33333333-0000-0000-0000-000000000002', '102', 1, 'STANDARD', 'OCCUPIED',    2500.00, 2, 'Cozy standard room with garden view'),
  ('33333333-0000-0000-0000-000000000003', '201', 2, 'DELUXE',   'AVAILABLE',   4500.00, 2, 'Deluxe room with forest view balcony'),
  ('33333333-0000-0000-0000-000000000004', '202', 2, 'DELUXE',   'RESERVED',    4500.00, 3, 'Deluxe room with valley view'),
  ('33333333-0000-0000-0000-000000000005', '301', 3, 'SUITE',    'OCCUPIED',    8500.00, 4, 'Premium suite with living area and Jacuzzi'),
  ('33333333-0000-0000-0000-000000000006', '302', 3, 'SUITE',    'CLEANING',    8500.00, 4, 'Premium suite overlooking the river'),
  ('33333333-0000-0000-0000-000000000007', 'V01', 1, 'VILLA',    'AVAILABLE',  15000.00, 6, 'Private villa with pool and kitchen'),
  ('33333333-0000-0000-0000-000000000008', 'F01', 1, 'FAMILY',   'MAINTENANCE', 6000.00, 5, 'Spacious family room with bunk beds'),
  ('33333333-0000-0000-0000-000000000009', '103', 1, 'STANDARD', 'AVAILABLE',   2500.00, 2, 'Standard room near reception'),
  ('33333333-0000-0000-0000-000000000010', '203', 2, 'DELUXE',   'OCCUPIED',    4500.00, 2, 'Deluxe room with sunrise view');

INSERT INTO room_amenities (room_id, amenity) VALUES
  ('33333333-0000-0000-0000-000000000001', 'WiFi'),
  ('33333333-0000-0000-0000-000000000001', 'AC'),
  ('33333333-0000-0000-0000-000000000003', 'WiFi'),
  ('33333333-0000-0000-0000-000000000003', 'AC'),
  ('33333333-0000-0000-0000-000000000003', 'Balcony'),
  ('33333333-0000-0000-0000-000000000005', 'WiFi'),
  ('33333333-0000-0000-0000-000000000005', 'AC'),
  ('33333333-0000-0000-0000-000000000005', 'Jacuzzi'),
  ('33333333-0000-0000-0000-000000000005', 'Mini-bar'),
  ('33333333-0000-0000-0000-000000000007', 'WiFi'),
  ('33333333-0000-0000-0000-000000000007', 'Private Pool'),
  ('33333333-0000-0000-0000-000000000007', 'Kitchen'),
  ('33333333-0000-0000-0000-000000000007', 'BBQ');

-- ── MENU ITEMS ──────────────────────────────────────────────

INSERT INTO menu_items (id, name, category, price, is_veg, preparation_time) VALUES
  ('44444444-0000-0000-0000-000000000001', 'Masala Chai',       'Beverages',   60.00,  TRUE,  5),
  ('44444444-0000-0000-0000-000000000002', 'Fresh Lime Soda',   'Beverages',   80.00,  TRUE,  3),
  ('44444444-0000-0000-0000-000000000003', 'Veg Thali',         'Main Course', 320.00, TRUE,  20),
  ('44444444-0000-0000-0000-000000000004', 'Butter Chicken',    'Main Course', 420.00, FALSE, 25),
  ('44444444-0000-0000-0000-000000000005', 'Dal Tadka',         'Main Course', 280.00, TRUE,  15),
  ('44444444-0000-0000-0000-000000000006', 'Paneer Butter Masala','Main Course',380.00,TRUE, 18),
  ('44444444-0000-0000-0000-000000000007', 'Jeera Rice',        'Main Course', 180.00, TRUE,  10),
  ('44444444-0000-0000-0000-000000000008', 'Garlic Naan',       'Breads',      60.00,  TRUE,  8),
  ('44444444-0000-0000-0000-000000000009', 'Gulab Jamun',       'Desserts',    120.00, TRUE,  5),
  ('44444444-0000-0000-0000-000000000010', 'Masala Papad',      'Starters',    80.00,  TRUE,  3);

-- ── BOOKINGS ────────────────────────────────────────────────

INSERT INTO bookings (id, booking_number, guest_id, room_id, check_in, check_out, nights, adults, status, payment_status, room_rate, total_amount, paid_amount, balance_due, gst_amount, created_by) VALUES
  ('55555555-0000-0000-0000-000000000001', 'BK-2024-001',
   '22222222-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000002',
   CURRENT_DATE - 2, CURRENT_DATE + 1, 3, 2, 'CHECKED_IN', 'PARTIAL',
   2500.00, 8910.00, 5000.00, 3910.00, 910.00,
   '11111111-0000-0000-0000-000000000003'),

  ('55555555-0000-0000-0000-000000000002', 'BK-2024-002',
   '22222222-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000005',
   CURRENT_DATE - 1, CURRENT_DATE + 3, 4, 2, 'CHECKED_IN', 'PAID',
   8500.00, 39712.00, 39712.00, 0.00, 4272.00,
   '11111111-0000-0000-0000-000000000003'),

  ('55555555-0000-0000-0000-000000000003', 'BK-2024-003',
   '22222222-0000-0000-0000-000000000004', '33333333-0000-0000-0000-000000000004',
   CURRENT_DATE + 1, CURRENT_DATE + 4, 3, 2, 'CONFIRMED', 'PENDING',
   4500.00, 15930.00, 0.00, 15930.00, 1680.00,
   '11111111-0000-0000-0000-000000000003');
