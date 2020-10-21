import {Connection, createConnection, getConnectionOptions} from "typeorm";
import OrmLogger from "./logging/OrmLogger";
import Log4JSLogger from "./logging/Logger";

export default async (): Promise<Connection> => {
    const connectionOptions = await getConnectionOptions();
    return await createConnection({
        ...connectionOptions,
        logger: new OrmLogger(new Log4JSLogger('Orm')),
        entities: [
            `${__dirname}/../domain/**/entities/*`
        ]
    });
}
