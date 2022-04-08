import mongoose from "mongoose";
import config from "../../config.js";
import { logger } from "../../logger/index.js";

// CONEXIÓN A BASE DE DATOS. PERSISTENCIA MONGODB
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
  constructor(collection, schema, DTO) {
    this.CollModel = mongoose.model(collection, schema);
    this.DTO = DTO;
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
      return elements.map(element => new this.DTO(element));
    } catch (error) {
      throw new Error(`No se pudo recuperar los datos: ${error}`);
    }
  }

  //Obtengo un elemento por su id
  async getById(id) {
    // mongoose parsea el id internamente en la consulta. Puede recibirlo tipo string y lo pasa a ObjectId.  No es necesario transformar
    try {
      // Evito el comportamiento de arrojar error si el id no es de formato válido y por ende no exitiría
      if (!mongoose.isValidObjectId(id)) return null;
      let element = await this.CollModel.findOne({ _id: id }, { __v: 0 });
      return element ? new this.DTO(element) : null;
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
      return new this.DTO(element);
    } catch (error) {
      throw new Error(`Error al guardar el elemento: ${error}`);
    }
  }

  //actualizo un elemento por su id
  async updateById(id, data) {
    try {
      // Evito el comportamiento de arrojar error si el id no es de formato válido y por ende no exitiría
      if (!mongoose.isValidObjectId(id)) return null;
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
        logger.debug(`El elemento con id: ${id} se actualizó con éxito`);
        return new this.DTO(updateElement);
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
      // Evito el comportamiento de arrojar error si el id no es de formato válido y por ende no exitiría
      if (!mongoose.isValidObjectId(id)) return null;
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
