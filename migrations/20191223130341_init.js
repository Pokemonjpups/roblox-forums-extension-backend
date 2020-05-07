/**
 * Add general forum posts table
 */

exports.up = async (knex, Promise) => {
    await knex.schema.createTable('forum_posts', (table) => {
        table.bigIncrements('id');
        table.integer('created_at').notNullable();
        table.string('post_title', 1024).collate('utf8mb4_bin');
        table.text('post_body', 'longtext').notNullable().collate('utf8mb4_bin');
        table.bigInteger('author_id').unsigned().notNullable();
        table.integer('author_joindate').notNullable();
        table.integer('author_postcount').unsigned().notNullable();
        table.integer('post_group').notNullable();
        table.integer('post_category').notNullable();

        table.integer('is_moderator').notNullable().defaultTo(0);
        table.integer('is_top_100_poster').notNullable().defaultTo(0);
        table.integer('is_top_25_poster').notNullable().defaultTo(0);
        table.integer('is_top_50_poster').notNullable().defaultTo(0);
        table.integer('is_thread').notNullable().defaultTo(0);
        table.integer('parent_thread').notNullable().defaultTo(0);
    });
    await knex.raw(`ALTER TABLE forum_posts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin`);
};

exports.down = async (knex, Promise) => {
    await knex.schema.dropTable('forum_posts');
};
