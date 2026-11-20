import { z } from "zod";

export const createPassengerSchema = z.strictObject({
  name: z
    .string({ message: "el nombre es un string y es obligatorio" })
    .trim()
    .min(2, "el nombre debe tener almenos 2 caracteres")
    .max(80, "el nombre puede tener cm maximo 80 caracteres"),
  lastName: z
    .string({ message: "el apellido es un string y es obligatorio" })
    .trim()
    .min(2, "el apellido debe tener almenos 2 caracteres")
    .max(80, "el apellido puede tener cm maximo 80 caracteres"),
  age: z
    .number({ message: "la edad es un int y es obligatorio" })
    .int("la edad es un entero")
    .min(0, "la edad no puede ser menor a 0")
    .max(120, "la edad no puede ser mayor a 120"),
  diu: z
    .string({
      message: "el documento de identidad debe ser un string y es obligatorio",
    })
    .trim()
    .min(4, "El documento de identidad debe tener almenos 4 caracteres")
    .max(40, "El documento de identidad debe tener maximo 40 caracteres"),
});
