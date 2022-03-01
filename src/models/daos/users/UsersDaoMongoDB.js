import mongoose from "mongoose";
import ContenedorMongoDB from "../../containers/ContenedorMongoDB.js";
import { deepClone, renameField } from "../../../utils/dataTools.js";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  age: { type: Number, required: true, min: 18, max: 120 },
  phone: { type: String, required: true },
  avatar: { type: String, required: true },
  role: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

class UsersDaoMongoDB extends ContenedorMongoDB {
  constructor() {
    super("User", userSchema);
  }

  async getByUsername(username) {
    try {
      let user = await this.CollModel.findOne({ username }, { __v: 0 });
      return user ? renameField(deepClone(user), "_id", "id") : null;
    } catch (error) {
      throw new Error(
        `Error al obtener el usuario con username '${username}': ${error}`
      );
    }
  }
}

export default UsersDaoMongoDB;
