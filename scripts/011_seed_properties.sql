-- Seed 4444 properties across all districts
-- This script generates the property grid based on district definitions

-- Founders District (500 parcels) - Tier 1 Prime
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  ROW_NUMBER() OVER () as parcel_id,
  'founders-exclusive' as district_id,
  'commercial' as property_type,
  -200 + (row * 40) as center_x,
  -400 + (col * 30) as center_z,
  20 as size_x,
  20 as size_z,
  10000 as base_price,
  10000 * 10 as current_price,
  10.0 as price_multiplier
FROM generate_series(0, 9) as row, generate_series(0, 49) as col
WHERE ROW_NUMBER() OVER () <= 500;

-- High Volume Hub (300 parcels) - Signals Plaza
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  500 + ROW_NUMBER() OVER () as parcel_id,
  'high-volume-hub' as district_id,
  'commercial' as property_type,
  -550 + (row * 40) as center_x,
  -150 + (col * 40) as center_z,
  20 as size_x,
  20 as size_z,
  10000 as base_price,
  10000 * 8 as current_price,
  8.0 as price_multiplier
FROM generate_series(0, 9) as row, generate_series(0, 29) as col
WHERE ROW_NUMBER() OVER () <= 300;

-- Commercial Core (200 parcels)
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  800 + ROW_NUMBER() OVER () as parcel_id,
  'commercial-core' as district_id,
  'commercial' as property_type,
  250 + (row * 40) as center_x,
  -150 + (col * 40) as center_z,
  20 as size_x,
  20 as size_z,
  10000 as base_price,
  10000 * 7 as current_price,
  7.0 as price_multiplier
FROM generate_series(0, 9) as row, generate_series(0, 19) as col
WHERE ROW_NUMBER() OVER () <= 200;

-- Gaming District (500 parcels)
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  1000 + ROW_NUMBER() OVER () as parcel_id,
  'gaming-district' as district_id,
  CASE WHEN random() < 0.3 THEN 'commercial' ELSE 'residential' END as property_type,
  -1100 + (row * 30) as center_x,
  -1100 + (col * 30) as center_z,
  20 as size_x,
  20 as size_z,
  10000 as base_price,
  10000 * 4 as current_price,
  4.0 as price_multiplier
FROM generate_series(0, 19) as row, generate_series(0, 24) as col
WHERE ROW_NUMBER() OVER () <= 500;

-- Art & Culture District (500 parcels)
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  1500 + ROW_NUMBER() OVER () as parcel_id,
  'art-culture-district' as district_id,
  CASE WHEN random() < 0.3 THEN 'commercial' ELSE 'residential' END as property_type,
  500 + (row * 30) as center_x,
  -1100 + (col * 30) as center_z,
  20 as size_x,
  20 as size_z,
  10000 as base_price,
  10000 * 4 as current_price,
  4.0 as price_multiplier
FROM generate_series(0, 19) as row, generate_series(0, 24) as col
WHERE ROW_NUMBER() OVER () <= 500;

-- DeFi District (500 parcels)
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  2000 + ROW_NUMBER() OVER () as parcel_id,
  'defi-district' as district_id,
  'commercial' as property_type,
  -1100 + (row * 30) as center_x,
  500 + (col * 30) as center_z,
  20 as size_x,
  20 as size_z,
  10000 as base_price,
  10000 * 4 as current_price,
  4.0 as price_multiplier
FROM generate_series(0, 19) as row, generate_series(0, 24) as col
WHERE ROW_NUMBER() OVER () <= 500;

-- Social District (500 parcels)
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  2500 + ROW_NUMBER() OVER () as parcel_id,
  'social-district' as district_id,
  CASE WHEN random() < 0.4 THEN 'commercial' ELSE 'residential' END as property_type,
  500 + (row * 30) as center_x,
  500 + (col * 30) as center_z,
  20 as size_x,
  20 as size_z,
  10000 as base_price,
  10000 * 3 as current_price,
  3.0 as price_multiplier
FROM generate_series(0, 19) as row, generate_series(0, 24) as col
WHERE ROW_NUMBER() OVER () <= 500;

-- Residential Districts (1600 parcels total - 400 each)
-- North
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  3000 + ROW_NUMBER() OVER () as parcel_id,
  'residential-north' as district_id,
  'residential' as property_type,
  -400 + (row * 25) as center_x,
  -1600 + (col * 25) as center_z,
  CASE WHEN random() < 0.7 THEN 20 ELSE 25 END as size_x,
  CASE WHEN random() < 0.7 THEN 20 ELSE 25 END as size_z,
  10000 as base_price,
  10000 as current_price,
  1.0 as price_multiplier
FROM generate_series(0, 31) as row, generate_series(0, 15) as col
WHERE ROW_NUMBER() OVER () <= 400;

-- South
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  3400 + ROW_NUMBER() OVER () as parcel_id,
  'residential-south' as district_id,
  'residential' as property_type,
  -400 + (row * 25) as center_x,
  1200 + (col * 25) as center_z,
  CASE WHEN random() < 0.7 THEN 20 ELSE 25 END as size_x,
  CASE WHEN random() < 0.7 THEN 20 ELSE 25 END as size_z,
  10000 as base_price,
  10000 as current_price,
  1.0 as price_multiplier
FROM generate_series(0, 31) as row, generate_series(0, 15) as col
WHERE ROW_NUMBER() OVER () <= 400;

-- East
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  3800 + ROW_NUMBER() OVER () as parcel_id,
  'residential-east' as district_id,
  'residential' as property_type,
  1200 + (row * 25) as center_x,
  -400 + (col * 25) as center_z,
  CASE WHEN random() < 0.7 THEN 20 ELSE 25 END as size_x,
  CASE WHEN random() < 0.7 THEN 20 ELSE 25 END as size_z,
  10000 as base_price,
  10000 as current_price,
  1.0 as price_multiplier
FROM generate_series(0, 15) as row, generate_series(0, 31) as col
WHERE ROW_NUMBER() OVER () <= 400;

-- West
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  4200 + ROW_NUMBER() OVER () as parcel_id,
  'residential-west' as district_id,
  'residential' as property_type,
  -1600 + (row * 25) as center_x,
  -400 + (col * 25) as center_z,
  CASE WHEN random() < 0.7 THEN 20 ELSE 25 END as size_x,
  CASE WHEN random() < 0.7 THEN 20 ELSE 25 END as size_z,
  10000 as base_price,
  10000 as current_price,
  1.0 as price_multiplier
FROM generate_series(0, 15) as row, generate_series(0, 31) as col
WHERE ROW_NUMBER() OVER () <= 400;

-- Glizzy World (200 parcels)
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  4600 + ROW_NUMBER() OVER () as parcel_id,
  'glizzy-world' as district_id,
  'commercial' as property_type,
  -800 + (row * 40) as center_x,
  -800 + (col * 40) as center_z,
  20 as size_x,
  20 as size_z,
  10000 as base_price,
  10000 * 15 as current_price,
  15.0 as price_multiplier
FROM generate_series(0, 9) as row, generate_series(0, 19) as col
WHERE ROW_NUMBER() OVER () <= 200;

-- Creator Hub (200 parcels)
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  4800 + ROW_NUMBER() OVER () as parcel_id,
  'creator-hub' as district_id,
  'commercial' as property_type,
  400 + (row * 40) as center_x,
  -800 + (col * 40) as center_z,
  20 as size_x,
  20 as size_z,
  10000 as base_price,
  10000 * 3 as current_price,
  3.0 as price_multiplier
FROM generate_series(0, 9) as row, generate_series(0, 19) as col
WHERE ROW_NUMBER() OVER () <= 200;

-- Incubation Zone (144 parcels)
INSERT INTO properties (parcel_id, district_id, property_type, center_x, center_z, size_x, size_z, base_price, current_price, price_multiplier)
SELECT 
  5000 + ROW_NUMBER() OVER () as parcel_id,
  'incubation-zone' as district_id,
  'commercial' as property_type,
  -200 + (row * 40) as center_x,
  1700 + (col * 50) as center_z,
  20 as size_x,
  20 as size_z,
  10000 as base_price,
  10000 * 2 as current_price,
  2.0 as price_multiplier
FROM generate_series(0, 11) as row, generate_series(0, 11) as col
WHERE ROW_NUMBER() OVER () <= 144;

-- Total: 500 + 300 + 200 + 500*4 + 400*4 + 200 + 200 + 144 = 4444 parcels
