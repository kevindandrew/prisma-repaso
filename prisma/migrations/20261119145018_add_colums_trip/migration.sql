/*
  Warnings:

  - Added the required column `asientosDis` to the `trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `asientosVen` to the `trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duracion` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "asientosDis" INTEGER NOT NULL,
ADD COLUMN     "asientosVen" INTEGER NOT NULL,
ADD COLUMN     "duracion" INTEGER NOT NULL;
