import { cartsModel, ordersModel } from "../models/index.js";
import { OrderDTO } from "../models/DTOs/orderDTO.js";
import ValidateDataService from "./validateDataService.js";
import { sendEmail, renderOrderTable } from "../email/nodemailer-gmail.js";
import { sendSMS, sendWSP } from "../messaging/twilio-sms.js";
import config from "../config.js";

const validateDataService = new ValidateDataService();

class ApiOrdersService {
  constructor() {
    this.cartsModel = cartsModel;
    this.ordersModel = ordersModel;
  }

  getUserOrders = async user => {
    const username = user.provider ? user.emails[0].value : user.username;
    return await this.ordersModel.getByUsername(username);
  };

  createOrder = async (user, data) => {
    const username = user.provider ? user.emails[0].value : user.username;
    const { id: cartId, name, address, phone, cp } = data;
    const { products } = await this.cartsModel.getById(cartId);
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
    const validatedOrder = validateDataService.validateOrder(newOrder, true);
    if (validatedOrder && !validatedOrder.error) {
      const { number, id, timestamp } = await this.ordersModel.save(
        new OrderDTO(validatedOrder)
      );
      await this.cartsModel.deleteById(cartId);

      // Envío de mails,sms y wsp asíncrono en paralelo y segundo plano (sin await)
      const adminSubject = `Nuevo pedido de ${name} <${username}>`;
      const userSubject = `Mammoth Bike Store - Recibimos tu pedido`;
      sendEmail(
        config.email.adminEmail,
        adminSubject,
        renderOrderTable({ ...validatedOrder, number, timestamp }, "admin")
      );
      sendEmail(
        username,
        userSubject,
        renderOrderTable({ ...validatedOrder, number, timestamp }, "user")
      );
      sendSMS(
        phone,
        `Tu pedido fue recibido y se encuentra en proceso - Mammoth Bike Store`
      );
      sendWSP(config.twilio.adminWsp, adminSubject);

      return { id, number, username };
    }
    throw new Error(validatedOrder.error);
  };
}

export default ApiOrdersService;
