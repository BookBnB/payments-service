import { Application } from "express";
import { OpenAPIObject } from "openapi3-ts";
import "reflect-metadata"; // Necesario para routing-controllers
import { RoutingControllersOptions, useContainer, useExpressServer } from "routing-controllers";
import { IContainer } from "../infra/container/Container";
import ContainerAdapter from "../infra/container/ContainerAdapter";
import { ILogger } from "../infra/logging/Logger";

export interface ApiConstructor {
    app: Application,
    logger: ILogger,
    container: IContainer,
    openApiInfo?: Partial<OpenAPIObject>
}

export default class Api {
    private readonly app: Application;
    private readonly logger: ILogger;
    private readonly container: IContainer;

    public constructor({app, logger, container}: ApiConstructor) {
        this.app = app
        this.logger = logger
        this.container = container
        this.initialize()
    }

    public initialize(): void {
        this.useContainer();
        useExpressServer(this.app, Api.options());
    }
    
    /**
     * Configura el container para instanciar los controladores.
     * @private
     */
    private useContainer() {
        useContainer(new ContainerAdapter(this.container));
    }

    /**
     * Opciones para routing-controllers.
     * @private
     */
    public static options(): RoutingControllersOptions {
        return {
            routePrefix: "/v1",
            controllers: [__dirname + "/../application/**/*Controller.?s"],
            validation: true,
            defaultErrorHandler: false
        }
    }
}
