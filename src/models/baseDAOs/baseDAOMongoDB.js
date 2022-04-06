import mongoose from "mongoose";
import config from "../../config.js";
import { deepClone, renameField, removeField } from "../../utils/dataTools.js";
import { logger } from "../../logger/index.js";

try {
  switch (config.PERS) {
    case "mongodb_atlas":
      await mongoose.connect(
        config.mongoDbAtlas.connectionString,
        config.mongoDbAtlas.options
      );
      logger.info("Conectado con MongoDB Atlas");
      break;

    case "mongodb":
    default:
      await mongoose.connect(
        config.mongoDb.connectionString,
        config.mongoDb.options
      );
      logger.info("Conectado con MongoDB (localhost)");
      break;
  }
  mongoose.connection.on("disconnected", () =>
    logger.error("MongoDB perdió conexión")
  );
} catch (error) {
  logger.error(`Error al conectar con MongoDb: ${error}`);
  process.exit(1);
}

class BaseDAOMongoDB {
  constructor(collection, schema) {
    this.CollModel = mongoose.model(collection, schema);
  }

  //No tiene funcionalidad pero es para mantener las mismas interfaces
  async init() {}

  //Obtengo todos los elementos
  async getAll() {
    try {
      //uso lean para devolver los objetos como POJO y mejorar la velocidad de las consultas
      let elements = await this.CollModel.find({}, { __v: 0 })
        .sort({ _id: 1 })
        .lean();
      elements = deepClone(elements);
      elements.forEach(element => renameField(element, "_id", "id"));
      return elements;
    } catch (error) {
      throw new Error(`No se pudo recuperar los datos: ${error}`);
    }
  }

  //Obtengo un elemento por su id
  async getById(id) {
    // mongoose parsea el id internamente en la consulta. Puede recibirlo tipo string y lo pasa a ObjectId.  No es necesario transformar
    try {
      let element = await this.CollModel.findOne({ _id: id }, { __v: 0 });
      return element ? renameField(deepClone(element), "_id", "id") : null;
    } catch (error) {
      throw new Error(`Error al obtener el elemento con id '${id}': ${error}`);
    }
  }

  //Guardo el elemento
  async save(data) {
    try {
      // El manejo del id y el timestamp se maneja internamente desde base de datos
      let element = await this.CollModel.create(data);
      logger.debug("Elemento guardado con éxito");
      element = deepClone(element);
      renameField(element, "_id", "id");
      removeField(element, "__v");
      return element;
    } catch (error) {
      throw new Error(`Error al guardar el elemento: ${error}`);
    }
  }

  //actualizo un elemento por su id
  async updateById(id, data) {
    try {
      // mongoose parsea el id internamente en la consulta.
      const dataToUpdate = {};
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== "")
          dataToUpdate[key] = data[key];
      }
      let updateElement = await this.CollModel.findOneAndUpdate(
        { _id: id },
        { $set: dataToUpdate },
        { returnOriginal: false, projection: { __v: 0 } }
      );
      if (updateElement) {
        updateElement = renameField(updateElement, "_id", "id");
        logger.debug(`El elemento con id: ${id} se actualizó con éxito`);
        return deepClone(updateElement);
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
      await this.CollModel.deleteMany({});
      logger.debug("Todos los elementos borrados con éxito");
      return true;
    } catch (error) {
      throw new Error(`Error al borrar todos los elementos: ${error}`);
    }
  }

  //borro un elemento por su id
  async deleteById(id) {
    try {
      // mongoose parsea el id internamente en la consulta.
      const deleted = await this.CollModel.findOneAndDelete({ _id: id });
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

export default BaseDAOMongoDB;
