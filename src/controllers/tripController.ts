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
      details: error.message,
    });
  }
}
export async function getTripById(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const viaje = await prisma.trip.findUnique({
      where: { id: idBuscado },
      include: {
        vehiculo: true,
        Ruta: true,
        reservas: true,
      },
    });
    if (!viaje) {
      return res
        .status(404)
        .json({ message: "el viaje  con este id no existe :C" });
    }
    res.status(200).json({
      status: "ok",
      data: viaje,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener el viaje",
      details: error.message,
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
      details: error.message,
    });
  }
}
export async function putTrip(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const { fechaHora, idVehiculo, idRoute, duracion } = req.body;
  try {
    const viaje = await prisma.trip.findUnique({ where: { id: idBuscado } });
    if (!viaje) {
      return res.status(404).json({ message: "el viaje no existe" });
    }
    if (viaje.asientosVen !== 0) {
      return res.status(400).json({
        message: "no podemos actualizar un viaje q ya tenga boletos vendidos",
      });
    }
    const updateViaje = await prisma.trip.update({
      where: { id: idBuscado },
      data: {
        fechaHora,
        idVehiculo,
        idRoute,
        duracion,
      },
    });
    res
      .status(200)
      .json({ message: "viaje actualizado con exito", data: updateViaje });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al actualizar el viaje",
      details: error.message,
    });
  }
}
export async function patchVehiculo(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const { idVehiculo } = req.body;
  try {
    const vehiculo = await prisma.vehicle.findUnique({
      where: { id: idVehiculo },
    });
    if (!vehiculo || vehiculo.status !== "DISPONIBLE") {
      return res
        .status(400)
        .json({ message: "este vehiculo no existe o no esta disponible" });
    }
    const viaje = await prisma.trip.findUnique({ where: { id: idBuscado } });
    if (!viaje) {
      return res.status(404).json({ message: "este viaje no existe" });
    }

    const vehiculoAnterior = await prisma.vehicle.findUnique({
      where: { id: viaje.idVehiculo },
    });
    if (!vehiculoAnterior) {
      return res
        .status(400)
        .json({ message: "este vehiculo no existe o no esta disponible" });
    }

    if (vehiculo.capacity < vehiculoAnterior.capacity) {
      return res.status(400).json({
        message:
          "no podemos cambiar a este vehiculo x q tiene una capacidad menor de pasajeros",
      });
    }

    let asientosDis =
      viaje.asientosDis + (vehiculo.capacity - vehiculoAnterior.capacity);
    const viajeActualizado = await prisma.trip.update({
      where: { id: idBuscado },
      data: { idVehiculo, asientosDis },
    });

    res
      .status(200)
      .json({ message: "viaje actualziado con exito", data: viajeActualizado });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al actualizar el viaje",
      details: error.message,
    });
  }
}
export async function patchDate(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const { fechaHora } = req.body;
  try {
    const viaje = await prisma.trip.findUnique({ where: { id: idBuscado } });
    if (!viaje) {
      return res.status(404).json({ message: "este viaje no existe" });
    }

    const viajeActualizado = await prisma.trip.update({
      where: { id: idBuscado },
      data: { fechaHora },
    });
    res.status(200).json({
      message: "fecha y hora actualizado con exito",
      data: viajeActualizado,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al actualizar la fecha del viaje",
      details: error.message,
    });
  }
}
export async function deleteViaje(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const viaje = await prisma.trip.findUnique({
      where: { id: idBuscado },
      include: { reservas: true },
    });
    if (!viaje) {
      return res
        .status(404)
        .json({ message: "el viaje con este id no existe :C" });
    }
    if (viaje.reservas.length > 0) {
      return res.status(400).json({
        message:
          "no podemos eliminar un viaje q ya tiene reservas, elimina primero las reservas",
      });
    }
    const tripDelete = await prisma.trip.delete({
      where: { id: idBuscado },
    });
    res.status(200).json({
      message: "viaje eliminado con exito",
      data: tripDelete,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al eliminar el viaje",
      details: error.message,
    });
  }
}
