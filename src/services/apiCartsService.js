import { cartsModel } from "../models/index.js";
import { CartDTO } from "../models/DTOs/cartDTO.js";
import ApiProductsService from "./apiProductsService.js";
import ValidateDataService from "./validateDataService.js";

const apiProductsService = new ApiProductsService();
const validateDataService = new ValidateDataService();

class ApiCartsService {
  constructor() {
    this.cartsModel = cartsModel;
  }

  getCartsResume = async () =>
    (await this.cartsModel.getAll()).map(cart => ({
      cartId: cart.id,
      cartUser: cart.username,
      timestamp: cart.timestamp
    }));

  getUserCart = async user => {
    const username = user.provider ? user.emails[0].value : user.username;
    const userCart = await this.cartsModel.getByUsername(username);
    return userCart
      ? { cartId: userCart.id, products: userCart.products }
      : userCart;
  };

  getProductsFromCart = async id => {
    const cart = await this.cartsModel.getById(id);
    return cart ? cart.products : cart;
  };

  createCart = async user => {
    const username = user.provider ? user.emails[0].value : user.username;
    const newCart = { username, products: [] };
    const validatedCart = validateDataService.validateCart(newCart, true);
    if (validatedCart && !validatedCart.error)
      return await this.cartsModel.save(new CartDTO(validatedCart));
    throw new Error(validatedCart.error);
  };

  addProductToCart = async (id, id_prod, quantity) => {
    const cart = await this.cartsModel.getById(id);
    if (cart === null) return { error: "Carrito no encontrado", status: 404 };
    const product = await apiProductsService.getProduct(id_prod);
    if (product === null)
      return { error: "Producto no encontrado", status: 404 };
    const { products } = cart;
    let index = products.findIndex(item => item.product.id == id_prod);
    const { stock } = product;
    if (index === -1 && quantity <= stock) {
      products.push({ product, quantity });
    } else if (index !== -1 && products[index].quantity + quantity <= stock) {
      products[index].product = product; //actualiza posible cambio de precio, etc
      products[index].quantity += quantity;
    } else {
      return {
        error: "La cantidad total agregada no puede superar al stock",
        stock,
        status: 400
      };
    }
    const dataToUpdate = { products };
    const validatedData = validateDataService.validateCart(dataToUpdate, false);
    if (validatedData && !validatedData.error)
      return await this.cartsModel.updateById(id, new CartDTO(validatedData));
    throw new Error(validatedData.error);
  };

  updateProductFromCart = async (id, id_prod, quantity) => {
    const cart = await this.cartsModel.getById(id);
    if (cart === null) return { error: "Carrito no encontrado", status: 404 };
    const { products } = cart;
    let index = products.findIndex(item => item.product.id == id_prod);
    if (index === -1) {
      return { error: "Producto no encontrado", status: 404 };
    } else {
      const product = await apiProductsService.getProduct(id_prod);
      const { stock } = product;
      if (quantity > stock)
        return {
          error: "La cantidad no puede superar al stock",
          stock,
          status: 400
        };
      products[index].product = product; //actualiza posible cambio de precio, etc
      products[index].quantity = quantity;
    }
    const dataToUpdate = { products };
    const validatedData = validateDataService.validateCart(dataToUpdate, false);
    if (validatedData && !validatedData.error)
      return await this.cartsModel.updateById(id, new CartDTO(validatedData));
    throw new Error(validatedData.error);
  };

  deleteCart = async id => await this.cartsModel.deleteById(id);

  deleteProductFromCart = async (id, id_prod) => {
    const cart = await this.cartsModel.getById(id);
    if (cart === null) return { error: "Carrito no encontrado", status: 404 };
    const { products } = cart;
    let index = products.findIndex(item => item.product.id == id_prod);
    if (index === -1) {
      return { error: "Producto no encontrado", status: 404 };
    } else {
      products.splice(index, 1);
    }
    const dataToUpdate = { products };
    const validatedData = validateDataService.validateCart(dataToUpdate, false);
    if (validatedData && !validatedData.error)
      return await this.cartsModel.updateById(id, new CartDTO(validatedData));
    throw new Error(validatedData.error);
  };

  validateProductsFromCart = async cartItems => {
    try {
      let invalidStock = false;
      let invalidPrice = false;
      const validItems = [];
      for (const item of cartItems) {
        const { id, price: cartPrice } = item.product;
        const { quantity } = item;
        const actualizedProduct = await apiProductsService.getProduct(id);
        const { stock, price } = actualizedProduct;
        if (price !== cartPrice) invalidPrice = true;
        if (quantity > stock) {
          invalidStock = true;
          stock > 0
            ? validItems.push({ product: actualizedProduct, quantity: stock })
            : null;
        } else {
          validItems.push({ product: actualizedProduct, quantity });
        }
      }
      if (!invalidPrice && !invalidStock) return { result: "ok", validItems };
      return { result: "invalid", validItems };
    } catch (error) {
      throw new Error(`Error al validar los productos del carrito: ${error}`);
    }
  };
}

export default ApiCartsService;
