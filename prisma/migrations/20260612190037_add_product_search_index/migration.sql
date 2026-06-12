-- This is an empty migration.

CREATE INDEX idx_products_name_lower
ON products (LOWER(name));