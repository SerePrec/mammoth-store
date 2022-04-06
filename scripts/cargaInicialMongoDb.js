import * as fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import BaseDAOMongoDB from "../src/models/baseDAOs/baseDAOMongoDB.js";
import { productSchema } from "../src/models/DAOs/products/productsDAOMongoDB.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BK_FILENAME = "productsBk.json";
const COLLECTION = "productos";

// eslint-disable-next-line no-unused-vars
async function cargaInicial() {
  try {
    // Instancio e inicializo el contenedor productos
    const productosModel = new BaseDAOMongoDB(COLLECTION, productSchema);

    // Obtengo los datos de un archivo de datos
    const content = await fs.readFile(
      path.join(__dirname, "..", "src", "utils", BK_FILENAME),
      "utf-8"
    );
    const productsBk = JSON.parse(content);

    //Guardo todos los elementos
    for (const element of productsBk) {
      const { id } = await productosModel.save(element);
      console.log(`Elemento con id: '${id}' guardado con éxito`);
    }

    //Listo todos sus elementos
    console.log("\n\n***********************************");
    const all = await productosModel.getAll();
    console.log("Listado de todos los productos: \n", all);
  } catch (error) {
    console.error("Error durante la carga: ", error);
  } finally {
    mongoose.disconnect();
  }
}

//cargaInicial();

// Recordar definir la variable de entorno PERS como mongodb o mongodb_atlas
// según se quieran cargar los datos en la base local o en Cloud
