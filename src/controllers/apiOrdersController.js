import { cartsModel, ordersModel, productsModel } from "../models/index.js";
import { logger } from "../logger/index.js";

// export const getCarts = async (req, res) => {
//   try {
//     const cartsIds = (await cartsModel.getAll()).map(cart => ({
//       cartId: cart.id,
//       cartUser: cart.username,
//       timestamp: cart.timestamp
//     }));
//     res.json(cartsIds);
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({
//       error: "No se pudo recuperar la infomación"
//     });
//   }
// };

// export const getUserCart = async (req, res) => {
//   try {
//     const { user } = req;
//     const username = user.provider ? user.emails[0].value : user.username;
//     const userCart = await cartsModel.getByUsername(username);
//     if (userCart) {
//       req.session ? (req.session.cartId = userCart.id) : null;
//       res.json({ cartId: userCart.id, products: userCart.products });
//     } else {
//       res.json({ error: "Carrito no encontrado" });
//     }
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({
//       error: "No se pudo recuperar la infomación"
//     });
//   }
// };

export const createOrder = async (req, res) => {
  try {
    const { user } = req;
    const username = user.provider ? user.emails[0].value : user.username;
    const { id: cartId, name, address, phone, cp } = req.body;
    const { products } = await cartsModel.getById(cartId);
    const newOrder = {
      username,
      name,
      address,
      phone,
      cp,
      products
    };
    const { number, id } = await ordersModel.save(newOrder);
    await cartsModel.deleteById(cartId);
    req.session ? (req.session.cartId = null) : null;
    logger.info(`Orden de usuario '${username}' creada con id ${id}`);
    res.json({ result: "ok", orderId: id, orderNumber: number });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: "No se pudo crear la orden"
    });
  }
};

// export const deleteCart = async (req, res) => {
//   try {
//     const deletedId = await cartsModel.deleteById(req.params.id);
//     req.session ? (req.session.cartId = null) : null;
//     if (deletedId !== null) {
//       logger.debug(`Carrito con id ${req.params.id}} eliminado`);
//       res.json({ result: "ok", deletedId });
//     } else {
//       res.json({ error: "Carrito no encontrado" });
//     }
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({
//       error: "No se pudo eliminar el carrito"
//     });
//   }
// };
