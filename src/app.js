import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import compression from "compression";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import config from "./config.js";
import { passport } from "./middlewares/passport.js";
import { isAuthApi } from "./middlewares/auth.js";
import { multerErrorHandler } from "./middlewares/multer.js";
import authRouter from "./routes/authRouter.js";
import productsRouter from "./routes/apiProductsRouter.js";
import cartsRouter from "./routes/apiCartsRouter.js";
import ordersRouter from "./routes/apiOrdersRouter.js";
import webServerRouter from "./routes/webServerRouter.js";
import Error404Controller from "./controllers/error404Controller.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const error404Controller = new Error404Controller();

const app = express();

// configuración motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middlewares para parsear el body del request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// compresión de respuestas
app.use(compression());

// servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// sesiones
app.use(
  session({
    store: MongoStore.create(config.session.mongoStoreOptions),
    ...config.session.options
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// routers
app.use(authRouter);
app.use(webServerRouter);
app.use("/api/productos", isAuthApi, productsRouter);
app.use("/api/carrito", isAuthApi, cartsRouter);
app.use("/api/ordenes", isAuthApi, ordersRouter);

// error 404 API
app.use("/api", error404Controller.getError404Api);

// error 404 WEB
app.use(error404Controller.getError404Web);

// error handler Multer
app.use(multerErrorHandler);

export default app;
