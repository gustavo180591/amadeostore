/*
  Warnings:

  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryMethod" "DeliveryMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "shippingAddress" JSONB,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "totalAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "trackingNumber" TEXT;
