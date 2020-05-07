interface IConfig {
    mysql: {
        host: string;
        user: string;
        password: string;
        database: string;
        charset?: string;
    };
    jwt: {
        login: string;
        session: string;
    }
}
import fs = require('fs');
import path = require('path');
const confString = fs.readFileSync(path.join(__dirname, '../../config.json')).toString();
const configAsObject: IConfig = Object.freeze(JSON.parse(confString));
export default configAsObject;