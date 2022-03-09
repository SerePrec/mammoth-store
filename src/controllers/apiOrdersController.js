import { cartsModel, ordersModel } from "../models/index.js";
import { sendEmail, renderOrderTable } from "../email/nodemailer-gmail.js";
import { sendSMS, sendWSP } from "../messaging/twilio-sms.js";
import config from "../config.js";
import { logger } from "../logger/index.js";

// export const getOrders = async (req, res) => {};

// export const getOrdersById = async (req, res) => {};

export const getUserOrders = async (req, res) => {
  try {
    const { user } = req;
    const username = user.provider ? user.emails[0].value : user.username;
    const userOrders = await ordersModel.getByUsername(username);
    res.json(userOrders);
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: "No se pudo recuperar la infomación"
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { user } = req;
    const username = user.provider ? user.emails[0].value : user.username;
    const { id: cartId, name, address, phone, cp } = req.body;
    const { products } = await cartsModel.getById(cartId);
    const total = products.reduce(
      (total, item) => (total += item.product.price * item.quantity),
      0
    );
    const newOrder = {
      username,
      name,
      address,
      phone,
      cp,
      products,
      total,
      status: "generada"
    };
    const { number, id, timestamp } = await ordersModel.save(newOrder);
    await cartsModel.deleteById(cartId);
    req.session ? (req.session.cartId = null) : null;
    logger.info(`Orden de usuario '${username}' creada con id ${id}`);

    // Envío de mails,sms y wsp asíncrono en paralelo y segundo plano (sin await)
    const adminSubject = `Nuevo pedido de ${name} <${username}>`;
    const userSubject = `Mammoth Bike Store - Recibimos tu pedido`;
    // sendEmail(
    //   config.email.adminEmail,
    //   adminSubject,
    //   renderOrderTable({ ...newOrder, number, timestamp }, "admin")
    // );
    // sendEmail(
    //   username,
    //   userSubject,
    //   renderOrderTable({ ...newOrder, number, timestamp }, "user")
    // );
    // sendSMS(
    //   phone,
    //   `Tu pedido fue recibido y se encuentra en proceso - Mammoth Bike Store`
    // );
    // sendWSP(config.twilio.adminWsp, adminSubject);

    res.json({ result: "ok", orderId: id, orderNumber: number });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      error: "No se pudo crear la orden"
    });
  }
};
