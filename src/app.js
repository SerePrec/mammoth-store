import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import { swaggerSpecs, swaggerUiOptions } from "./swagger/swagger.js";
import config from "./config.js";
import { isAuthApi } from "./middlewares/auth.js";
import { multerErrorHandler } from "./middlewares/multer.js";
import { passport } from "./middlewares/passport.js";
import ApiCartsRouter from "./routes/apiCartsRouter.js";
import ApiOrdersRouter from "./routes/apiOrdersRouter.js";
import ApiProductsRouter from "./routes/apiProductsRouter.js";
import AuthRouter from "./routes/authRouter.js";
import WebServerRouter from "./routes/webServerRouter.js";
import Error404Controller from "./controllers/error404Controller.js";

const apiCartsRouter = new ApiCartsRouter();
const apiOrdersRouter = new ApiOrdersRouter();
const apiProductsRouter = new ApiProductsRouter();
const authRouter = new AuthRouter();
const webServerRouter = new WebServerRouter();
const error404Controller = new Error404Controller();

const app = express();

// configuración motor de plantillas
app.set("view engine", "ejs");
app.set("views", config.viewsPath);

// middleware morgan (se monta sólo en ambiente de desarrollo)
if (config.NODE_ENV === "development") {
  const { morganLogger } = await import("./middlewares/morgan.js");
  app.use(morganLogger);
}

// middlewares para parsear el body del request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// compresión de respuestas
app.use(compression());

// servir archivos estáticos
app.use(express.static(config.staticsPath));

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
app.use(authRouter.start());
app.use(webServerRouter.start());
app.use("/api/carritos", isAuthApi, apiCartsRouter.start());
app.use("/api/ordenes", isAuthApi, apiOrdersRouter.start());
app.use("/api/productos", isAuthApi, apiProductsRouter.start());

// swagger API docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, swaggerUiOptions)
);

// error 404 API
app.use("/api", error404Controller.getError404Api);

// error 404 WEB
app.use(error404Controller.getError404Web);

// error handler Multer
app.use(multerErrorHandler);

export default app;
