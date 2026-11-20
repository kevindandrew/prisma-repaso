import type { Request, Response } from "express";
import { prisma } from "../services/prisma";

export async function getBookings(req: Request, res: Response) {
  try {
    const reservas = await prisma.booking.findMany({
      orderBy: { id: "asc" },
      include: {
        viaje: true,
        pasajero: true,
      },
    });
    res.status(200).json({ data: reservas });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener las reservas",
      details: error.message,
    });
  }
}
export async function getBookingById(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const reserva = await prisma.booking.findUnique({
      where: { id: idBuscado },
      include: {
        viaje: true,
        pasajero: true,
      },
    });
    if (!reserva) {
      return res
        .status(404)
        .json({ message: "la reserva con este id no existe :C" });
    }
    res.status(200).json({
      status: "ok",
      data: reserva,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al obtener la reserva",
      details: error.message,
    });
  }
}
export async function createBooking(req: Request, res: Response) {
  const { pago, cantidadAsientos, idViaje, idPasajero } = req.body;
  try {
    if (!cantidadAsientos || cantidadAsientos <= 0) {
      return res
        .status(400)
        .json({ message: "la cantidad de asientos debe ser mayor a 0" });
    }
    const viaje = await prisma.trip.findUnique({ where: { id: idViaje } });
    if (!viaje) {
      return res.status(404).json({ message: "el viaje no existe" });
    }
    const pasajero = await prisma.passenger.findUnique({
      where: { id: idPasajero },
    });
    if (!pasajero) {
      return res.status(404).json({ message: "el pasajero no existe" });
    }
    if (viaje.asientosDis < cantidadAsientos) {
      return res.status(400).json({
        message: `no hay suficientes asientos, solo quedan ${viaje.asientosDis}`,
      });
    }

    // creamos la reserva y actualizamos los asientos del viaje al mismo tiempo
    const [newReserva] = await prisma.$transaction([
      prisma.booking.create({
        data: { pago, cantidadAsientos, idViaje, idPasajero },
      }),
      prisma.trip.update({
        where: { id: idViaje },
        data: {
          asientosDis: { decrement: cantidadAsientos },
          asientosVen: { increment: cantidadAsientos },
        },
      }),
    ]);
    res
      .status(201)
      .json({ message: "reserva creada con exito", data: newReserva });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al crear la reserva",
      details: error.message,
    });
  }
}
export async function putBooking(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const { pago, cantidadAsientos } = req.body;
  try {
    const reserva = await prisma.booking.findUnique({
      where: { id: idBuscado },
      include: { viaje: true },
    });
    if (!reserva) {
      return res.status(404).json({ message: "la reserva no existe" });
    }
    if (!cantidadAsientos || cantidadAsientos <= 0) {
      return res
        .status(400)
        .json({ message: "la cantidad de asientos debe ser mayor a 0" });
    }
    // diferencia de asientos entre lo nuevo y lo q ya tenia
    const diferencia = cantidadAsientos - reserva.cantidadAsientos;
    if (diferencia > reserva.viaje.asientosDis) {
      return res.status(400).json({
        message: `no hay suficientes asientos, solo quedan ${reserva.viaje.asientosDis}`,
      });
    }

    const [reservaActualizada] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: idBuscado },
        data: { pago, cantidadAsientos },
      }),
      prisma.trip.update({
        where: { id: reserva.idViaje },
        data: {
          asientosDis: { decrement: diferencia },
          asientosVen: { increment: diferencia },
        },
      }),
    ]);
    res.status(200).json({
      message: "reserva actualizada con exito",
      data: reservaActualizada,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al actualizar la reserva",
      details: error.message,
    });
  }
}
export async function patchPago(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  const { pago } = req.body;
  try {
    const reserva = await prisma.booking.findUnique({
      where: { id: idBuscado },
    });
    if (!reserva) {
      return res.status(404).json({ message: "la reserva no existe" });
    }
    const reservaActualizada = await prisma.booking.update({
      where: { id: idBuscado },
      data: { pago },
    });
    res.status(200).json({
      message: "pago actualizado con exito",
      data: reservaActualizada,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al actualizar el pago",
      details: error.message,
    });
  }
}
export async function deleteBooking(req: Request, res: Response) {
  const idBuscado = Number(req.params.id);
  try {
    const reserva = await prisma.booking.findUnique({
      where: { id: idBuscado },
    });
    if (!reserva) {
      return res
        .status(404)
        .json({ message: "la reserva con este id no existe :C" });
    }
    // eliminamos la reserva y devolvemos los asientos al viaje
    const [reservaEliminada] = await prisma.$transaction([
      prisma.booking.delete({ where: { id: idBuscado } }),
      prisma.trip.update({
        where: { id: reserva.idViaje },
        data: {
          asientosDis: { increment: reserva.cantidadAsientos },
          asientosVen: { decrement: reserva.cantidadAsientos },
        },
      }),
    ]);
    res.status(200).json({
      message: "reserva eliminada con exito",
      data: reservaEliminada,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      error: "error al eliminar la reserva",
      details: error.message,
    });
  }
}
//MIGRACION DE 2 VEHICULOS A UNO SOLO
//AGREGAR ESTADO DE VEHICULO Y DE VIAJE
//
