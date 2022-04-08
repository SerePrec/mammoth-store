import MessagesService from "./services/messagesService.js";
import { logger } from "./logger/index.js";

const messagesService = new MessagesService();

//Configuración de sockets
export default io => {
  io.on("connection", async socket => {
    const socketId = socket.id;

    // Muestro la cantidad de usuarios conectados a una instancia del servidor con cada conexión
    logger.debug(
      `Cliente socket conectado con el id: ${socketId} ** Conexiones websocket activas: ${io.engine.clientsCount} **`
    );

    //Obtiene listado de mensajes con cada conexión entrante y lo envía al socket
    try {
      const messages = await messagesService.getAll();
      socket.emit("allMessages", messages);
    } catch (error) {
      logger.error(error);
      socket.emit("messageErrors", "No se pudo recuperar archivo de mensajes");
    }

    //Escucha el evento de un nuevo mensaje enviado
    socket.on("newMessage", async message => {
      try {
        message.type = "user";
        message.replyMessage = null;
        await messagesService.save(message);
        const messages = await messagesService.getAll();
        io.sockets.emit("allMessages", messages);
      } catch (error) {
        logger.error(error);
        socket.emit("messageErrors", "Error al procesar el mensaje enviado");
      }
    });

    //Escucha el evento de un nuevo mensaje del administrador
    socket.on("adminMessage", async message => {
      try {
        message.type = "admin";
        await messagesService.save(message);
        const messages = await messagesService.getAll();
        io.sockets.emit("allMessages", messages);
      } catch (error) {
        logger.error(error);
        socket.emit("messageErrors", "Error al procesar el mensaje enviado");
      }
    });

    // Actualizo la cantidad de usuarios conectados a una instancia del servidor con cada desconexión
    socket.on("disconnect", () => {
      logger.debug(
        `** Conexiones websocket activas: ${io.engine.clientsCount} **`
      );
    });
  });

  //Cambié a esta forma de actualizar los usuarios conectados para ser compatible con el modo cluster. Así cada x seg cada servidor worker envía los usuarios que tiene conectados y en el front se procesa el conjunto de infomación
  setInterval(() => {
    io.sockets.emit("usersCount", io.engine.clientsCount);
  }, 3000);
};
