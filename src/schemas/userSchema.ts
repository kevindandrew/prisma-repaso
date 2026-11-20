import { z } from "zod";

export const createUserSchema = z.strictObject({
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
  celular: z.coerce
    .number({ error: "el celular es obligatorio" })
    .int("el celular debe ser un número entero")
    .min(10_000_000, "el celular debe tener entre 8 y 11 dígitos")
    .max(99_999_999_999, "el celular debe tener entre 8 y 11 dígitos"),
  password: z
    .string({
      message: "la contraseña es un string y es obligatorio", // validar con expresiones regulares
    })
    .min(8, "la contraseña debe tener minimamente 8 caracteres")
    .max(100, "la contraseña solo puede tener cm maximo 100 caracteres"),
  rol: z.enum(["RECEPCION", "CONDUCTOR", "ADMIN"], {
    message: "EL ROL SOLO PUEDE SER RECEPCION, CONDUCTOR o ADMIN",
  }),
});
