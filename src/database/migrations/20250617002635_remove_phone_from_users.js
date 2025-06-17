exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.dropColumn("phone");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.string("phone").notNullable();
  });
};
