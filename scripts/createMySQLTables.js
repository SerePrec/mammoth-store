import Knex from "knex";
import config from "../src/config";

const knex = Knex(config.mariaDb);

(() => {
  knex.schema
    .dropTableIfExists("productos")
    // .then(() =>
    //   knex.schema.createTable("productos", table => {
    //     table.increments("id");
    //     table.string("nombre", 15).notNullable();
    //     table.string("codigo", 10).notNullable();
    //     table.float("precio").unsigned();
    //     table.integer("stock");
    //   })
    // )
    .then(() => {
      console.log("Tabla 'productos' creada con éxito");
    })
    .catch(error => console.log("Error: ", error))
    .finally(() => knex.destroy());
})();
