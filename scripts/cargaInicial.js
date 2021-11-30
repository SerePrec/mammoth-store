import ContenedorFS from "../src/models/ContenedorFS.js";

async function cargaInicial() {
  try {
    // Instancio e inicializo el contenedor productos
    const productos = new ContenedorFS("productos.json");
    await productos.init();

    //Guardo 5 elementos en productos
    const idA = await productos.save({
      title: "Escuadra",
      price: 123.45,
      thumbnail:
        "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"
    });
    console.log("idA: ", idA);
    const idB = await productos.save({
      title: "Calculadora",
      price: 234.56,
      thumbnail:
        "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png"
    });
    console.log("idB: ", idB);
    const idC = await productos.save({
      title: "Globo Terráqueo",
      price: 345.67,
      thumbnail:
        "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png"
    });
    console.log("idC: ", idC);
    const idD = await productos.save({
      title: "Microscopio",
      price: 9723.29,
      thumbnail:
        "https://cdn3.iconfinder.com/data/icons/education-science-vol-2-1/512/microscope_bacteria_virus_science-256.png"
    });
    console.log("idD: ", idD);
    const idE = await productos.save({
      title: "Telescopio refractor",
      price: 13295.43,
      thumbnail:
        "https://cdn3.iconfinder.com/data/icons/education-science-vol-2-1/512/astronomy_telescope_moon_education-256.png"
    });
    console.log("idE: ", idE);

    //Listo todos sus elementos
    console.log("\n\n***********************************");
    const all = await productos.getAll();
    console.log("Listado de todos los productos: \n", all);
  } catch (error) {
    console.log("Error durante el test: ", error);
  }
}

cargaInicial();
