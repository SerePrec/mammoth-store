import Knex from "knex";
// eslint-disable-next-line no-unused-vars
import config from "../src/config.js";
import * as fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line no-unused-vars
async function crearTablaProductos(config) {
  const knex = Knex(config);
  try {
    await knex.schema.dropTableIfExists("products");

    await knex.schema.createTable("products", table => {
      table.increments("id");
      table.string("title", 80).notNullable();
      table.text("detail");
      table.string("brand", 40).notNullable();
      table.string("code", 40);
      table.string("category", 40).notNullable();
      table.float("price").unsigned().notNullable();
      table.integer("stock").notNullable();
      table.string("thumbnail", 1024);
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    });

    console.log("Tabla 'products' creada con éxito");
  } catch (error) {
    console.error("Error al crear tabla 'products': ", error);
  } finally {
    knex.destroy();
  }
}

// eslint-disable-next-line no-unused-vars
async function crearTablaCarritos(config) {
  const knex = Knex(config);
  try {
    await knex.schema.dropTableIfExists("carts");

    await knex.schema.createTable("carts", table => {
      table.increments("id");
      table.string("username", 50).notNullable().index();
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    });

    console.log("Tabla 'carts' creada con éxito");
  } catch (error) {
    console.error("Error al crear tabla 'carts': ", error);
  } finally {
    knex.destroy();
  }
}

// eslint-disable-next-line no-unused-vars
async function crearTablaProductosEnCarrito(config) {
  const knex = Knex(config);
  try {
    await knex.schema.dropTableIfExists("products_in_carts");

    await knex.schema.createTable("products_in_carts", table => {
      table.integer("id_cart").unsigned().notNullable().index();
      table.integer("id").unsigned().notNullable();
      table.integer("quantity").unsigned().notNullable();
      table.string("title", 80).notNullable();
      table.text("detail");
      table.string("brand", 40).notNullable();
      table.string("code", 40);
      table.string("category", 40).notNullable();
      table.float("price").unsigned().notNullable();
      table.integer("stock").notNullable();
      table.string("thumbnail", 1024);
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    });

    console.log("Tabla 'products_in_carts' creada con éxito");
  } catch (error) {
    console.error("Error al crear tabla 'products_in_carts': ", error);
  } finally {
    knex.destroy();
  }
}

// eslint-disable-next-line no-unused-vars
async function crearTablaMensajes(config) {
  const knex = Knex(config);
  try {
    await knex.schema.dropTableIfExists("messages");

    await knex.schema.createTable("messages", table => {
      table.increments("id");
      table.string("user", 50).notNullable();
      table.string("type", 10).notNullable();
      table.text("text").notNullable();
      table.text("replyMessage");
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    });

    console.log("Tabla 'messages' creada con éxito");
  } catch (error) {
    console.error("Error al crear tabla 'messages': ", error);
  } finally {
    knex.destroy();
  }
}

// eslint-disable-next-line no-unused-vars
async function crearTablaUsuarios(config) {
  const knex = Knex(config);
  try {
    await knex.schema.dropTableIfExists("users");

    await knex.schema.createTable("users", table => {
      table.increments("id");
      table.string("username", 50).notNullable().unique();
      table.string("password", 256).notNullable();
      table.string("name", 50).notNullable();
      table.string("address", 80).notNullable();
      table.tinyint("age").unsigned().notNullable();
      table.string("phone", 20).notNullable();
      table.string("avatar", 1024);
      table.string("role", 10).notNullable().defaultTo("user");
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    });

    console.log("Tabla 'users' creada con éxito");
  } catch (error) {
    console.error("Error al crear tabla 'users': ", error);
  } finally {
    knex.destroy();
  }
}

// eslint-disable-next-line no-unused-vars
async function crearTablaOrdenes(config) {
  const knex = Knex(config);
  try {
    await knex.schema.dropTableIfExists("orders");

    await knex.schema.createTable("orders", table => {
      table.increments("id");
      table.integer("number").unsigned().notNullable().unique();
      table.string("username", 50).notNullable().index();
      table.string("name", 50).notNullable();
      table.string("address", 80).notNullable();
      table.string("cp", 10).notNullable();
      table.string("phone", 20).notNullable();
      table.float("total").unsigned().notNullable();
      table.string("status", 20).notNullable().defaultTo("generada");
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    });

    console.log("Tabla 'orders' creada con éxito");
  } catch (error) {
    console.error("Error al crear tabla 'orders': ", error);
  } finally {
    knex.destroy();
  }
}

// eslint-disable-next-line no-unused-vars
async function crearTablaProductosEnOrden(config) {
  const knex = Knex(config);
  try {
    await knex.schema.dropTableIfExists("products_in_orders");

    await knex.schema.createTable("products_in_orders", table => {
      table.integer("id_order").unsigned().notNullable().index();
      table.integer("id").unsigned().notNullable();
      table.integer("quantity").unsigned().notNullable();
      table.string("title", 80).notNullable();
      table.text("detail");
      table.string("brand", 40).notNullable();
      table.string("code", 40);
      table.string("category", 40).notNullable();
      table.float("price").unsigned().notNullable();
      table.integer("stock").notNullable();
      table.string("thumbnail", 1024);
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    });

    console.log("Tabla 'products_in_orders' creada con éxito");
  } catch (error) {
    console.error("Error al crear tabla 'products_in_orders': ", error);
  } finally {
    knex.destroy();
  }
}

// eslint-disable-next-line no-unused-vars
async function cargaProductosPrueba(config) {
  const knex = Knex(config);
  const BK_FILENAME = "productsBk.json";
  try {
    // Obtengo los datos de un archivo de datos
    const content = await fs.readFile(
      path.join(__dirname, "..", "src", "utils", BK_FILENAME),
      "utf-8"
    );
    const productsBk = JSON.parse(content);
    await knex("products").insert(productsBk);
    console.log("Productos de prueba cargados");
  } catch (error) {
    console.error("Error al cargar productos de prueba: ", error);
  } finally {
    await knex.destroy();
  }
}

//Carga local mariaDB
// await crearTablaProductos(config.mariaDb);
// await crearTablaCarritos(config.mariaDb);
// await crearTablaProductosEnCarrito(config.mariaDb);
// await crearTablaMensajes(config.mariaDb);
// await crearTablaUsuarios(config.mariaDb);
// await crearTablaOrdenes(config.mariaDb);
// await crearTablaProductosEnOrden(config.mariaDb);
// await cargaProductosPrueba(config.mariaDb);

//Carga Sqlite3
// await crearTablaProductos(config.sqlite3);
// await crearTablaCarritos(config.sqlite3);
// await crearTablaProductosEnCarrito(config.sqlite3);
// await crearTablaMensajes(config.sqlite3);
// await crearTablaUsuarios(config.sqlite3);
// await crearTablaOrdenes(config.sqlite3);
// await crearTablaProductosEnOrden(config.sqlite3);
// await cargaProductosPrueba(config.sqlite3);

//Carga Heroku ClearDB
// await crearTablaProductos(config.clearDb);
// await crearTablaCarritos(config.clearDb);
// await crearTablaProductosEnCarrito(config.clearDb);
// await crearTablaMensajes(config.clearDb);
// await crearTablaUsuarios(config.clearDb);
// await crearTablaOrdenes(config.clearDb);
// await crearTablaProductosEnOrden(config.clearDb);
// await cargaProductosPrueba(config.clearDb);
