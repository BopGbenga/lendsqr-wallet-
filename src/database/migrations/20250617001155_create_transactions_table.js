/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table.integer("sender_id").unsigned().notNullable();
    table.integer("receiver_id").unsigned().notNullable();
    table.decimal("amount", 14, 2).notNullable();
    table.enum("type", ["credit", "debit"]).notNullable();
    table.string("status", 255).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table
      .foreign("sender_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .foreign("receiver_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.index("sender_id");
    table.index("receiver_id");
    table.index("created_at");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("transactions");
};
