import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from "@tsed/common";
import * as bodyParser from "body-parser";
import * as compress from "compression";
import * as cookieParser from "cookie-parser";
import * as methodOverride from "method-override";
import "@tsed/swagger"; // import swagger Ts.ED module

import {NotFoundMiddleware} from './middleware/NotFound';
import {RobloxCors} from './middleware/Cors';

const rootDir = __dirname;

@ServerSettings({
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
export class Server extends ServerLoader {
    /**
     * This method let you configure the express middleware required by your application to work.
     * @returns {Server}
     */
    public $beforeRoutesInit(): void | Promise<any> {
        this.expressApp.disable('x-powered-by');
        this
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(RobloxCors)
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));
    }

    public $afterRoutesInit() {
        this.use(NotFoundMiddleware);
    }
}