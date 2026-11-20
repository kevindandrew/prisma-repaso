import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../services/prisma";

export async function register(req: Request, res: Response) {
  try {
    const { email, password, rol, celular, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, rol, celular, name },
      select: { id: true, email: true, rol: true },
    });

    res.status(201).json(user);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al crear el usuario",
      details: error.message,
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" },
    );

    res.json({ token });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al eliminar el usuario",
      details: error.message,
    });
  }
}
