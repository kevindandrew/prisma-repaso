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
      details: error.mesagge,
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
      details: error.mesagge,
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
      details: error.mesagge,
    });
  }
}
export async function putRutas(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const { origin, destination } = req.body;
  try {
    const updateUser = await prisma.route.update({
      where: { id: idBuscado },
      data: {
        origin,
        destination,
      },
    });
    if (!updateUser) {
      return res
        .status(404)
        .json({ message: "la ruta con este id no existe :C" });
    }
    res
      .status(200)
      .json({ message: "ruta actualizada con exito", data: updateUser });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al actualizar la ruta",
      details: error.mesagge,
    });
  }
}
export async function deleteRutas(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const rutaDelete = await prisma.route.delete({
      where: { id: idBuscado },
    });
    if (!rutaDelete) {
      return res
        .status(404)
        .json({ message: "la ruta con este id no existe :C" });
    }
    res.status(200).json({
      message: "ruta eliminada con exito",
      data: rutaDelete,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener los usuarios",
      details: error.mesagge,
    });
  }
}
