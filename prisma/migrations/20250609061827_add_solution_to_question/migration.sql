/*
  Warnings:

  - Added the required column `solution` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Question` ADD COLUMN `solution` TEXT NOT NULL DEFAULT 'Penyelesaian belum tersedia';
