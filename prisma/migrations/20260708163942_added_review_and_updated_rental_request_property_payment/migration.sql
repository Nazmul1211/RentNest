/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyRent` to the `rentalRequests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moveInDate` to the `rentalRequests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `rentalRequests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAYMENT_PENDING', 'PAID', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PUBLISHED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'SSLCOMMERZ');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'MOBILE_BANKING', 'BANK_TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'usd',
ADD COLUMN     "failedAt" TIMESTAMP(3),
ADD COLUMN     "method" "PaymentMethod" NOT NULL DEFAULT 'CARD',
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "provider" "PaymentProvider" NOT NULL DEFAULT 'STRIPE',
ADD COLUMN     "providerPaymentIntentId" TEXT,
ADD COLUMN     "providerResponse" JSONB,
ADD COLUMN     "providerSessionId" TEXT,
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "transactionId" TEXT;

-- AlterTable
ALTER TABLE "rentalRequests" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "landlordNote" TEXT,
ADD COLUMN     "monthlyRent" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "moveInDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "moveOutDate" TIMESTAMP(3),
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "status" "RentalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "tenantMessage" TEXT,
ADD COLUMN     "totalAmount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "totalMonths" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");
