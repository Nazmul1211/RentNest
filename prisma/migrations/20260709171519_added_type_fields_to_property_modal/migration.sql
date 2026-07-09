-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE', 'UNKNOWN');

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "isActive" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "type" "PropertyType" DEFAULT 'UNKNOWN';
