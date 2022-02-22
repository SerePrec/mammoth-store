import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const viewsPath = path.join(__dirname, "..", "views");

export const getProducts = (req, res) => {
  res.render("pages/productos", { title: "Mammoth Bike Store | Productos" });
};

export const getAdminProducts = (req, res) => {
  res.sendFile("productos-admin.html", { root: viewsPath });
};

export const getCart = (req, res) => {
  res.render("pages/carrito", { title: "Mammoth Bike Store | Carrito" });
};

export const getAdminCarts = (req, res) => {
  res.sendFile("carritos-admin.html", { root: viewsPath });
};

export const getUsersChat = (req, res) => {
  const { email } = req.params;
  if (email) {
    res.render("pages/chat-user", { title: `Mensajes ${email}`, email });
  } else {
    res.sendFile("chat.html", { root: viewsPath });
  }
};

export const getAdminChat = (req, res) => {
  res.render("pages/chat-admin", { title: "Administrador de mensajes" });
};
