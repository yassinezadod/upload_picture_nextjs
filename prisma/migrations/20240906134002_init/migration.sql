-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `genre` VARCHAR(191) NOT NULL,
    `inscription` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `ecoleOrigine` VARCHAR(191) NOT NULL,
    `acteNaissance` VARCHAR(191) NOT NULL,
    `picture` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
