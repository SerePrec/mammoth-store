import mongoose from "mongoose";
import config from "../../config.js";
import { deepClone, renameField, removeField } from "../../utils/dataTools.js";

try {
  await mongoose.connect(
    config.mongodb.connectionString,
    config.mongodb.options
  );
  console.log("Conectado con MongoDB");
} catch (error) {
  console.log(`Error al conectar con MongoDb: ${error}`);
}

class ContenedorMongoDB {
  constructor(collection, schema) {
    this.CollModel = mongoose.model(collection, schema);
  }

  //Obtengo todos los elementos
  async getAll() {
    try {
      //uso lean para devolver los objetos como POJO y mejorar la velocidad de las consultas
      let elements = await this.CollModel.find({}, { __v: 0 }).lean();
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
      console.log("Elemento guardado con éxito");
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
        console.log(`El elemento con id: ${id} se actualizó con éxito`);
        return deepClone(updateElement);
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
      await this.CollModel.deleteMany({});
      console.log("Todos los elementos borrados con éxito");
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

export default ContenedorMongoDB;
