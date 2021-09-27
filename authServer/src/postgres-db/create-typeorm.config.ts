import {DbConfigService} from "./db-config.service";

const fs = require('fs');

fs.writeFileSync(
    'ormconfig.json',
    JSON.stringify(new DbConfigService().createTypeOrmOptions(), null, 4)
);