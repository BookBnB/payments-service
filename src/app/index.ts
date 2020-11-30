import { DIContainer } from "@wessberg/di";
import express, { Application } from "express";
import Registry from "../infra/container/Registry";
import { HTTPErrorHandlerLogger, HTTPLogger } from "../infra/logging/HTTPLogger";
import Log4JSLogger, { ILogger } from "../infra/logging/Logger";
import Api from "./Api";
import Welcome from "./Welcome"

export default async (appLogger: ILogger): Promise<Application> => {
    const app = express();

    new HTTPLogger({app, logger: appLogger})
    new Welcome(app)
    new Api({
        app,
        logger: new Log4JSLogger('Api'),
        container: await new Registry().registrar(new DIContainer()),
        openApiInfo: {
            info: {
                title: 'BookBnB',
                version: '1.0.0'
            }
        }
    });
    new HTTPErrorHandlerLogger({app, logger: appLogger})

    return app
}
