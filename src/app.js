import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import config from "./config.js";
import { passport } from "./middlewares/passport.js";
import { isAuthApi } from "./middlewares/auth.js";
import authRouter from "./routes/authRouter.js";
import productsRouter from "./routes/apiProductsRouter.js";
import cartsRouter from "./routes/apiCartsRouter.js";
import webServerRouter from "./routes/webServerRouter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const mongoUrl =
  config.PERS === "mongodb"
    ? config.mongoDb.connectionString
    : config.mongoDbAtlas.connectionString;
const mongoOptions =
  config.PERS === "mongodb"
    ? config.mongoDb.advancedOptions
    : config.mongoDbAtlas.advancedOptions;

const app = express();

// configuración motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middlewares para parsear el body del request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// sesiones
app.use(
  session({
    store: MongoStore.create({ mongoUrl, mongoOptions }),
    ...config.session
  })
);

//FIXME:FIXME:
app.use((req, res, next) => {
  console.log(req.session);
  next();
});

// passport
app.use(passport.initialize());
app.use(passport.session());

// routers
app.use(authRouter);
app.use(webServerRouter);
app.use("/api/productos", productsRouter);
app.use("/api/carrito", isAuthApi, cartsRouter);

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
