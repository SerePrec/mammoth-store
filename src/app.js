import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import productosRouter from "./api/routes/productosRouter.js";
import carritoRouter from "./api/routes/carritoRouter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/productos", productosRouter);
app.use("/api/carrito", carritoRouter);

// error 404
app.use((req, res, next) => {
  res.status(404).json({
    error: -2,
    descripcion: `ruta '${req.baseUrl + req.path}' método '${
      req.method
    }' no implementada`
  });
});

export default app;
