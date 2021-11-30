import { productosModel, messagesModel } from "./models/index.js";

//Configuración de sockets
export default io => {
  io.on("connection", async socket => {
    console.log(
      `Cliente socket conectado con el id: ${socket.id}\n** Conexiones websocket activas: ${io.engine.clientsCount} **`
    );

    //Obtiene listado de productos con cada conexión entrante y lo envía al socket
    try {
      const list = await productosModel.getAll();
      socket.emit("allProducts", list);
    } catch (error) {
      console.log(error);
      socket.emit("tableErrors", "No se pudo recuperar archivo de productos");
    }

    io.sockets.emit("usersCount", io.engine.clientsCount);

    //Obtiene listado de mensajes con cada conexión entrante y lo envía al socket
    try {
      const messages = await messagesModel.getAll();
      socket.emit("allMessages", messages);
    } catch (error) {
      console.log(error);
      socket.emit("messageErrors", "No se pudo recuperar archivo de mensajes");
    }

    socket.on("loadProduct", async product => {
      try {
        const newProduct = validateLoadData(product);
        if (newProduct) {
          await productosModel.save(newProduct);
          const list = await productosModel.getAll();
          io.sockets.emit("allProducts", list);
        }
      } catch (error) {
        console.log(error);
        socket.emit("tableErrors", "No se pudo agregar el producto");
      }
    });

    socket.on("newMessage", async message => {
      try {
        const fyh = new Date().toLocaleString();
        const newMessage = { ...message, fyh };
        await messagesModel.save(newMessage);
        const messages = await messagesModel.getAll();
        io.sockets.emit("allMessages", messages);
      } catch (error) {
        console.log(error);
        socket.emit("messageErrors", "Error al procesar el mensaje enviado");
      }
    });

    socket.on("disconnect", () => {
      console.log(
        `** Conexiones websocket activas: ${io.engine.clientsCount} **`
      );
      io.sockets.emit("usersCount", io.engine.clientsCount);
    });

    //Valida los datos del producto que se va a cargar
    function validateLoadData(data) {
      let { title, price, thumbnail } = data;
      if (
        !(typeof title == "string" && /\w+/.test(title)) ||
        !(
          (typeof price == "string" || typeof price == "number") &&
          /^\d+(\.\d+)?$/.test(price)
        ) ||
        !(
          typeof thumbnail == "string" &&
          /^(ftp|http|https):\/\/[^ "]+$/.test(thumbnail)
        )
      ) {
        socket.emit("tableErrors", "Los valores enviados no son válidos");
        return false;
      } else {
        title = title.trim();
        price = Math.round(parseFloat(price) * 100) / 100;
        thumbnail = thumbnail.trim();
        return { title, price, thumbnail };
      }
    }
  });
};
