import type { Request, Response } from "express";
import { prisma } from "../services/prisma";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        lastName: true,
        rol: true,
        celular: true,
      },
    });
    res.status(200).json({ data: users });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener los usuarios",
      details: error.mesagge,
    });
  }
}

export async function getUserById(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id: idBuscado },
      select: {
        id: true,
        name: true,
        lastName: true,
        rol: true,
        celular: true,
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "el usuario con este id no existe :C" });
    }
    res.status(200).json({
      status: "ok",
      data: user,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener los usuarios",
      details: error.mesagge,
    });
  }
}

export async function createUser(req: Request, res: Response) {
  const { name, lastName, celular, password, rol } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        lastName,
        celular,
        password,
        rol,
      },
    });
    res.status(201).json({
      status: "ok",
      data: newUser,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener los usuarios",
      details: error.mesagge,
    });
  }
}

export async function putUser(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const { name, lastName, celular, password, rol } = req.body;
  try {
    const updateUser = await prisma.user.update({
      where: { id: idBuscado },
      data: {
        name,
        lastName,
        celular,
        password,
        rol,
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        rol: true,
        celular: true,
      },
    });
    if (!updateUser) {
      return res
        .status(404)
        .json({ message: "el usuario con este id no existe :C" });
    }
    res
      .status(200)
      .json({ message: "usuario actualizado con exito", data: updateUser });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener los usuarios",
      details: error.mesagge,
    });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const userDelete = await prisma.user.delete({
      where: { id: idBuscado },
    });
    if (!userDelete) {
      return res
        .status(404)
        .json({ message: "el usuario con este id no existe :C" });
    }
    res.status(200).json({
      message: "usuario eliminado con exito",
      data: userDelete,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener los usuarios",
      details: error.mesagge,
    });
  }
}
