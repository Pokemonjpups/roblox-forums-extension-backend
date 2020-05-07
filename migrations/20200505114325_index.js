
exports.up = async (knex) => {
    await knex.schema.alterTable('forum_posts', (t) => {
        t.index(['post_category','id','parent_thread']);
    });
    await knex.schema.alterTable('forum_posts', (t) => {
        t.index(['author_id']);
    });
};

exports.down = async (knex) => {
    await knex.schema.alterTable('forum_posts', (t) => {
        t.dropIndex(['post_category','id','parent_thread'])
    });
    await knex.schema.alterTable('forum_posts', (t) => {
        t.dropIndex(['author_id'])
    });
};
