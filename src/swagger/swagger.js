import swaggerJsdoc from "swagger-jsdoc";

const swaggerJsdocOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mammoth Bike Store API",
      description:
        "API REST desarrollada para interactuar con la tienda Mammoth",
      version: "1.0.0",
      contact: { email: "prellezose@gmail.com" },
      license: { name: "MIT" }
    },
    servers: [
      {
        description: "Mammoth Bike Store",
        url: "https://mammoth-store.herokuapp.com/api"
      }
    ]
  },
  apis: ["./docs/**/*.yaml"]
};

const swaggerSpecs = swaggerJsdoc(swaggerJsdocOptions);

const swaggerUiOptions = {
  swaggerOptions: { supportedSubmitMethods: [] } // para deshabilitar los try it out
};

export { swaggerSpecs, swaggerUiOptions };
