-- Create property customization table for yards and fences
CREATE TABLE IF NOT EXISTS property_yards (
  id BIGSERIAL PRIMARY KEY,
  property_id BIGINT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  fence_type TEXT DEFAULT 'white-picket' CHECK (fence_type IN ('white-picket', 'energy-barrier', 'none')),
  front_yard_items JSONB DEFAULT '[]'::jsonb,
  back_yard_items JSONB DEFAULT '[]'::jsonb,
  grass_texture TEXT DEFAULT 'standard',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_property_yards_property ON property_yards(property_id);

-- Create yard items catalog
CREATE TABLE IF NOT EXISTS yard_items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tree', 'flower', 'fountain', 'statue', 'furniture', 'decoration')),
  price_void INTEGER NOT NULL,
  model_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default yard items
INSERT INTO yard_items (name, category, price_void, description) VALUES
  ('Oak Tree', 'tree', 50, 'Classic oak tree for shade'),
  ('Palm Tree', 'tree', 75, 'Tropical palm tree'),
  ('Rose Bush', 'flower', 20, 'Beautiful red roses'),
  ('Tulip Garden', 'flower', 30, 'Colorful tulip arrangement'),
  ('Stone Fountain', 'fountain', 200, 'Elegant water fountain'),
  ('Diamond Statue', 'statue', 500, 'Luxury diamond sculpture'),
  ('Outdoor Table', 'furniture', 100, 'Patio dining table'),
  ('Lounge Chair', 'furniture', 80, 'Comfortable outdoor seating'),
  ('Neon Sign', 'decoration', 150, 'Custom neon sign display'),
  ('Hologram Art', 'decoration', 300, 'Interactive holographic art piece')
ON CONFLICT DO NOTHING;
