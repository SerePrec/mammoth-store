import { Server as Httpserver } from "http";
import { Server as IoServer } from "socket.io";
import app from "./app.js";
import sockets from "./sockets.js";

const PORT = process.env.PORT || 8080;

async function startServer() {
  //Inicializo mi "storage"
  try {
    const { productosModel } = await import("./models/productos.js");
    await productosModel.init();
  } catch (error) {
    console.log(error);
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
