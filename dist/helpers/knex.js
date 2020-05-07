"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const knexLibrary = require("knex");
const knexSystem = knexLibrary({
    client: 'mysql',
    connection: config_1.default["mysql"],
    pool: {
        min: 5,
        max: 50,
    },
});
/*
setInterval(() => {
    console.log('== start debug stats ==');
    let pool = knexSystem.client.pool;

    // returns the number of non-free resources
    let numUsed = pool.numUsed();
    console.log('numUsed: '+numUsed);

    // returns the number of free resources
    let numFree = pool.numFree()
    console.log('numFree: '+numFree);

    // how many acquires are waiting for a resource to be released
    let numPendingAcquires = pool.numPendingAcquires();
    console.log('numPendingAcquires: '+numPendingAcquires);

    // how many asynchronous create calls are running
    let numPendingCreates = pool.numPendingCreates();
    console.log('numPendingCreates: '+numPendingCreates);

    console.log('== end debug stats ==');
}, 5000);
*/
exports.default = knexSystem;
//# sourceMappingURL=knex.js.map