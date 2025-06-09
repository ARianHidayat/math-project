/*
  Warnings:

  - You are about to drop the column `created_at` on the `question` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `question` table. All the data in the column will be lost.
  - Added the required column `paketSoalId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `question` DROP FOREIGN KEY `Question_userId_fkey`;

-- DropIndex
DROP INDEX `Question_userId_fkey` ON `question`;

-- AlterTable
ALTER TABLE `account` MODIFY `refresh_token` TEXT NULL,
    MODIFY `access_token` TEXT NULL,
    MODIFY `id_token` TEXT NULL;

-- AlterTable
ALTER TABLE `question` DROP COLUMN `created_at`,
    DROP COLUMN `userId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `paketSoalId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `PaketSoal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `topic` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PaketSoal` ADD CONSTRAINT `PaketSoal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_paketSoalId_fkey` FOREIGN KEY (`paketSoalId`) REFERENCES `PaketSoal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
