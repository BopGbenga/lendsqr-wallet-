exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("balance");
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.decimal("balance", 14, 2).defaultTo(0.0);
  });
};
