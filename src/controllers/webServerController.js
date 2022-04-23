import InfoService from "../services/infoService.js";
import config from "../config.js";

class WebServerController {
  constructor() {
    this.infoService = new InfoService();
  }

  getProducts = (req, res) => {
    const { user } = req;
    const { messages } = req.session;
    let message;
    if (messages) {
      req.session.messages = [];
      message = messages[messages.length - 1];
    }
    res.render("pages/productos", {
      title: "Mammoth Bike Store | Productos",
      username: user.provider ? user.emails[0].value : user.username,
      avatar: user.provider ? user.photos[0].value : user.avatar,
      successRegister: message
    });
  };

  getProductDetail = (req, res) => {
    const { id } = req.params;
    const { user } = req;
    res.render("pages/producto-detalle", {
      title: "Mammoth Bike Store | Detalle Del Producto",
      username: user.provider ? user.emails[0].value : user.username,
      avatar: user.provider ? user.photos[0].value : user.avatar,
      id
    });
  };

  getProductsByCategory = (req, res, next) => {
    const { user } = req;
    const { cat } = req.params;
    if (config.shopCategories.includes(cat)) {
      const catTitle = cat[0].toUpperCase() + cat.slice(1);
      res.render("pages/productos-categoria", {
        title: `Mammoth Bike Store | ${catTitle}`,
        username: user.provider ? user.emails[0].value : user.username,
        avatar: user.provider ? user.photos[0].value : user.avatar,
        category: cat
      });
    } else {
      next();
    }
  };

  getAdminProducts = (req, res) => {
    res.sendFile("productos-admin.html", { root: config.viewsPath });
  };

  getCart = (req, res) => {
    const { user } = req;
    res.render("pages/carrito", {
      title: "Mammoth Bike Store | Carrito",
      username: user.provider ? user.emails[0].value : user.username,
      avatar: user.provider ? user.photos[0].value : user.avatar
    });
  };

  getAdminCarts = (req, res) => {
    res.sendFile("carritos-admin.html", { root: config.viewsPath });
  };

  getMyAccount = (req, res) => {
    const { user } = req;
    res.render("pages/miCuenta", {
      title: "Mammoth Bike Store | Mi Cuenta",
      username: user.provider ? user.emails[0].value : user.username,
      name: user.provider ? user.displayName : user.name,
      address: user.provider ? "N/D" : user.address,
      phone: user.provider ? "N/D" : user.phone,
      age: user.provider ? "N/D" : user.age,
      avatar: user.provider ? user.photos[0].value : user.avatar
    });
  };

  getUsersChat = (req, res) => {
    const { email } = req.params;
    const { user } = req;
    const options = {
      title: `Mammoth Bike Store | Chat`,
      username: user.provider ? user.emails[0].value : user.username,
      avatar: user.provider ? user.photos[0].value : user.avatar
    };
    if (email) {
      res.render("pages/chat-user", options);
    } else {
      res.render("pages/chat", options);
    }
  };

  getAdminChat = (req, res) => {
    res.render("pages/chat-admin", { title: "Administrador de mensajes" });
  };

  getAdminOrders = (req, res) => {
    res.sendFile("ordenes-admin.html", { root: config.viewsPath });
  };

  getCheckout = (req, res) => {
    const { user } = req;
    res.render("pages/checkout", {
      title: "Mammoth Bike Store | Checkout",
      username: user.provider ? user.emails[0].value : user.username,
      name: user.provider ? user.displayName : user.name,
      address: user.provider ? "" : user.address,
      phone: user.provider ? "" : user.phone,
      avatar: user.provider ? user.photos[0].value : user.avatar
    });
  };

  getCheckoutOk = (req, res) => {
    const { user } = req;
    res.render("pages/checkout-ok", {
      title: "Mammoth Bike Store | Compra Exitosa",
      username: user.provider ? user.emails[0].value : user.username,
      avatar: user.provider ? user.photos[0].value : user.avatar
    });
  };

  getCheckoutError = (req, res) => {
    const { user } = req;
    res.render("pages/checkout-error", {
      title: "Mammoth Bike Store | Error de checkout",
      username: user.provider ? user.emails[0].value : user.username,
      avatar: user.provider ? user.photos[0].value : user.avatar
    });
  };

  getServerConfig = (req, res) => {
    const info = {
      title: "Mammoth Bike Store | Server Config",
      ...this.infoService.getServerInfo()
    };
    res.render("./pages/serverConfig", info);
  };
}

export default WebServerController;
