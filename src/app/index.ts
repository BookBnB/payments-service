import express, { Application } from "express";
import { HTTPErrorHandlerLogger, HTTPLogger } from "../infra/logging/HTTPLogger";
import { ILogger } from "../infra/logging/Logger";
import Api from "./Api";
import Welcome from "./Welcome"
import OpenApiSpec from "./OpenApiSpec";
import {IContainer} from "../infra/container/Container";

export default async (container: IContainer): Promise<Application> => {
    const app = express();
    const logger = container.get<ILogger>({identifier: "ILogger"})

    new HTTPLogger({app, logger})
    new Welcome(app)
    new Api({app, logger, container});
    new OpenApiSpec({
        app,
        openApiInfo: {
            info: {
                title: 'BookBnB',
                version: '1.0.0'
            }
        }
    })
    new HTTPErrorHandlerLogger({app, logger})

    return app
}
