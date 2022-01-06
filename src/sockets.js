import { messagesModel } from "./models/index.js";
import { escapeHtml } from "./utils/messageTools.js";

//Configuración de sockets
export default io => {
  io.on("connection", async socket => {
    const socketId = socket.id;
    let now = new Date().toLocaleTimeString();
    console.log(
      `[${now}] Cliente socket conectado con el id: ${socketId}\n** Conexiones websocket activas: ${io.engine.clientsCount} **`
    );

    // Envio a todos los sockets la cantidad de usuarios conectados con cada conexión
    io.sockets.emit("usersCount", io.engine.clientsCount);

    //Obtiene listado de mensajes con cada conexión entrante y lo envía al socket
    try {
      const messages = await messagesModel.getAll();
      socket.emit("allMessages", messages);
    } catch (error) {
      console.log(error);
      socket.emit("messageErrors", "No se pudo recuperar archivo de mensajes");
    }

    //Escucha el evento de un nuevo mensaje enviado
    socket.on("newMessage", async message => {
      try {
        if (!message.user || !message.text.trim())
          throw new Error("Mensaje inválido");
        message.text = escapeHtml(message.text);
        message.type = "user";
        message.replyMessage = null;
        const newMessage = { ...message };
        await messagesModel.save(newMessage);
        const messages = await messagesModel.getAll();
        io.sockets.emit("allMessages", messages);
      } catch (error) {
        console.log(error);
        socket.emit("messageErrors", "Error al procesar el mensaje enviado");
      }
    });

    //Escucha el evento de un nuevo mensaje del administrador
    socket.on("adminMessage", async message => {
      try {
        if (!message.user || !message.text.trim())
          throw new Error("Mensaje inválido");
        message.text = escapeHtml(message.text);
        message.type = "admin";
        const newMessage = { ...message };
        await messagesModel.save(newMessage);
        const messages = await messagesModel.getAll();
        io.sockets.emit("allMessages", messages);
      } catch (error) {
        console.log(error);
        socket.emit("messageErrors", "Error al procesar el mensaje enviado");
      }
    });

    // Actualizo la cantidad de usuarios conectados con cada desconexión y la envío a todos los sockets
    socket.on("disconnect", () => {
      now = new Date().toLocaleTimeString();
      console.log(
        `[${now}] ** Conexiones websocket activas: ${io.engine.clientsCount} **`
      );
      io.sockets.emit("usersCount", io.engine.clientsCount);
    });
  });
};
