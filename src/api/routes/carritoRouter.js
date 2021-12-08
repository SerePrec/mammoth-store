import { Router } from "express";
import { cartsModel, productsModel } from "../../models/index.js";
import {
  validateNumericId,
  validateCartProductBody
} from "../middlewares/validateData.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const cartsIds = (await cartsModel.getAll()).map(cart => cart.id);
    res.json(cartsIds);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo recuperar la infomación"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { id } = await cartsModel.save();
    res.json({ result: "ok", cartId: id });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo crear el carrito"
    });
  }
});

router.delete("/:id", validateNumericId, async (req, res) => {
  try {
    const deletedId = await cartsModel.deleteById(req.params.id);
    deletedId !== null
      ? res.json({ result: "ok", deletedId })
      : res.json({ error: "Carrito no encontrado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo eliminar el carrito"
    });
  }
});

router.get("/:id/productos", validateNumericId, async (req, res) => {
  try {
    const cart = await cartsModel.getById(req.params.id);
    cart !== null
      ? res.json(cart.products)
      : res.json({ error: "Carrito no encontrado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo recuperar la infomación"
    });
  }
});

router.post(
  "/:id/productos",
  validateNumericId,
  validateCartProductBody,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { id: prodId, quantity } = req.body;
      const cart = await cartsModel.getById(id);
      if (cart === null) return res.json({ error: "Carrito no encontrado" });
      const product = await productsModel.getById(prodId);
      if (product === null)
        return res.json({ error: "Producto no encontrado" });
      const { products } = cart;
      let index = products.findIndex(item => item.product.id === prodId);
      const { stock } = product;
      if (index === -1 && quantity <= stock) {
        products.push({ product, quantity });
      } else if (index !== -1 && products[index].quantity + quantity <= stock) {
        products[index].quantity += quantity;
      } else {
        return res.json({
          error: "La cantidad no puede superar al stock",
          stock
        });
      }
      await cartsModel.updateById(id, { products });
      res.json({ result: "ok", addedProdId: prodId, quantity });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: `No se pudo agregar el producto al carrito`
      });
    }
  }
);

router.put(
  "/:id/productos",
  validateNumericId,
  validateCartProductBody,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { id: prodId, quantity } = req.body;
      const cart = await cartsModel.getById(id);
      if (cart === null) return res.json({ error: "Carrito no encontrado" });
      const { products } = cart;
      let index = products.findIndex(item => item.product.id === prodId);
      if (index === -1) {
        return res.json({ error: "Producto no encontrado" });
      } else {
        const { stock } = await productsModel.getById(prodId);
        if (quantity > stock)
          return res.json({
            error: "La cantidad no puede superar al stock",
            stock
          });
        products[index].quantity = quantity;
      }
      await cartsModel.updateById(id, { products });
      res.json({ result: "ok", updatedProdId: prodId, quantity });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: `No se pudo modificar la cantidad del producto en el carrito`
      });
    }
  }
);

// router.get(
//   "/:id?",
//   async (req, res, next) => {
//     if (req.params.id !== undefined) return next();
//     try {
//       const lista = await productosModel.getAll();
//       res.json(lista);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         error: "No se pudo recuperar la infomación"
//       });
//     }
//   },
//   validateNumericId,
//   async (req, res) => {
//     try {
//       const producto = await productosModel.getById(req.params.id);
//       producto !== null
//         ? res.json(producto)
//         : res.json({ error: "Producto no encontrado" });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         error: "No se pudo recuperar la infomación"
//       });
//     }
//   }
// );

// router.post("/", isAdmin, validateProductPostBody, async (req, res) => {
//   try {
//     let { title, detail, code, brand, category, price, stock, thumbnail } =
//       req.body;
//     let newProduct = {
//       title,
//       detail,
//       code,
//       brand,
//       category,
//       price,
//       stock,
//       thumbnail
//     };
//     newProduct = await productosModel.save(newProduct);
//     res.json({ result: "ok", newProduct });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       error: "No se pudo agregar el producto"
//     });
//   }
// });

// router.put("/:id", isAdmin, validateNumericId, validateProductPutBody, async (req, res) => {
//   try {
//     const { title, detail, code, brand, category, price, stock, thumbnail } =
//       req.body;
//     const { id } = req.params;
//     let updateProduct = {
//       title,
//       detail,
//       code,
//       brand,
//       category,
//       price,
//       stock,
//       thumbnail
//     };
//     updateProduct = await productosModel.updateById(id, updateProduct);
//     updateProduct !== null
//       ? res.json({ result: "ok", updateProduct })
//       : res.json({ error: "Producto no encontrado" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       error: "No se pudo actualizar el producto"
//     });
//   }
// });

// router.delete("/:id", isAdmin, validateNumericId, async (req, res) => {
//   try {
//     const deletedId = await productosModel.deleteById(req.params.id);
//     deletedId !== null
//       ? res.json({ result: "ok", deletedId })
//       : res.json({ error: "Producto no encontrado" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       error: "No se pudo eliminar el producto"
//     });
//   }
// });

export default router;
