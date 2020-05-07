/**
 * Add general forum posts table
 */

exports.up = async (knex, Promise) => {
    await knex.schema.alterTable('forum_posts', (table) => {
        table.string('post_title', 2048).collate('utf8mb4_bin').alter()
    });
};

exports.down = async (knex, Promise) => {
    await knex.schema.alterTable('forum_posts', (table) => {
        table.string('post_title', 1024).collate('utf8mb4_bin').alter()
    });
};
