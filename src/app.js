import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import productsRouter from "./routes/apiProductsRouter.js";
import cartsRouter from "./routes/apiCartsRouter.js";
import webServerRouter from "./routes/webServerRouter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// configuración motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middlewares para parsear el body del request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// routers
app.use(webServerRouter);
app.use("/api/productos", productsRouter);
app.use("/api/carrito", cartsRouter);

// error 404 API
app.use("/api", (req, res, next) => {
  // logger.warn(
  //   `ruta '${req.baseUrl + req.path}' método '${req.method}' no implementada`
  // );
  res.status(404).json({
    error: -2,
    descripcion: `ruta '${req.baseUrl + req.path}' método '${
      req.method
    }' no implementada`
  });
});

// error 404 WEB
app.use((req, res, next) => {
  // logger.warn(
  //   `ruta '${req.baseUrl + req.path}' método '${req.method}' no implementada`
  // );
  res.sendFile("404.html", {
    root: path.join(__dirname, "views")
  });
});

export default app;
