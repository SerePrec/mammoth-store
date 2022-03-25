import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import config from "../../config.js";
import { logger } from "../../logger/index.js";

const serviceAccount = config.firebase;
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

class ContenedorFirebase {
  constructor(collectionName) {
    this.collection = db.collection(collectionName);
  }

  //No tiene funcionalidad pero es para mantener las mismas interfaces
  async init() {}

  //Obtengo todos los elementos
  async getAll() {
    try {
      const elements = [];
      //Ordeno por fecha de creación (timestamp) más que nada para los mensajes
      const snapshot = await this.collection.orderBy("timestamp").get();
      snapshot.forEach(doc =>
        elements.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })
      );
      return elements;
    } catch (error) {
      throw new Error(`No se pudo recuperar los datos: ${error}`);
    }
  }

  //Obtengo un elemento por su id
  async getById(id) {
    try {
      const doc = await this.collection.doc(`${id}`).get();
      return doc.exists
        ? { id, ...doc.data(), timestamp: doc.data().timestamp.toDate() }
        : null;
    } catch (error) {
      throw new Error(`Error al obtener el elemento con id '${id}': ${error}`);
    }
  }

  //Guardo el elemento
  async save(data) {
    try {
      const timestamp = Timestamp.now();
      data = { ...data, timestamp };
      const saved = await this.collection.add(data);
      logger.debug("Elemento guardado con éxito");
      return { ...data, id: saved.id, timestamp: timestamp.toDate() };
    } catch (error) {
      throw new Error(`Error al guardar el elemento: ${error}`);
    }
  }

  //actualizo un elemento por su id
  async updateById(id, data) {
    try {
      const dataToUpdate = {};
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== "")
          dataToUpdate[key] = data[key];
      }
      await this.collection.doc(`${id}`).update(dataToUpdate);
      logger.debug(`El elemento con id: ${id} se actualizó con éxito`);
      // lo consulto para obtener los datos completos del elemento actualizado
      return await this.getById(id);
    } catch (error) {
      // firestore arroja un error de código 5 si no encuentra el documento para actualizar
      // Manejo esta opción para mantener el formato de respuesta
      //similar al resto de contenedores
      if (error.code === 5) {
        logger.debug(`No se encontró el elemento con el id: ${id}`);
        return null;
      }
      throw new Error(
        `Error al actualizar el elemento con id '${id}': ${error}`
      );
    }
  }

  //borro todos los elementos
  async deleteAll() {
    async function deleteQueryBatch(db, query) {
      const snapshot = await query.get();

      const batchSize = snapshot.size;
      if (batchSize === 0) {
        // Cuando no quedan más documentos, termina
        return;
      }

      // Borra documentos por lote (batch)
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      // Espera al siguiente process tick, para evitar
      // explotar el stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query);
      });
    }

    const batchSize = 100;
    const collectionRef = this.collection;
    const query = collectionRef.limit(batchSize);

    try {
      await deleteQueryBatch(db, query);
      logger.debug("Todos los elementos borrados con éxito");
      return true;
    } catch (error) {
      throw new Error(`Error al borrar todos los elementos: ${error}`);
    }
  }

  //borro un elemento por su id
  async deleteById(id) {
    try {
      // para mantener el mismo formato de respuesta que el resto
      // de los contenedores primero verifico que el documento exista
      // porque en la res del delete no obtengo infomación si existía o no
      const doc = this.getById(id);
      if (!doc) {
        logger.debug(`No se encontró el elemento con el id: ${id}`);
        return null;
      }
      await this.collection.doc(`${id}`).delete();
      logger.debug(`El elemento con id: ${id} se eliminó con éxito`);
      return id;
    } catch (error) {
      throw new Error(`Error al borrar el elemento con id '${id}': ${error}`);
    }
  }
}

export default ContenedorFirebase;
