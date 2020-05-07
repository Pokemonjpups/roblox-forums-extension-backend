// Update with your config settings.
process.env.NODE_ENV = 'production';
const config = require("./dist/helpers/config").default;
config.mysql.charset = false;
module.exports = {

    development: {
        client: 'mysql',
        connection: config["mysql"],
        pool: {
            min: 2,
            max: 20
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },

    staging: {
        client: 'mysql',
        connection: config["mysql"],
        pool: {
            min: 2,
            max: 20
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },

    production: {
        client: 'mysql',
        connection: config["mysql"],
        pool: {
            min: 2,
            max: 20
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }

};
