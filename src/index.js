import cluster from "cluster";
import { Server as Httpserver } from "http";
import { Server as IoServer } from "socket.io";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
import config from "./config.js";

const MODE = config.MODE;

async function startServer() {
  const { default: app } = await import("./app.js");
  const { default: sockets } = await import("./sockets.js");

  const PORT = config.PORT;

  //Instancio servidor http y websocket
  const httpServer = new Httpserver(app);
  const io = new IoServer(httpServer);

  // Uso el adaptador de cluster
  MODE === "CLUSTER" && io.adapter(createAdapter());

  //Configuro el servidor websocket
  sockets(io);

  //Puesta en marcha del servidor
  httpServer
    .listen(PORT, () =>
      console.log(
        `Servidor http con websockets escuchando en el puerto ${
          httpServer.address().port
        } - PID ${process.pid}`
      )
    )
    .on("error", error => {
      console.log(`Ocurrió un error en el servidor:\n ${error}`);
      process.exit(1);
    });
}

cluster.isPrimary &&
  console.log(
    `>>>> Entorno: ${
      config.NODE_ENV === "production" ? "Producción" : "Desarrollo"
    } <<<<`
  );

MODE !== "CLUSTER" &&
  process.on("exit", code => {
    console.log("Salida del proceso con código de error: " + code);
  });

if (MODE === "CLUSTER" && cluster.isPrimary) {
  console.log(`Proceso Master iniciado con PID ${process.pid}`);
  console.log(`Número de procesadores: ${config.numCPUs}`);

  // setup conexiones entre workers
  setupPrimary();

  for (let i = 0; i < config.numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.warn(
      `Worker con PID ${worker.process.pid} terminado - signal/code:[${
        signal || code
      }]`
    );
    cluster.fork();
  });
} else startServer();
