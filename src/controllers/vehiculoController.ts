import type { Request, Response } from "express";
import { prisma } from "../services/prisma";

export async function getVehiculos(req: Request, res: Response) {
  try {
    const vehiculo = await prisma.vehicle.findMany({
      orderBy: { id: "asc" },
      include: {
        conductor: {
          select: {
            name: true,
            lastName: true,
            celular: true,
          },
        },
      },
    });
    res.status(200).json({ data: vehiculo });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener los vehiculos",
      details: error.message,
    });
  }
}
export async function getVehiculosById(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const vehiculo = await prisma.vehicle.findUnique({
      where: { id: idBuscado },
      include: {
        conductor: {
          select: {
            name: true,
            lastName: true,
            celular: true,
          },
        },
      },
    });
    if (!vehiculo) {
      return res
        .status(404)
        .json({ message: "el vehiculo con este id no existe :C" });
    }
    res.status(200).json({
      status: "ok",
      data: vehiculo,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener el vehiculo",
      details: error.message,
    });
  }
}
export async function createVehiculo(req: Request, res: Response) {
  const { plate, model, capacity, status, idConductor } = req.body;
  try {
    const userEncontrado = await prisma.user.findUnique({
      where: { id: idConductor },
    });

    if (!userEncontrado || userEncontrado.rol !== "CONDUCTOR") {
      return res.status(400).json({
        message:
          "no existe un conductor con ese id o el rol del usuario no es CONDUCTOR",
      });
    }
    const vehiculoExistente = await prisma.vehicle.findUnique({
      where: { plate },
    });

    if (vehiculoExistente) {
      return res.status(400).json({
        message:
          "la placa de este vehiculo ya esxiste en otro que tenemos registrado",
      });
    }

    const newVehicule = await prisma.vehicle.create({
      data: {
        plate,
        model,
        capacity,
        status,
        idConductor,
      },
    });
    res.status(201).json({
      status: "ok",
      data: newVehicule,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al crear el vehiculo",
      details: error.message,
    });
  }
}
export async function putVehiculo(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const { model, capacity, status } = req.body;
  try {
    const vehiculo = await prisma.vehicle.findUnique({
      where: { id: idBuscado },
    });
    if (!vehiculo) {
      return res
        .status(404)
        .json({ message: "el vehiculo con este id no existe :C" });
    }
    const updateVehiculo = await prisma.vehicle.update({
      where: { id: idBuscado },
      data: {
        model,
        capacity,
        status,
      },
    });
    res.status(200).json({
      message: "vehiculo actualizado con exito",
      data: updateVehiculo,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al actualizar el vehiculo",
      details: error.message,
    });
  }
}
export async function patchConductor(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const { idConductor } = req.body;
  try {
    const userEncontrado = await prisma.user.findUnique({
      where: { id: idConductor },
    });

    if (!userEncontrado || userEncontrado.rol !== "CONDUCTOR") {
      return res.status(400).json({
        message:
          "no existe un conductor con ese id o el rol del usuario no es CONDUCTOR",
      });
    }
    // validamos el vehiculo ANTES de actualizarlo
    const vehiculo = await prisma.vehicle.findUnique({
      where: { id: idBuscado },
    });
    if (!vehiculo) {
      return res
        .status(404)
        .json({ message: "no existe un vehiculo con este id" });
    }
    if (vehiculo.status === "FUERA_DE_SERVICIO") {
      return res.status(400).json({
        message:
          "un vehiculo q esta fuera de servicio no se puede reasignar a otro conductor",
      });
    }
    const vehiculoActualizado = await prisma.vehicle.update({
      where: { id: idBuscado },
      data: {
        idConductor,
      },
    });
    res.status(200).json({
      message: "vehiculo reasignado con exito",
      data: vehiculoActualizado,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al cambiar de conductor",
      details: error.message,
    });
  }
}
export async function deleteVehiculo(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const vehiculo = await prisma.vehicle.findUnique({
      where: { id: idBuscado },
      include: { viajes: true },
    });
    if (!vehiculo) {
      return res
        .status(404)
        .json({ message: "el vehiculo con este id no existe :C" });
    }
    if (vehiculo.viajes.length > 0) {
      return res.status(400).json({
        message:
          "no podemos eliminar un vehiculo q tiene viajes, elimina primero sus viajes",
      });
    }
    const vehiculoDelete = await prisma.vehicle.delete({
      where: { id: idBuscado },
    });
    res.status(200).json({
      message: "vehiculo eliminado con exito",
      data: vehiculoDelete,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al eliminar el vehiculo",
      details: error.message,
    });
  }
}
