import { cartsModel, productsModel } from "../models/index.js";

export const getCarts = async (req, res) => {
  try {
    const cartsIds = (await cartsModel.getAll()).map(cart => cart.id);
    res.json(cartsIds);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo recuperar la infomación"
    });
  }
};

export const createCart = async (req, res) => {
  try {
    const { id } = await cartsModel.save();
    res.json({ result: "ok", cartId: id });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo crear el carrito"
    });
  }
};

export const deleteCart = async (req, res) => {
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
};

export const getProductsFromCart = async (req, res) => {
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
};

export const addProductToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: id_prod, quantity } = req.body;
    const cart = await cartsModel.getById(id);
    if (cart === null) return res.json({ error: "Carrito no encontrado" });
    const product = await productsModel.getById(id_prod);
    if (product === null) return res.json({ error: "Producto no encontrado" });
    const { products } = cart;
    let index = products.findIndex(item => item.product.id === id_prod);
    const { stock } = product;
    if (index === -1 && quantity <= stock) {
      products.push({ product, quantity });
    } else if (index !== -1 && products[index].quantity + quantity <= stock) {
      products[index].product = product; //TODO:actualiza posible cambio de precio, etc
      products[index].quantity += quantity;
    } else {
      return res.json({
        error: "La cantidad total agregada no puede superar al stock",
        stock
      });
    }
    await cartsModel.updateById(id, { products });
    res.json({ result: "ok", addedProdId: id_prod, quantity });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `No se pudo agregar el producto al carrito`
    });
  }
};

export const updateProductFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: id_prod, quantity } = req.body;
    const cart = await cartsModel.getById(id);
    if (cart === null) return res.json({ error: "Carrito no encontrado" });
    const { products } = cart;
    let index = products.findIndex(item => item.product.id === id_prod);
    if (index === -1) {
      return res.json({ error: "Producto no encontrado" });
    } else {
      const product = await productsModel.getById(id_prod);
      const { stock } = product;
      if (quantity > stock)
        return res.json({
          error: "La cantidad no puede superar al stock",
          stock
        });
      products[index].product = product; //TODO: actualiza posible cambio de precio, etc
      products[index].quantity = quantity;
    }
    await cartsModel.updateById(id, { products });
    res.json({ result: "ok", updatedProdId: id_prod, quantity });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `No se pudo modificar la cantidad del producto en el carrito`
    });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { id, id_prod } = req.params;
    const cart = await cartsModel.getById(id);
    if (cart === null) return res.json({ error: "Carrito no encontrado" });
    const { products } = cart;
    let index = products.findIndex(item => item.product.id == id_prod);
    if (index === -1) {
      return res.json({ error: "Producto no encontrado" });
    } else {
      products.splice(index, 1);
    }
    await cartsModel.updateById(id, { products });
    res.json({ result: "ok", deletedProdId: id_prod });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: `No se pudo eliminar el producto del carrito`
    });
  }
};
