import type { Request, Response } from "express";
import { prisma } from "../services/prisma";

export async function getRutas(req: Request, res: Response) {
  try {
    const routes = await prisma.route.findMany({
      orderBy: { id: "asc" },
    });
    res.status(200).json({ data: routes });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener los usuarios",
      details: error.message,
    });
  }
}
export async function getRutasById(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const ruta = await prisma.route.findUnique({
      where: { id: idBuscado },
    });
    if (!ruta) {
      return res
        .status(404)
        .json({ message: "la ruta con este id no existe :C" });
    }
    res.status(200).json({
      status: "ok",
      data: ruta,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener los usuarios",
      details: error.message,
    });
  }
}
export async function createRutas(req: Request, res: Response) {
  const { origin, destination } = req.body;
  try {
    const newRuta = await prisma.route.create({
      data: {
        origin,
        destination,
      },
    });
    res.status(201).json({
      status: "ok",
      data: newRuta,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener los usuarios",
      details: error.message,
    });
  }
}
export async function putRutas(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const { origin, destination } = req.body;
  try {
    const ruta = await prisma.route.findUnique({ where: { id: idBuscado } });
    if (!ruta) {
      return res
        .status(404)
        .json({ message: "la ruta con este id no existe :C" });
    }
    const updateRuta = await prisma.route.update({
      where: { id: idBuscado },
      data: {
        origin,
        destination,
      },
    });
    res
      .status(200)
      .json({ message: "ruta actualizada con exito", data: updateRuta });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al actualizar la ruta",
      details: error.message,
    });
  }
}
export async function deleteRutas(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const ruta = await prisma.route.findUnique({
      where: { id: idBuscado },
      include: { viajes: true },
    });
    if (!ruta) {
      return res
        .status(404)
        .json({ message: "la ruta con este id no existe :C" });
    }
    if (ruta.viajes.length > 0) {
      return res.status(400).json({
        message:
          "no podemos eliminar una ruta q tiene viajes, elimina primero los viajes",
      });
    }
    const rutaDelete = await prisma.route.delete({
      where: { id: idBuscado },
    });
    res.status(200).json({
      message: "ruta eliminada con exito",
      data: rutaDelete,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al eliminar la ruta",
      details: error.message,
    });
  }
}
