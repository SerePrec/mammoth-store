import { Router } from "express";
import { productosModel } from "../models/index.js";
import { validatePostBody } from "../middelwares/validateData.js";

const router = Router();

router.get("/productos", async (req, res) => {
  try {
    const list = await productosModel.getAll();
    res.render("pages/listaProductos", { title: "Productos Cargados", list });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo recuperar la infomación"
    });
  }
});
router.post("/productos", validatePostBody, async (req, res) => {
  try {
    let { title, price, thumbnail } = req.body;
    let newProduct = { title, price, thumbnail };
    await productosModel.save(newProduct);
    res.redirect("/productos");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo agregar el producto"
    });
  }
});

export default router;
