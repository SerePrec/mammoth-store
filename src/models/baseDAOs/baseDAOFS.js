import * as fs from "fs/promises";
import path from "path";
import config from "../../config.js";
import { logger } from "../../logger/index.js";

const dbDir = config.fileSystemDb.path;

class BaseDAOFS {
  constructor(filename = "testDB.json", DTO) {
    this.path = path.join(dbDir, filename);
    this.nextId = null;
    this.DTO = DTO;
  }

  //Inicializo el contenedor con archivo preexistente o nuevo
  async init() {
    logger.debug("Inicializando DAO...");
    try {
      if (this.nextId) return; // evita se inicialice más de una vez
      try {
        const content = await this.getAll();
        const lastId = content.reduce(
          (acc, cur) => (cur.id > acc ? cur.id : acc),
          0
        );
        this.nextId = lastId + 1;
        logger.debug(
          `DAO inicializado con archivo preexistente '${path.basename(
            this.path
          )}'`
        );
      } catch (error) {
        await fs.writeFile(this.path, JSON.stringify([]));
        this.nextId = 1;
        logger.debug(`DAO inicializado vacío '${path.basename(this.path)}'`);
      }
    } catch (error) {
      throw new Error(`Error al inicializar: ${error}`);
    }
  }

  //Obtengo todos los elementos
  async getAll(conditions = {}) {
    try {
      const content = await fs.readFile(this.path, "utf-8");
      let elements = JSON.parse(content);
      for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined) {
          elements = elements.filter(element => element[key] == value);
        }
      }
      return elements.map(element => new this.DTO(element));
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
      return match ? new this.DTO(match) : null;
    } catch (error) {
      throw new Error(`Error al obtener el elemento con id '${id}': ${error}`);
    }
  }

  //Guardo el elemento
  async save(data) {
    try {
      const id = this.nextId;
      const timestamp = new Date().toISOString();
      const element = { ...data, id, timestamp };
      const content = await this.getAll();
      content.push(element);
      await fs.writeFile(this.path, JSON.stringify(content, null, 2));
      this.nextId++;
      logger.debug("Elemento guardado con éxito");
      return new this.DTO(element);
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
        logger.debug(`El elemento con id: ${id} se actualizó con éxito`);
        return new this.DTO(newElement);
      } else {
        logger.debug(`No se encontró el elemento con el id: ${id}`);
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
      logger.debug("Todos los elementos borrados con éxito");
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
        logger.debug(`El elemento con id: ${id} se eliminó con éxito`);
        return id;
      } else {
        logger.debug(`No se encontró el elemento con el id: ${id}`);
        return null;
      }
    } catch (error) {
      throw new Error(`Error al borrar el elemento con id '${id}': ${error}`);
    }
  }
}

export default BaseDAOFS;
