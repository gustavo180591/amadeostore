/*
  Warnings:

  - The values [ACTIVE,INACTIVE] on the enum `ProductStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `compareAtPrice` on the `Product` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductStatus_new" AS ENUM ('DRAFT', 'PUBLISHED', 'OUT_OF_STOCK', 'ARCHIVED');
ALTER TABLE "Product" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "status" TYPE "ProductStatus_new" USING ("status"::text::"ProductStatus_new");
ALTER TYPE "ProductStatus" RENAME TO "ProductStatus_old";
ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";
DROP TYPE "ProductStatus_old";
ALTER TABLE "Product" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "compareAtPrice",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "specs" JSONB,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "ProductImage_isPrimary_idx" ON "ProductImage"("isPrimary");
