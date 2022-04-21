import { productsModel } from "../models/index.js";
import { ProductDTO } from "../models/DTOs/productDTO.js";

class ApiProductsService {
  constructor() {
    this.productsModel = productsModel;
  }

  getAllProducts = async () => await this.productsModel.getAll();

  getProduct = async id => await this.productsModel.getById(id);

  getProductsByCategory = async category =>
    await this.productsModel.getAll({ category });

  createProduct = async newProductData => {
    const productDTO = new ProductDTO(newProductData);
    return await this.productsModel.save(productDTO);
  };

  updateProduct = async (id, dataToUpdate) => {
    const productDTO = new ProductDTO(dataToUpdate);
    return await this.productsModel.updateById(id, productDTO);
  };

  deleteProduct = async id => await this.productsModel.deleteById(id);
}

export default ApiProductsService;
