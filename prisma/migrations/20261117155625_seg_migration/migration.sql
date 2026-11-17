/*
  Warnings:

  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Trips` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_idPasajero_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_idViaje_fkey";

-- DropForeignKey
ALTER TABLE "Trips" DROP CONSTRAINT "Trips_idRoute_fkey";

-- DropForeignKey
ALTER TABLE "Trips" DROP CONSTRAINT "Trips_idVehiculo_fkey";

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "Trips";

-- CreateTable
CREATE TABLE "trips" (
    "id" SERIAL NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "idVehiculo" INTEGER NOT NULL,
    "idRoute" INTEGER NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "pago" BOOLEAN NOT NULL,
    "cantidadAsientos" INTEGER NOT NULL,
    "idViaje" INTEGER NOT NULL,
    "idPasajero" INTEGER NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_idVehiculo_fkey" FOREIGN KEY ("idVehiculo") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_idRoute_fkey" FOREIGN KEY ("idRoute") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_idViaje_fkey" FOREIGN KEY ("idViaje") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_idPasajero_fkey" FOREIGN KEY ("idPasajero") REFERENCES "passengers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
