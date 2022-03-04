import * as fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import ContenedorFirebase from "../src/models/containers/ContenedorFirebase.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BK_FILENAME = "productsBk.json";
const COLLECTION = "products";

// eslint-disable-next-line no-unused-vars
async function cargaInicial() {
  try {
    // Instancio e inicializo el contenedor productos
    const productosModel = new ContenedorFirebase(COLLECTION);

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
  }
}

// cargaInicial();
