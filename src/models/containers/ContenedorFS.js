import * as fs from "fs/promises";
import path from "path";
import config from "../../config.js";

const dbDir = config.fileSystemDb.path;

class ContenedorFS {
  constructor(filename = "testDB.json") {
    this.path = path.join(dbDir, filename);
    this.nextId = null;
  }

  //Inicializo el contenedor con archivo preexistente o nuevo
  async init() {
    console.log("Inicializando contenedor...");
    try {
      if (this.nextId) return; // evita se inicialice más de una vez
      try {
        const content = await this.getAll();
        const lastId = content.reduce(
          (acc, cur) => (cur.id > acc ? cur.id : acc),
          0
        );
        this.nextId = lastId + 1;
        console.log(
          `Contenedor inicializado con archivo preexistente '${path.basename(
            this.path
          )}'`
        );
      } catch (error) {
        await fs.writeFile(this.path, JSON.stringify([]));
        this.nextId = 1;
        console.log(
          `Contenedor inicializado vacío '${path.basename(this.path)}'`
        );
      }
    } catch (error) {
      throw new Error(`Error al inicializar: ${error}`);
    }
  }

  //Obtengo todos los elementos
  async getAll() {
    try {
      const content = await fs.readFile(this.path, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`No se pudo recuperar archivo de datos: ${error}`);
    }
  }

  //Obtengo un elemento por su id
  async getById(id) {
    try {
      id = parseInt(id);
      const content = await this.getAll();
      const match = content.find(elem => elem.id === id);
      return match ? match : null;
    } catch (error) {
      throw new Error(`Error al obtener el elemento con id '${id}': ${error}`);
    }
  }

  //Guardo el elemento
  async save(data) {
    try {
      const id = this.nextId;
      const timestamp = Date.now();
      const elemento = { id, timestamp, ...data };
      const content = await this.getAll();
      content.push(elemento);
      await fs.writeFile(this.path, JSON.stringify(content, null, 2));
      this.nextId++;
      console.log("Elemento guardado con éxito");
      return elemento;
    } catch (error) {
      throw new Error(`Error al guardar el elemento: ${error}`);
    }
  }

  //actualizo un elemento por su id
  async updateById(id, data) {
    try {
      id = parseInt(id);
      const content = await this.getAll();
      const match = content.find(elem => elem.id === id);
      if (match) {
        for (const key in data) {
          if (data[key] === undefined || data[key] === "")
            data[key] = match[key];
        }
        const newElement = { ...match, ...data };
        const newContent = content.map(elem =>
          elem.id !== id ? elem : newElement
        );
        await fs.writeFile(this.path, JSON.stringify(newContent, null, 2));
        console.log(`El elemento con id: ${id} se actualizó con éxito`);
        return newElement;
      } else {
        console.log(`No se encontró el elemento con el id: ${id}`);
        return null;
      }
    } catch (error) {
      throw new Error(
        `Error al actualizar el elemento con id '${id}': ${error}`
      );
    }
  }

  //borro todos los elementos
  async deleteAll() {
    try {
      await fs.writeFile(this.path, JSON.stringify([]));
      console.log("Todos los elementos borrados con éxito");
      return true;
    } catch (error) {
      throw new Error(`Error al borrar todos los elementos: ${error}`);
    }
  }

  //borro un elemento por su id
  async deleteById(id) {
    try {
      id = parseInt(id);
      const content = await this.getAll();
      const match = content.find(elem => elem.id === id);
      if (match) {
        const newContent = content.filter(elem => elem.id !== id);
        await fs.writeFile(this.path, JSON.stringify(newContent, null, 2));
        console.log(`El elemento con id: ${id} se eliminó con éxito`);
        return id;
      } else {
        console.log(`No se encontró el elemento con el id: ${id}`);
        return null;
      }
    } catch (error) {
      throw new Error(`Error al borrar el elemento con id '${id}': ${error}`);
    }
  }
}

export default ContenedorFS;
