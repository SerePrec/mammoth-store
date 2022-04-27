import { ordersModel } from "../models/index.js";
import { OrderDTO } from "../models/DTOs/orderDTO.js";
import ValidateDataService from "./validateDataService.js";
import ApiCartsService from "./apiCartsService.js";
import ApiProductsService from "./apiProductsService.js";
import { sendEmail, renderOrderTable } from "../email/nodemailer-gmail.js";
import { sendSMS, sendWSP } from "../messaging/twilio-sms.js";
import config from "../config.js";

const apiCartsService = new ApiCartsService();
const apiProductsService = new ApiProductsService();
const validateDataService = new ValidateDataService();

class ApiOrdersService {
  constructor() {
    this.ordersModel = ordersModel;
  }

  getOrdersResume = async () =>
    (await this.ordersModel.getAll()).map(order => ({
      id: order.id,
      number: order.number,
      username: order.username,
      total: order.total,
      status: order.status,
      timestamp: order.timestamp
    }));

  getOrder = async id => await this.ordersModel.getById(id);

  getUserOrders = async user => {
    const username = user.provider ? user.emails[0].value : user.username;
    return await this.ordersModel.getByUsername(username);
  };

  createOrder = async (user, data) => {
    const username = user.provider ? user.emails[0].value : user.username;
    const { id: cartId, name, address, phone, cp } = data;
    const products = await apiCartsService.getProductsFromCart(cartId);
    // valido los stocks y precios de los productos del carrito
    const { result, validItems } =
      await apiCartsService.validateProductsFromCart(products);
    if (result === "invalid") {
      // si no son válidos genero un carrito válido en base a la selección original
      await apiCartsService.deleteCart(cartId);
      const { id: newCartId } = await apiCartsService.createCart(user);
      for (const item of validItems) {
        await apiCartsService.addProductToCart(
          newCartId,
          item.product.id,
          item.quantity
        );
      }
      return { result, newCartId };
    } else {
      const total = validItems.reduce(
        (total, item) => (total += item.product.price * item.quantity),
        0
      );
      const newOrder = {
        username,
        name,
        address,
        phone,
        cp,
        products: validItems,
        total,
        status: "generada"
      };
      const validatedOrder = validateDataService.validateOrder(newOrder, true);
      if (validatedOrder && !validatedOrder.error) {
        // antes de generar la orden realizo el descuento del stock para evitar
        // generarla en caso de ocurrir un error en el proceso
        for (const item of validItems) {
          const { product, quantity } = item;
          await apiProductsService.discountStock(product.id, quantity);
        }
        // genero la orden y borro el carrito
        const { number, id, timestamp } = await this.ordersModel.save(
          new OrderDTO(validatedOrder)
        );
        await apiCartsService.deleteCart(cartId);

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

        return { result, id, number, username };
      }
      throw new Error(validatedOrder.error);
    }
  };

  updateOrderStatus = async (id, newStatus) => {
    return await this.ordersModel.updateById(id, new OrderDTO(newStatus));
  };
}

export default ApiOrdersService;
