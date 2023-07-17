/*
  Warnings:

  - You are about to drop the column `dependencyLevel` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `energyLevel` on the `pets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pets" DROP COLUMN "dependencyLevel",
DROP COLUMN "energyLevel",
ADD COLUMN     "dependency_level" "Dependency" NOT NULL DEFAULT 'AVERAGE',
ADD COLUMN     "energy_level" INTEGER NOT NULL DEFAULT 1;
