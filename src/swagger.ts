// Genera la documentacion de swagger automaticamente
// se corre con: npm run swagger
import fs from "node:fs";
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API Funvalesco",
    description: "Documentacion de la API de viajes, reservas, pasajeros y mas",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
  tags: [
    { name: "Users", description: "Usuarios del sistema" },
    { name: "Rutas", description: "Rutas de origen y destino" },
    { name: "Pasajeros", description: "Pasajeros registrados" },
    { name: "Vehiculos", description: "Vehiculos de la flota" },
    { name: "Viajes", description: "Viajes programados" },
    { name: "Reservas", description: "Reservas de asientos" },
  ],
  definitions: {
    User: {
      name: "Juan",
      lastName: "Perez",
      celular: 77712345,
      password: "123456",
      rol: "ADMIN",
    },
    Ruta: {
      origin: "La Paz",
      destination: "Cochabamba",
    },
    Pasajero: {
      name: "Maria",
      lastName: "Lopez",
      age: 25,
      diu: "1234567",
    },
    Vehiculo: {
      plate: "1234ABC",
      model: "Toyota Hiace",
      capacity: 15,
      status: "DISPONIBLE",
      idConductor: 1,
    },
    VehiculoUpdate: {
      model: "Toyota Hiace",
      capacity: 15,
      status: "EN_MANTENIMIENTO",
    },
    CambioConductor: {
      idConductor: 2,
    },
    Viaje: {
      fechaHora: "2026-12-01T08:00:00.000Z",
      idVehiculo: 1,
      idRoute: 1,
      duracion: 6,
    },
    CambioVehiculo: {
      idVehiculo: 2,
    },
    CambioFecha: {
      fechaHora: "2026-12-02T10:00:00.000Z",
    },
    Reserva: {
      pago: true,
      cantidadAsientos: 2,
      idViaje: 1,
      idPasajero: 1,
    },
    ReservaUpdate: {
      pago: true,
      cantidadAsientos: 3,
    },
    Pago: {
      pago: true,
    },
  },
};

// las rutas son relativas a esta carpeta (src)
const outputFile = "./swagger-output.json";
const endpointsFiles = ["./index.ts"];

// tag de cada grupo segun el prefijo de la ruta
const tagsPorPrefijo: Record<string, string> = {
  "/users": "Users",
  "/route": "Rutas",
  "/passenger": "Pasajeros",
  "/vehiculo": "Vehiculos",
  "/trip": "Viajes",
  "/booking": "Reservas",
};

// documentacion de cada endpoint
// body: nombre de la definicion q usa el body
// responses: codigo -> descripcion de cuando pasa
type EndpointDoc = {
  summary: string;
  description?: string;
  body?: string;
  responses: Record<string, string>;
};

const ERROR_500 = "Error interno del servidor";

const endpoints: Record<string, EndpointDoc> = {
  "get /": {
    summary: "Verificar q la API esta funcionando",
    responses: { 200: "La API responde correctamente" },
  },

  // ---------- USERS ----------
  "get /users/": {
    summary: "Listar todos los usuarios",
    description: "Devuelve todos los usuarios ordenados por id (sin la contraseña).",
    responses: { 200: "Lista de usuarios", 500: ERROR_500 },
  },
  "get /users/{id}": {
    summary: "Obtener un usuario por id",
    responses: {
      200: "Usuario encontrado",
      404: "El usuario con este id no existe",
      500: ERROR_500,
    },
  },
  "post /users/": {
    summary: "Crear un usuario",
    description: "El rol puede ser RECEPCION, CONDUCTOR o ADMIN.",
    body: "User",
    responses: { 201: "Usuario creado con exito", 500: ERROR_500 },
  },
  "put /users/{id}": {
    summary: "Actualizar un usuario",
    body: "User",
    responses: {
      200: "Usuario actualizado con exito",
      404: "El usuario con este id no existe",
      500: ERROR_500,
    },
  },
  "delete /users/{id}": {
    summary: "Eliminar un usuario",
    responses: {
      200: "Usuario eliminado con exito",
      400: "El usuario tiene vehiculos asignados",
      404: "El usuario con este id no existe",
      500: ERROR_500,
    },
  },

  // ---------- RUTAS ----------
  "get /route/": {
    summary: "Listar todas las rutas",
    responses: { 200: "Lista de rutas", 500: ERROR_500 },
  },
  "get /route/{id}": {
    summary: "Obtener una ruta por id",
    responses: {
      200: "Ruta encontrada",
      404: "La ruta con este id no existe",
      500: ERROR_500,
    },
  },
  "post /route/": {
    summary: "Crear una ruta",
    body: "Ruta",
    responses: { 201: "Ruta creada con exito", 500: ERROR_500 },
  },
  "put /route/{id}": {
    summary: "Actualizar una ruta",
    body: "Ruta",
    responses: {
      200: "Ruta actualizada con exito",
      404: "La ruta con este id no existe",
      500: ERROR_500,
    },
  },
  "delete /route/{id}": {
    summary: "Eliminar una ruta",
    responses: {
      200: "Ruta eliminada con exito",
      400: "La ruta tiene viajes",
      404: "La ruta con este id no existe",
      500: ERROR_500,
    },
  },

  // ---------- PASAJEROS ----------
  "get /passenger/": {
    summary: "Listar todos los pasajeros",
    responses: { 200: "Lista de pasajeros", 500: ERROR_500 },
  },
  "get /passenger/{id}": {
    summary: "Obtener un pasajero por id",
    responses: {
      200: "Pasajero encontrado",
      404: "El pasajero con este id no existe",
      500: ERROR_500,
    },
  },
  "post /passenger/": {
    summary: "Registrar un pasajero",
    body: "Pasajero",
    responses: { 201: "Pasajero creado con exito", 500: ERROR_500 },
  },
  "put /passenger/{id}": {
    summary: "Actualizar un pasajero",
    body: "Pasajero",
    responses: {
      200: "Pasajero actualizado con exito",
      404: "El pasajero con este id no existe",
      500: ERROR_500,
    },
  },
  "delete /passenger/{id}": {
    summary: "Eliminar un pasajero",
    responses: {
      200: "Pasajero eliminado con exito",
      400: "El pasajero tiene reservas",
      404: "El pasajero con este id no existe",
      500: ERROR_500,
    },
  },

  // ---------- VEHICULOS ----------
  "get /vehiculo/": {
    summary: "Listar todos los vehiculos",
    description: "Incluye los datos del conductor asignado.",
    responses: { 200: "Lista de vehiculos", 500: ERROR_500 },
  },
  "get /vehiculo/{id}": {
    summary: "Obtener un vehiculo por id",
    description: "Incluye los datos del conductor asignado.",
    responses: {
      200: "Vehiculo encontrado",
      404: "El vehiculo con este id no existe",
      500: ERROR_500,
    },
  },
  "post /vehiculo/": {
    summary: "Registrar un vehiculo",
    description:
      "El conductor debe existir y tener rol CONDUCTOR. La placa no se puede repetir. " +
      "El status puede ser DISPONIBLE, EN_MANTENIMIENTO o FUERA_DE_SERVICIO.",
    body: "Vehiculo",
    responses: {
      201: "Vehiculo creado con exito",
      400: "El conductor no existe / no es CONDUCTOR, o la placa ya esta registrada",
      500: ERROR_500,
    },
  },
  "put /vehiculo/{id}": {
    summary: "Actualizar un vehiculo",
    description: "Solo se puede cambiar el modelo, la capacidad y el status (la placa y el conductor no).",
    body: "VehiculoUpdate",
    responses: {
      200: "Vehiculo actualizado con exito",
      404: "El vehiculo con este id no existe",
      500: ERROR_500,
    },
  },
  "patch /vehiculo/{id}": {
    summary: "Cambiar el conductor de un vehiculo",
    description:
      "El nuevo conductor debe existir y tener rol CONDUCTOR. " +
      "Un vehiculo FUERA_DE_SERVICIO no se puede reasignar.",
    body: "CambioConductor",
    responses: {
      200: "Vehiculo reasignado con exito",
      400: "El conductor no existe / no es CONDUCTOR, o el vehiculo esta fuera de servicio",
      404: "El vehiculo con este id no existe",
      500: ERROR_500,
    },
  },
  "delete /vehiculo/{id}": {
    summary: "Eliminar un vehiculo",
    responses: {
      200: "Vehiculo eliminado con exito",
      400: "El vehiculo tiene viajes",
      404: "El vehiculo con este id no existe",
      500: ERROR_500,
    },
  },

  // ---------- VIAJES ----------
  "get /trip/": {
    summary: "Listar todos los viajes",
    description: "Incluye la ruta y el vehiculo de cada viaje.",
    responses: { 200: "Lista de viajes", 500: ERROR_500 },
  },
  "get /trip/{id}": {
    summary: "Obtener un viaje por id",
    description: "Incluye la ruta, el vehiculo y las reservas del viaje.",
    responses: {
      200: "Viaje encontrado",
      404: "El viaje con este id no existe",
      500: ERROR_500,
    },
  },
  "post /trip/": {
    summary: "Crear un viaje",
    description:
      "El vehiculo debe estar DISPONIBLE. Los asientos disponibles se calculan solos: " +
      "capacidad del vehiculo - 1 (el conductor), y si la duracion es de 8 horas o mas " +
      "se quitan 2 asientos mas. Los asientos vendidos empiezan en 0.",
    body: "Viaje",
    responses: {
      201: "Viaje creado con exito",
      400: "El vehiculo no existe o no esta DISPONIBLE",
      404: "La ruta no existe",
      500: ERROR_500,
    },
  },
  "put /trip/{id}": {
    summary: "Actualizar un viaje",
    description: "Solo se puede actualizar si el viaje todavia no tiene asientos vendidos.",
    body: "Viaje",
    responses: {
      200: "Viaje actualizado con exito",
      400: "El viaje ya tiene boletos vendidos",
      404: "El viaje no existe",
      500: ERROR_500,
    },
  },
  "patch /trip/{id}/vehiculo": {
    summary: "Cambiar el vehiculo de un viaje",
    description:
      "El nuevo vehiculo debe estar DISPONIBLE y tener igual o mas capacidad q el anterior. " +
      "Los asientos disponibles aumentan segun la diferencia de capacidad.",
    body: "CambioVehiculo",
    responses: {
      200: "Vehiculo del viaje actualizado con exito",
      400: "El vehiculo no existe, no esta disponible o tiene menos capacidad",
      404: "El viaje no existe",
      500: ERROR_500,
    },
  },
  "patch /trip/{id}/fecha": {
    summary: "Cambiar la fecha y hora de un viaje",
    body: "CambioFecha",
    responses: {
      200: "Fecha y hora actualizada con exito",
      404: "El viaje no existe",
      500: ERROR_500,
    },
  },
  "delete /trip/{id}": {
    summary: "Eliminar un viaje",
    description: "No se puede eliminar un viaje q tiene reservas, primero hay q eliminar sus reservas.",
    responses: {
      200: "Viaje eliminado con exito",
      400: "El viaje tiene reservas",
      404: "El viaje con este id no existe",
      500: ERROR_500,
    },
  },

  // ---------- RESERVAS ----------
  "get /booking/": {
    summary: "Listar todas las reservas",
    description: "Incluye el viaje y el pasajero de cada reserva.",
    responses: { 200: "Lista de reservas", 500: ERROR_500 },
  },
  "get /booking/{id}": {
    summary: "Obtener una reserva por id",
    description: "Incluye el viaje y el pasajero de la reserva.",
    responses: {
      200: "Reserva encontrada",
      404: "La reserva con este id no existe",
      500: ERROR_500,
    },
  },
  "post /booking/": {
    summary: "Crear una reserva",
    description:
      "El viaje y el pasajero deben existir y el viaje debe tener suficientes asientos disponibles. " +
      "Al crearla se restan los asientos disponibles del viaje y se suman a los vendidos.",
    body: "Reserva",
    responses: {
      201: "Reserva creada con exito",
      400: "La cantidad de asientos no es valida o no hay suficientes asientos",
      404: "El viaje o el pasajero no existe",
      500: ERROR_500,
    },
  },
  "put /booking/{id}": {
    summary: "Actualizar una reserva",
    description:
      "Se puede cambiar el pago y la cantidad de asientos. Los asientos del viaje " +
      "se ajustan segun la diferencia con la cantidad anterior.",
    body: "ReservaUpdate",
    responses: {
      200: "Reserva actualizada con exito",
      400: "La cantidad de asientos no es valida o no hay suficientes asientos",
      404: "La reserva no existe",
      500: ERROR_500,
    },
  },
  "patch /booking/{id}/pago": {
    summary: "Marcar si la reserva esta pagada",
    body: "Pago",
    responses: {
      200: "Pago actualizado con exito",
      404: "La reserva no existe",
      500: ERROR_500,
    },
  },
  "delete /booking/{id}": {
    summary: "Eliminar una reserva",
    description: "Los asientos de la reserva se devuelven al viaje.",
    responses: {
      200: "Reserva eliminada con exito",
      404: "La reserva con este id no existe",
      500: ERROR_500,
    },
  },
};

const resultado = await swaggerAutogen()(outputFile, endpointsFiles, doc);

if (resultado && resultado.data) {
  const data = resultado.data;
  for (const ruta of Object.keys(data.paths)) {
    // swagger-autogen confunde prisma.x.delete({ where... }) con una ruta, la quitamos
    if (ruta.includes("{{")) {
      delete data.paths[ruta];
      continue;
    }
    const prefijo = Object.keys(tagsPorPrefijo).find((p) => ruta.startsWith(p));
    for (const [metodo, endpoint] of Object.entries<any>(data.paths[ruta])) {
      if (prefijo) endpoint.tags = [tagsPorPrefijo[prefijo]];
      const info = endpoints[`${metodo} ${ruta}`];
      if (!info) {
        console.warn(`falta documentar: ${metodo.toUpperCase()} ${ruta}`);
        continue;
      }
      endpoint.summary = info.summary;
      if (info.description) endpoint.description = info.description;
      for (const param of endpoint.parameters ?? []) {
        if (param.in === "path" && param.name === "id") {
          param.type = "integer";
          param.description = "id del registro";
        }
        if (param.in === "body" && info.body) {
          param.description = "datos a enviar";
          param.schema = { $ref: `#/definitions/${info.body}` };
        }
      }
      endpoint.responses = Object.fromEntries(
        Object.entries(info.responses).map(([codigo, descripcion]) => [
          codigo,
          { description: descripcion },
        ]),
      );
    }
  }
  fs.writeFileSync(
    new URL("./swagger-output.json", import.meta.url),
    JSON.stringify(data, null, 2),
  );
  console.log("swagger-output.json generado con exito :D");
}
