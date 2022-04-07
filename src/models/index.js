import CartsDAOFactory from "./DAOs/carts/cartsDAOFactory.js";
import MessagesDAOFactory from "./DAOs/messages/messagesDAOFactory.js";
import OrdersDAOFactory from "./DAOs/orders/ordersDAOFactory.js";
import ProductsDAOFactory from "./DAOs/products/productsDAOFactory.js";
import UsersDAOFactory from "./DAOs/users/usersDAOFactory.js";
import config from "../config.js";
import { logger } from "../logger/index.js";

const PERS = config.PERS;

//Obtengo los DAOs (Models) de sus Fatories
const cartsModel = await CartsDAOFactory.get(PERS);
const messagesModel = await MessagesDAOFactory.get(PERS);
const ordersModel = await OrdersDAOFactory.get(PERS);
const productsModel = await ProductsDAOFactory.get(PERS);
const usersModel = await UsersDAOFactory.get(PERS);

//Inicializo los Models
try {
  await cartsModel.init();
  await messagesModel.init();
  await ordersModel.init();
  await productsModel.init();
  await usersModel.init();
  logger.info(`Persistencia [${config.PERS}] inicializada`);
} catch (error) {
  logger.error(error);
  process.exit(1);
}

export { cartsModel, messagesModel, ordersModel, productsModel, usersModel };
