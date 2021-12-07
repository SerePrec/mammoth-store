import * as fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import ContenedorFS from "../src/models/ContenedorFS.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BK_FILENAME = "productsBk.json";
const OUTPUT_FILENAME = "productos.json";

async function cargaInicial() {
  try {
    // Instancio e inicializo el contenedor productos
    const productos = new ContenedorFS(OUTPUT_FILENAME);
    await productos.init();

    // Obtengo los datos de un archivo de datos
    const content = await fs.readFile(
      path.join(__dirname, "..", "src", "utils", BK_FILENAME),
      "utf-8"
    );
    const productsBk = JSON.parse(content);

    //Guardo todos los elementos
    for (const element of productsBk) {
      const id = await productos.save(element);
      console.log(`Elemento con id: '${id}' guardado con éxito`);
    }

    //Listo todos sus elementos
    console.log("\n\n***********************************");
    const all = await productos.getAll();
    console.log("Listado de todos los productos: \n", all);
  } catch (error) {
    console.log("Error durante la carga: ", error);
  }
}

cargaInicial();
