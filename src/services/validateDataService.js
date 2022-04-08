import { Message } from "../models/entities/Message.js";
import { Product } from "../models/entities/Product.js";
import { User } from "../models/entities/User.js";
import { escapeHtml } from "../utils/dataTools.js";

class ValidateDataService {
  // Valida que sea un id numérico
  // validateId = id => {
  //   if (!((typeof id == "string" || typeof id == "number") && /^\w+$/.test(id)))
  //     return { error: "El parámetro no es válido" };
  //   else return true;
  // };

  //Valida que el formato de datos a guardar sea válido
  // validatePostProductBody = data => {
  //   const validProduct = Product.validate(data, true);
  //   return validProduct
  //     ? validProduct
  //     : { error: "El formato de datos o los valores enviados no son válidos" };
  // };

  //Valida que el formato de datos a actualizar sea válido
  // validatePutProductBody = data => {
  //   const validData = Product.validate(data);
  //   if (!validData)
  //     return {
  //       error: "El formato de datos o los valores enviados no son válidos"
  //     };
  //   else if (Object.keys(validData)?.length === 0)
  //     return {
  //       error: "No hay campos válidos para actualizar"
  //     };
  //   else {
  //     return validData;
  //   }
  // };

  // Valida que sea un formato de usuario válido para guardar en la BD
  validateRegisterPost = data => {
    const validUser = User.validate(data, true);
    if (validUser) {
      validUser.username = escapeHtml(validUser.username);
      validUser.name = escapeHtml(validUser.name);
      validUser.address = escapeHtml(validUser.address);
      return validUser;
    }
    return false;
  };

  // Valida que sea un formato de mensaje válido para guardar en la BD
  // validateMessage = data => {
  //   const validMessage = Message.validate(data, true);
  //   return validMessage
  //     ? validMessage
  //     : { error: "El formato de datos o los valores enviados no son válidos" };
  // };
}

export default ValidateDataService;
