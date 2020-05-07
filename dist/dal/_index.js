"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("../helpers/knex");
const axios_1 = require("axios");
const jsonwebtoken = require("jsonwebtoken");
const config_1 = require("../helpers/config");
const moment = require("moment");
class Dal {
    constructor() {
        this.knex = knex_1.default;
        this.axios = axios_1.default;
        this.jwt = jsonwebtoken;
        this.config = config_1.default;
        this.moment = moment;
        // Nothing, for now
    }
}
exports.default = Dal;
//# sourceMappingURL=_index.js.map