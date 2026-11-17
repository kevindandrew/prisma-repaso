import type { Request, Response } from "express";
import { prisma } from "../services/prisma";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
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
