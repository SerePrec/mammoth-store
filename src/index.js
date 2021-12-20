import { Server as Httpserver } from "http";
import { Server as IoServer } from "socket.io";
import config from "./config.js";
import app from "./app.js";
import sockets from "./sockets.js";

const PORT = config.PORT;

async function startServer() {
  if (process.env.PERS === "fs") {
    //Inicializo mi "storage"
    try {
      const { productsModel, cartsModel, messagesModel } = await import(
        "./models/index.js"
      );
      await productsModel.init();
      await cartsModel.init();
      await messagesModel.init();
    } catch (error) {
      console.log(error);
    }
  }
  //Instancio servidor http y websocket
  const httpServer = new Httpserver(app);
  const io = new IoServer(httpServer);
  //Configuro el servidor websocket
  sockets(io);

  //Puesta en marcha del servidor
  httpServer
    .listen(PORT, () =>
      console.log(
        `Servidor http con websockets escuchando en el puerto ${
          httpServer.address().port
        }`
      )
    )
    .on("error", error =>
      console.log(`Ocurrió un error en el servidor:\n ${error}`)
    );
}

startServer();
