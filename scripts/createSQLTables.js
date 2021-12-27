import Knex from "knex";
import config from "../src/config.js";
import * as fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    console.log("Error al crear tabla 'products': ", error);
  } finally {
    knex.destroy();
  }
}

async function crearTablaCarritos(config) {
  const knex = Knex(config);
  try {
    await knex.schema.dropTableIfExists("carts");

    await knex.schema.createTable("carts", table => {
      table.increments("id");
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    });

    console.log("Tabla 'carts' creada con éxito");
  } catch (error) {
    console.log("Error al crear tabla 'carts': ", error);
  } finally {
    knex.destroy();
  }
}

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
    console.log("Error al crear tabla 'products_in_carts': ", error);
  } finally {
    knex.destroy();
  }
}

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
    console.log("Error al crear tabla 'messages': ", error);
  } finally {
    knex.destroy();
  }
}

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
    console.log("Error al cargar productos de prueba: ", error);
  } finally {
    await knex.destroy();
  }
}

await crearTablaProductos(config.mariaDb);
await crearTablaCarritos(config.mariaDb);
await crearTablaProductosEnCarrito(config.mariaDb);
await crearTablaMensajes(config.mariaDb);
await cargaProductosPrueba(config.mariaDb);

await crearTablaProductos(config.sqlite3);
await crearTablaCarritos(config.sqlite3);
await crearTablaProductosEnCarrito(config.sqlite3);
await crearTablaMensajes(config.sqlite3);
await cargaProductosPrueba(config.sqlite3);
