import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  PORT: process.env.PORT || 8080,
  uploadsImg: {
    path: path.join(__dirname, "public", "img", "productos")
  },
  fileSystemDb: {
    path: path.join(__dirname, "..", "DB"),
    messagesFile: "mensajes.json",
    productsFile: "productos.json",
    cartsFile: "carritos.json"
  }
  // mariaDb: {
  //   client: "mysql",
  //   connection: {
  //     host: "localhost",
  //     user: "coderhouse",
  //     password: "coderhouse",
  //     database: "coderhouse"
  //   }
  // },
  // sqlite3: {
  //   client: "sqlite3",
  //   connection: {
  //     filename: `./DB/ecommerce.sqlite`
  //   },
  //   useNullAsDefault: true
  // }
};

export default config;
