import Knex from "knex";
import { deepClone, verifyTimestamp } from "../../utils/dataTools.js";
import { logger } from "../../logger/index.js";

class BaseDAOSQL {
  constructor(config, table) {
    this.knex = Knex(config);
    this.table = table;
  }

  //No tiene funcionalidad pero es para mantener las mismas interfaces
  async init() {}

  //Obtengo todos los elementos
  async getAll(conditions = {}) {
    try {
      const elements = await this.knex(this.table)
        .where(conditions)
        .select("*");
      elements.forEach(element => verifyTimestamp(element));
      return deepClone(elements);
    } catch (error) {
      throw new Error(`No se pudo recuperar los datos: ${error}`);
    }
  }

  //Obtengo un elemento por su id
  async getById(id) {
    try {
      id = parseInt(id);
      const [element] = await this.knex(this.table).where({ id }).select("*");
      return element ? deepClone(verifyTimestamp(element)) : null;
    } catch (error) {
      throw new Error(`Error al obtener el elemento con id '${id}': ${error}`);
    }
  }

  //Guardo el elemento
  async save(data) {
    try {
      // El manejo del id y el timestamp se maneja internamente desde base de datos
      // data puede ser un objeto o array (usado en productsInCarts)
      const [newId] = await this.knex(this.table).insert(data);
      logger.debug("Elemento guardado con éxito");
      // Pido el elemento por si hay campos que se generan al insertar y no dispongo de ellos para devolver. Ej timestamp
      // si inserté un array no tiene sentido pedir 1 elemento. esta funcionalidad se usa internamente en instancia carrito (updateById). No se expone a la api por eso ese faltante de datos no es relevante
      let newElement;
      Array.isArray(data)
        ? (newElement = data)
        : (newElement = await this.getById(newId));
      return deepClone(newElement);
    } catch (error) {
      throw new Error(`Error al guardar el elemento: ${error}`);
    }
  }

  //actualizo un elemento por su id
  async updateById(id, data) {
    try {
      id = parseInt(id);
      const dataToUpdate = {};
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== "")
          dataToUpdate[key] = data[key];
      }
      const updated = await this.knex(this.table)
        .where({ id })
        .update(dataToUpdate);
      if (updated) {
        const updateElement = await this.getById(id);
        logger.debug(`El elemento con id: ${id} se actualizó con éxito`);
        return deepClone(verifyTimestamp(updateElement));
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
  async deleteAll(conditions = {}) {
    try {
      await this.knex(this.table).where(conditions).del();
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
      const deleted = await this.knex(this.table).where({ id }).del();
      if (deleted) {
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

export default BaseDAOSQL;
