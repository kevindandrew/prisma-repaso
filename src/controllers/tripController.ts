import type { Request, Response } from "express";
import { prisma } from "../services/prisma";

export async function getTrips(req: Request, res: Response) {
  try {
    const viajeRuta = await prisma.trip.findMany({
      orderBy: { id: "asc" },
      include: {
        Ruta: true,
        vehiculo: true,
      },
    });
    res.status(200).json({ data: viajeRuta });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener los viajes",
      details: error.mesagge,
    });
  }
}

export async function createTrip(req: Request, res: Response) {
  const { fechaHora, idVehiculo, idRoute, duracion } = req.body;
  try {
    const vehiculo = await prisma.vehicle.findUnique({
      where: { id: idVehiculo },
    });
    if (!vehiculo || vehiculo.status !== "DISPONIBLE") {
      return res.status(400).json({
        message:
          "este vehiculo no esta registrado en el sistema o no esta disponible para trabajar",
      });
    }
    let asientosDis = vehiculo.capacity - 1;
    if (duracion >= 8) {
      asientosDis = asientosDis - 2;
    }
    let asientosVen = 0;
    const ruta = await prisma.route.findUnique({
      where: { id: idRoute },
    });
    if (!ruta) {
      return res.status(404).json({ message: "la ruta no existe " });
    }
    const newViajesito = await prisma.trip.create({
      data: {
        fechaHora,
        idVehiculo,
        idRoute,
        duracion,
        asientosVen,
        asientosDis,
      },
    });
    res
      .status(201)
      .json({ message: "viaje creado con exito", data: newViajesito });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al crear un nuevo viaje",
      details: error.mesagge,
    });
  }
}
