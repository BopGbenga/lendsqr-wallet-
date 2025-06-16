/**
 * @param {import("knex").Knex} knex
 */
export async function up(knex) {
  await knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table.integer("sender_id").unsigned().notNullable();
    table.integer("receiver_id").unsigned().notNullable();
    table.decimal("amount", 14, 2).notNullable();
    table.enum("type", ["credit", "debit"]).notNullable();
    table.string("status").defaultTo("successful");
    table.timestamp("created_at").defaultTo(knex.fn.now());


  });
}

/**
 * @param {import("knex").Knex} knex
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("transactions");
}
