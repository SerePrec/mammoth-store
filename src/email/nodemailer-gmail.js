import { createTransport } from "nodemailer";
import config from "../config.js";
import { formatoPrecio } from "../utils/dataTools.js";
import { logger } from "../logger/index.js";

const transporter = createTransport(config.email.nodemailer);

const sendEmail = async (to, subject, message, attachment) => {
  try {
    const from = config.email.nodemailer.auth.user;
    const mailOptions = {
      from,
      to,
      subject,
      html: message,
      attachments: attachment
        ? [
            {
              // filename and content type is derived from path
              path: attachment
            }
          ]
        : []
    };
    const info = await transporter.sendMail(mailOptions);
    logger.debug(`Envío de email: ${JSON.stringify(info)}`);
  } catch (error) {
    logger.error(error);
  }
};

// renderiza html para los mails de registros de usuarios
const renderRegisterTable = userData => {
  const { username, name, age, address, phone, avatar } = userData;
  return `
    <h1>Nuevo usuario registrado</h1>
    </br>
    <table>
       <tbody>
        <tr>
          <td>Usuario:</td>
          <td>${username}</td>
        </tr>
        <tr>
          <td>Nombre:</td>
          <td>${name}</td>
        </tr>
        <tr>
          <td>Edad:</td>
          <td>${age}</td>
        </tr>
        <tr>
          <td>Dirección:</td>
          <td>${address}</td>
        </tr>
        <tr>
          <td>Teléfono:</td>
          <td>${phone}</td>
        </tr>
        <tr>
          <td>Avatar:</td>
          <td>${avatar}</td>
        </tr>
      </tbody>
  </table>`;
};

// renderiza html para los mails de órdenes de pedidos de usuarios
// Hace un renderizado condicional según se trate el destino un usuario o Admin
const renderOrderTable = (orderData, type) => {
  const {
    number,
    username,
    name,
    timestamp,
    address,
    cp,
    phone,
    status,
    total,
    products
  } = orderData;
  const title =
    type == "admin"
      ? "Nueva órden de pedido"
      : "¡Estamos procesando tu pedido!";
  let html = `
    <div>
      <h1>${title}</h1>
      <p><b>N°: ${number.toString().padStart(6, "0")}</b></p>
      <p><b>Fecha: </b>${new Date(timestamp).toLocaleString()}</p>
      ${type == "admin" ? `<p><b>Usuario: </b>${username}</p>` : ""}
      ${type == "admin" ? `<p><b>Nombre: </b>${name}</p>` : ""}
      <p><b>Domicilio: </b>${address}</p>
      <p><b>C.P.: </b>${cp}</p>
      <p><b>Teléfono: </b>${phone}</p>
      <p><i><b>ESTADO: </b>${status}</i></p>
      <table style="border-collapse:collapse;">`;
  if (type == "admin") {
    html += `
        <thead>
          <tr style="background-color:#d3d3d3;">
            <th>#id</th>
            <th>Producto</th>
            <th>Cant</th>
            <th>Precio</th>
          </tr>
        </thead>`;
  }
  html += `
        <tbody>`;
  for (const item of products) {
    html += `
          <tr>
            ${
              type == "admin"
                ? `<td style="border-bottom:1px solid black;padding-right:8px;"><p>${item.product.id}</p></td>`
                : ""
            }
            <td style="border-bottom:1px solid black;">
              <p>${item.product.title}</p>
            </td>
            <td style="padding:0 16px;border-bottom:1px solid black;">${
              item.quantity
            }x</td>
            <td style="border-bottom:1px solid black;text-align:right;"><b>$${formatoPrecio(
              item.product.price
            )}</b></td>
          </tr>`;
  }
  html += `
          <tr style="background-color:#add8e6;">
            <td colspan="${type == "admin" ? 3 : 2}">
              <h3>TOTAL</h3>
            </td>
            <td style="text-align:right;"><h3>$${formatoPrecio(total)}</h3></td>
          </tr>
        </tbody>
      </table>
      ${
        type != "admin"
          ? `<br><h2 style="color:#b30404;">¡Muchas gracias por tu compra!</h2>`
          : ""
      }
    </div>`;
  return html;
};

export { sendEmail, renderRegisterTable, renderOrderTable };
