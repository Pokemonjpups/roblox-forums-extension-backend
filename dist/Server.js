"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const bodyParser = require("body-parser");
const compress = require("compression");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
require("@tsed/swagger"); // import swagger Ts.ED module
const NotFound_1 = require("./middleware/NotFound");
const Cors_1 = require("./middleware/Cors");
const rootDir = __dirname;
let Server = class Server extends common_1.ServerLoader {
    /**
     * This method let you configure the express middleware required by your application to works.
     * @returns {Server}
     */
    $beforeRoutesInit() {
        this.expressApp.disable('x-powered-by');
        this
            .use(common_1.GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(Cors_1.RobloxCors)
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
            extended: true
        }));
    }
    $afterRoutesInit() {
        this.use(NotFound_1.NotFoundMiddleware);
    }
};
Server = __decorate([
    common_1.ServerSettings({
        rootDir,
        acceptMimes: ["application/json"],
        port: process.env.PORT || 3000,
        mount: {
            "/api/v1/": "${rootDir}/controllers/v1/*.ts",
            "/": "${rootDir}/controllers/www.ts",
        },
        componentsScan: [
            "${rootDir}/middleware/**/*.ts",
        ],
        swagger: [
            {
                operationIdFormat: 'Forum.%c.%m',
                path: "/docs",
                showExplorer: false,
            }
        ],
        logger: {
            logStart: false,
            logEnd: false,
            logRequest: false,
        },
        validationModelStrict: true,
    })
], Server);
exports.Server = Server;
//# sourceMappingURL=Server.js.map