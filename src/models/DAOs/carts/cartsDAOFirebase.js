import BaseDAOFirebase from "../../baseDAOs/baseDAOFirebase.js";
import { CartDTO } from "../../DTOs/cartDTO.js";

class CartsDAOFirebase extends BaseDAOFirebase {
  static #instance;

  constructor() {
    if (CartsDAOFirebase.#instance) {
      return CartsDAOFirebase.#instance;
    }
    super("carts", CartDTO);
    CartsDAOFirebase.#instance = this;
  }

  async save(cart = { products: [] }) {
    return super.save(cart);
  }

  //Obtengo un carrito por username
  async getByUsername(username) {
    try {
      const snapshot = await this.collection
        .where("username", "==", username)
        .orderBy("timestamp", "desc")
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      } else {
        let docs = [];
        snapshot.forEach(doc =>
          docs.push({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate()
          })
        );
        return new this.DTO(docs[0]);
      }
    } catch (error) {
      throw new Error(
        `Error al obtener el carrito con username:'${username}': ${error}`
      );
    }
  }
}

export default CartsDAOFirebase;
