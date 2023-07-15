/*
  Warnings:

  - You are about to drop the column `mail` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "mail",
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '';
