"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@tsed/common");
const Server_1 = require("./Server");
async function bootstrap() {
    try {
        common_1.$log.debug("Start server...");
        const server = await common_1.ServerLoader.bootstrap(Server_1.Server);
        await server.listen();
        common_1.$log.debug("Server initialized");
    }
    catch (er) {
        common_1.$log.error(er);
    }
}
bootstrap();
//# sourceMappingURL=index.js.map