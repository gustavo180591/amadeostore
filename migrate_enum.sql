-- First, add the new enum values to the existing enum
ALTER TYPE "ProductStatus" ADD VALUE 'DRAFT';
ALTER TYPE "ProductStatus" ADD VALUE 'PUBLISHED';
ALTER TYPE "ProductStatus" ADD VALUE 'ARCHIVED';

-- Update existing products to use new status values
UPDATE "Product" SET status = 'PUBLISHED' WHERE status = 'ACTIVE';
UPDATE "Product" SET status = 'ARCHIVED' WHERE status = 'INACTIVE';

-- Note: OUT_OF_STOCK already exists, so we keep it
