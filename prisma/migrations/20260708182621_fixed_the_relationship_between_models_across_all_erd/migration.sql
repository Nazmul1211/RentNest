/*
  Warnings:

  - Added the required column `payerId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentalRequestId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyId` to the `rentalRequests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `rentalRequests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentalRequestId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "payerId" TEXT NOT NULL,
ADD COLUMN     "rentalRequestId" TEXT NOT NULL,
ALTER COLUMN "currency" SET DEFAULT 'bdt';

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "rentalRequests" ADD COLUMN     "propertyId" TEXT NOT NULL,
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "propertyId" TEXT NOT NULL,
ADD COLUMN     "rentalRequestId" TEXT NOT NULL,
ADD COLUMN     "tenantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_rentalRequestId_fkey" FOREIGN KEY ("rentalRequestId") REFERENCES "rentalRequests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentalRequests" ADD CONSTRAINT "rentalRequests_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rentalRequests" ADD CONSTRAINT "rentalRequests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rentalRequestId_fkey" FOREIGN KEY ("rentalRequestId") REFERENCES "rentalRequests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
