import { describe, it, before, after } from "mocha";
import request from "supertest";
import chai from "chai";
import ValidateDataService from "../services/validateDataService.js";
import * as generator from "../utils/generator.js";

const expect = chai.expect;
const validateDataService = new ValidateDataService();
const req = request("http://localhost:8080");

// >>>> Estado del servidor
// Como no es el objetivo de esta suite de tests, se desactivaron las
// validaciones de autenticación y roles de usuario en las rutas /api/productos

//////////////////////////////////////////////
// TEST A LOS ENDPOINTS DE LA API PRODUCTOS //
//////////////////////////////////////////////
describe("API productos", function () {
  describe("GET /api/productos", function () {
    it("debería retornar un status 200", async function () {
      let res = await req.get("/api/productos");
      expect(res.status).to.equal(200);
    });

    it("debería devolver el listado de productos", async function () {
      let res = await req.get("/api/productos");
      const products = res.body;
      expect(products).to.be.an("array");
      if (products?.length > 0) {
        products.forEach(product => {
          expect(product).to.be.an("object");
          expect(product).to.have.all.keys(
            "id",
            "title",
            "detail",
            "brand",
            "code",
            "category",
            "price",
            "stock",
            "thumbnail",
            "timestamp"
          );
        });
      }
    });
  });

  describe("GET /api/productos/:id", function () {
    before(async function () {
      const newProductData = generator.get();
      let res = await req.post("/api/productos").send(newProductData);
      this.productId = res.body.newProduct.id;
    });

    after(async function () {
      await req.delete(`/api/productos/${this.productId}`);
    });

    it("debería retornar un status 200 y devolver el producto si existe el id", async function () {
      const res = await req.get(`/api/productos/${this.productId}`);
      expect(res.status).to.equal(200);
      const product = res.body;
      expect(product).to.be.an("object");
      expect(product).to.have.all.keys(
        "id",
        "title",
        "detail",
        "brand",
        "code",
        "category",
        "price",
        "stock",
        "thumbnail",
        "timestamp"
      );
    });

    it("debería retornar un status 404 en caso de no existir el id", async function () {
      const fakeProductId = "aaaaaaaaaaaaaaaaaaaaaaaa"; //uso este formato "compatible" con MongoDB y que no arroje error interno
      const res = await req.get(`/api/productos/${fakeProductId}`);
      expect(res.status).to.equal(404);
      const { error } = res.body;
      expect(error).to.equal("Producto no encontrado");
    });
  });

  describe("POST /api/productos", function () {
    after(async function () {
      await req.delete(`/api/productos/${this.productId}`);
    });

    it("debería retornar un status 201 e incorporar el producto", async function () {
      const newProductData = generator.get();
      let res = await req.post("/api/productos").send(newProductData);
      expect(res.status).to.equal(201);
      const { result, newProduct } = res.body;
      this.productId = newProduct.id;

      expect(result).to.equal("ok");
      expect(newProduct).to.be.an("object");
      const processedData =
        validateDataService.validateProductPostBody(newProductData);
      expect(newProduct)
        .to.include(processedData)
        .and.to.have.all.keys("id", "timestamp");
    });

    it("debería retornar un status 400 al mandar estructura de datos inválida", async function () {
      const invalidData = { title: "producto sin precio ni thumbnail" };
      let res = await req.post("/api/productos").send(invalidData);
      expect(res.status).to.equal(400);
      const { error } = res.body;
      expect(error).to.equal(
        "El formato de datos o los valores enviados no son válidos"
      );
    });
  });

  describe("PUT /api/productos/:id", function () {
    before(async function () {
      const newProductData = generator.get();
      let res = await req.post("/api/productos").send(newProductData);
      const { newProduct } = res.body;
      this.newProduct = newProduct;
    });

    after(async function () {
      await req.delete(`/api/productos/${this.newProduct.id}`);
    });

    it("debería retornar un status 200 y modificar el producto", async function () {
      const dataToUpdate = { title: "Producto Modificado" };
      const res = await req
        .put(`/api/productos/${this.newProduct.id}`)
        .send(dataToUpdate);
      expect(res.status).to.equal(200);
      const { result, updatedProduct } = res.body;
      expect(result).to.equal("ok");
      expect(updatedProduct).to.be.an("object");
      const processedData =
        validateDataService.validateProductPutBody(dataToUpdate);
      expect(updatedProduct).to.deep.equal({
        ...this.newProduct,
        ...processedData
      });
    });

    it("debería retornar un status 400 al mandar estructura de datos inválida", async function () {
      const invalidData = { price: "no es un formato de precio" };
      const res = await req
        .put(`/api/productos/${this.newProduct.id}`)
        .send(invalidData);
      expect(res.status).to.equal(400);
      const { error } = res.body;
      expect(error).to.equal(
        "El formato de datos o los valores enviados no son válidos"
      );
    });

    it("debería retornar un status 400 al mandar estructura de datos vacía", async function () {
      const emptyData = {};
      const res = await req
        .put(`/api/productos/${this.newProduct.id}`)
        .send(emptyData);
      expect(res.status).to.equal(400);
      const { error } = res.body;
      expect(error).to.equal("No hay campos válidos para actualizar");
    });

    it("debería retornar un status 404 en caso de no existir el id", async function () {
      const dataToUpdate = { price: 123 };
      const fakeProductId = "aaaaaaaaaaaaaaaaaaaaaaaa"; //uso este formato "compatible" con MongoDB y que no arroje error interno
      const res = await req
        .put(`/api/productos/${fakeProductId}`)
        .send(dataToUpdate);
      expect(res.status).to.equal(404);
      const { error } = res.body;
      expect(error).to.equal("Producto no encontrado");
    });
  });

  describe("DELETE /api/productos/:id", function () {
    before(async function () {
      const newProductData = generator.get();
      let res = await req.post("/api/productos").send(newProductData);
      this.productId = res.body.newProduct.id;
    });

    after(async function () {
      await req.delete(`/api/productos/${this.productId}`);
    });

    it("debería retornar un status 200 y devolver el id del producto borrado si existe", async function () {
      const res = await req.delete(`/api/productos/${this.productId}`);
      expect(res.status).to.equal(200);
      const { result, deletedId } = res.body;
      expect(result).to.equal("ok");
      expect(deletedId).to.equal(this.productId);
    });

    it("debería retornar un status 404 en caso de no existir el id", async function () {
      const fakeProductId = "aaaaaaaaaaaaaaaaaaaaaaaa"; //uso este formato "compatible" con MongoDB y que no arroje error interno
      const res = await req.delete(`/api/productos/${fakeProductId}`);
      expect(res.status).to.equal(404);
      const { error } = res.body;
      expect(error).to.equal("Producto no encontrado");
    });
  });
});

//////////////////////////////////////////////
///// TEST FUNCIONAL DE LA API PRODUCTOS /////
//////////////////////////////////////////////
describe("Test funcional", function () {
  after(async function () {
    await req.delete(`/api/productos/${this.productA.id}`);
    await req.delete(`/api/productos/${this.productB.id}`);
  });

  it("debería listar todos los productos", async function () {
    let res = await req.get("/api/productos");
    expect(res.status).to.equal(200);
    const products = res.body;
    expect(products).to.be.an("array");
    this.products = products;

    if (products?.length > 0) {
      products.forEach(product => {
        expect(product).to.be.an("object");
        expect(product).to.have.all.keys(
          "id",
          "title",
          "detail",
          "brand",
          "code",
          "category",
          "price",
          "stock",
          "thumbnail",
          "timestamp"
        );
      });
    }
  });

  it("debería incorporar dos productos", async function () {
    const newProductDataA = generator.get();
    let res = await req.post("/api/productos").send(newProductDataA);
    expect(res.status).to.equal(201);
    let { result, newProduct } = res.body;
    expect(result).to.equal("ok");
    const newProductA = newProduct;
    this.productA = newProductA;

    const newProductDataB = generator.get();
    res = await req.post("/api/productos").send(newProductDataB);
    expect(res.status).to.equal(201);
    result = res.body.result;
    newProduct = res.body.newProduct;
    expect(result).to.equal("ok");
    const newProductB = newProduct;
    this.productB = newProductB;

    res = await req.get("/api/productos");
    const actualList = res.body;
    expect(actualList).to.have.lengthOf(this.products.length + 2);
    expect(actualList).to.have.deep.members([
      ...this.products,
      newProductA,
      newProductB
    ]);
  });

  it("debería devolver el producto B", async function () {
    const res = await req.get(`/api/productos/${this.productB.id}`);
    expect(res.status).to.equal(200);
    const product = res.body;
    expect(product).to.deep.equal(this.productB);
  });

  it("debería modificar el producto B", async function () {
    const dataToUpdate = { title: "Producto B Modificado", price: "123" };
    let res = await req
      .put(`/api/productos/${this.productB.id}`)
      .send(dataToUpdate);
    expect(res.status).to.equal(200);
    const { result } = res.body;
    expect(result).to.equal("ok");

    res = await req.get(`/api/productos/${this.productB.id}`);
    const updatedProductB = res.body;
    expect(updatedProductB.title).to.deep.equal("Producto B Modificado");
    expect(updatedProductB.price).to.deep.equal(123);
    expect(updatedProductB.thumbnail).to.deep.equal(this.productB.thumbnail);
  });

  it("debería eliminar el producto B", async function () {
    let res = await req.delete(`/api/productos/${this.productB.id}`);
    expect(res.status).to.equal(200);
    const { result, deletedId } = res.body;
    expect(result).to.equal("ok");
    expect(deletedId).to.equal(this.productB.id);

    res = await req.get("/api/productos");
    const actualList = res.body;
    expect(actualList).to.have.lengthOf(this.products.length + 1);
    expect(actualList).to.have.deep.members([...this.products, this.productA]);
  });
});
