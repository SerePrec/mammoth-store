import { Router } from "express";
import { productsModel } from "../../models/index.js";

const router = Router();

router.get("/productos", async (req, res) => {
  try {
    const list = await productsModel.getAll();
    res.render("pages/listaProductos", { title: "Productos Cargados", list });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo recuperar la infomación"
    });
  }
});

export default router;
