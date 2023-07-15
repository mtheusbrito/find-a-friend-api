/*
  Warnings:

  - You are about to drop the column `number` on the `organizations` table. All the data in the column will be lost.
  - Added the required column `dtype` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `energyLevel` on the `pets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DType" AS ENUM ('CAT', 'DOG');

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "number",
ADD COLUMN     "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "state" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "dtype" "DType" NOT NULL,
DROP COLUMN "energyLevel",
ADD COLUMN     "energyLevel" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "Energy";
