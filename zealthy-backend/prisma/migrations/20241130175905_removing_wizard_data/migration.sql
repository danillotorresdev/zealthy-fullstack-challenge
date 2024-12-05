/*
  Warnings:

  - You are about to drop the column `wizardData` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wizardStep` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "wizardData",
DROP COLUMN "wizardStep";
