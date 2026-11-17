-- CreateEnum
CREATE TYPE "Role" AS ENUM ('RECEPCION', 'CONDUCTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('FUERA_DE_SERVICIO', 'EN_MANTENIMIENTO', 'DISPONIBLE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT,
    "celular" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Role" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passengers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT,
    "age" INTEGER NOT NULL,
    "diu" TEXT NOT NULL,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routes" (
    "id" SERIAL NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,

    CONSTRAINT "routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" SERIAL NOT NULL,
    "plate" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "idConductor" INTEGER NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trips" (
    "id" SERIAL NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "idVehiculo" INTEGER NOT NULL,
    "idRoute" INTEGER NOT NULL,

    CONSTRAINT "Trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "pago" BOOLEAN NOT NULL,
    "cantidadAsientos" INTEGER NOT NULL,
    "idViaje" INTEGER NOT NULL,
    "idPasajero" INTEGER NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_idConductor_fkey" FOREIGN KEY ("idConductor") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_idVehiculo_fkey" FOREIGN KEY ("idVehiculo") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_idRoute_fkey" FOREIGN KEY ("idRoute") REFERENCES "routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_idViaje_fkey" FOREIGN KEY ("idViaje") REFERENCES "Trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_idPasajero_fkey" FOREIGN KEY ("idPasajero") REFERENCES "passengers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
