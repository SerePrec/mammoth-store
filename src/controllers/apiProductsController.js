import multer from "multer";
import config from "../config.js";
import { productsModel } from "../models/index.js";

export const getAllProducts = async (req, res, next) => {
  if (req.params.id !== undefined) return next();
  try {
    const lista = await productsModel.getAll();
    res.json(lista);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo recuperar la infomación"
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const producto = await productsModel.getById(req.params.id);
    producto !== null
      ? res.json(producto)
      : res.json({ error: "Producto no encontrado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo recuperar la infomación"
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    let { title, detail, code, brand, category, price, stock, thumbnail } =
      req.body;
    let newProduct = {
      title,
      detail,
      code,
      brand,
      category,
      price,
      stock,
      thumbnail
    };
    newProduct = await productsModel.save(newProduct);
    res.json({ result: "ok", newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo agregar el producto"
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { title, detail, code, brand, category, price, stock, thumbnail } =
      req.body;
    const { id } = req.params;
    let updateProduct = {
      title,
      detail,
      code,
      brand,
      category,
      price,
      stock,
      thumbnail
    };
    updateProduct = await productsModel.updateById(id, updateProduct);
    updateProduct !== null
      ? res.json({ result: "ok", updateProduct })
      : res.json({ error: "Producto no encontrado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo actualizar el producto"
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedId = await productsModel.deleteById(req.params.id);
    deletedId !== null
      ? res.json({ result: "ok", deletedId })
      : res.json({ error: "Producto no encontrado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "No se pudo eliminar el producto"
    });
  }
};
