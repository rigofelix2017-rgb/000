-- Update default property sizes from 20×20 to 25×25

-- Update existing residential properties to 25×25
UPDATE properties
SET size_x = 25, size_z = 25
WHERE property_type = 'residential' AND size_x = 20;

-- Update some residential to be 30×30 (premium)
UPDATE properties
SET size_x = 30, size_z = 30,
    current_price = current_price * 1.5
WHERE property_type = 'residential'
AND parcel_id IN (
  SELECT parcel_id FROM properties
  WHERE property_type = 'residential'
  ORDER BY RANDOM()
  LIMIT 400
);

-- Add default customization for all existing properties
INSERT INTO property_customization (property_id, fence_type, grass_texture)
SELECT id, 'white-picket', 'standard'
FROM properties
WHERE id NOT IN (SELECT property_id FROM property_customization);
