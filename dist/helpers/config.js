"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const confString = fs.readFileSync(path.join(__dirname, '../../config.json')).toString();
const configAsObject = Object.freeze(JSON.parse(confString));
exports.default = configAsObject;
//# sourceMappingURL=config.js.map