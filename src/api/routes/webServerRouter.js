import { Router } from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { isAdmin } from "../middlewares/auth.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const viewsPath = path.join(__dirname, "..", "..", "views");

const router = Router();

router.get("/productos", isAdmin, (req, res) => {
  res.sendFile("productos.html", { root: viewsPath });
});
router.get("/carritos", (req, res) => {
  res.sendFile("carritos.html", { root: viewsPath });
});
router.get("/chat/:email?", (req, res) => {
  const { email } = req.params;
  if (email) {
    res.render("pages/chat-user", { title: `Mensajes ${email}`, email });
  } else {
    res.sendFile("chat.html", { root: viewsPath });
  }
});
router.get("/chat-admin", isAdmin, (req, res) => {
  res.render("pages/chat-admin", { title: "Administrador de mensajes" });
});

export default router;
