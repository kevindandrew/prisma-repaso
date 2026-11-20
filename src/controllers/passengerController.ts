import type { Request, Response } from "express";
import { prisma } from "../services/prisma";

export async function getPassengers(req: Request, res: Response) {
  try {
    const passengers = await prisma.passenger.findMany({
      orderBy: { id: "asc" },
    });
    res.status(200).json({ data: passengers });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener los pasajeros",
      details: error.message,
    });
  }
}
export async function getPassengersById(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const passenger = await prisma.passenger.findUnique({
      where: { id: idBuscado },
    });
    if (!passenger) {
      return res
        .status(404)
        .json({ message: "el pasajero con este id no existe :C" });
    }
    res.status(200).json({
      status: "ok",
      data: passenger,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener el pasajero",
      details: error.message,
    });
  }
}
export async function createPassengers(req: Request, res: Response) {
  const { name, lastName, age, diu } = req.body;
  try {
    const newPassenger = await prisma.passenger.create({
      data: {
        name,
        lastName,
        age,
        diu,
      },
    });
    res.status(201).json({
      status: "ok",
      data: newPassenger,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al crear el pasajero",
      details: error.message,
    });
  }
}
export async function putPassenger(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const { name, lastName, age, diu } = req.body;
  try {
    const passenger = await prisma.passenger.findUnique({
      where: { id: idBuscado },
    });
    if (!passenger) {
      return res
        .status(404)
        .json({ message: "el pasajero con este id no existe :C" });
    }
    const updatePassenger = await prisma.passenger.update({
      where: { id: idBuscado },
      data: {
        name,
        lastName,
        age,
        diu,
      },
    });
    res.status(200).json({
      message: "pasajero actualizado con exito",
      data: updatePassenger,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al actualizar el pasajero",
      details: error.message,
    });
  }
}

export async function deletePassenger(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const passenger = await prisma.passenger.findUnique({
      where: { id: idBuscado },
      include: { reservas: true },
    });
    if (!passenger) {
      return res
        .status(404)
        .json({ message: "el pasajero con este id no existe :C" });
    }
    if (passenger.reservas.length > 0) {
      return res.status(400).json({
        message:
          "no podemos eliminar un pasajero q tiene reservas, elimina primero sus reservas",
      });
    }
    const passengerDelete = await prisma.passenger.delete({
      where: { id: idBuscado },
    });
    res.status(200).json({
      message: "pasajero eliminado con exito",
      data: passengerDelete,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al eliminar el pasajero",
      details: error.message,
    });
  }
}
