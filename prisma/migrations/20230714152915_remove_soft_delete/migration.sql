/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `requirements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "requirements" DROP COLUMN "deleted_at";
