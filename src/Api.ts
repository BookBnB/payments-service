import {Application} from "express";
import {ILogger} from "./infra/logging/Logger";
import "reflect-metadata"; // Necesario para routing-controllers
import {createExpressServer, getMetadataArgsStorage, useContainer} from "routing-controllers";
import {routingControllersToSpec} from 'routing-controllers-openapi';
import {validationMetadatasToSchemas} from 'class-validator-jsonschema'
import swaggerUi from 'swagger-ui-express';
import ContainerAdapter from "./infra/container/ContainerAdapter";
import {IContainer} from "./infra/container/Container";
import {HTTPErrorHandlerLogger, HTTPLogger} from './infra/logging/HTTPLogger';
import {OpenAPIObject} from "openapi3-ts";

export interface ApiConstructor {
    port: number,
    logger: ILogger,
    container: IContainer,
    openApiInfo?: Partial<OpenAPIObject>
}

export default class Api {
    private readonly port: number;
    private readonly logger: ILogger;
    private readonly container: IContainer;
    private readonly openApiInfo: Partial<OpenAPIObject>;

    public constructor({port, logger, container, openApiInfo = {}}: ApiConstructor) {
        this.port = port
        this.logger = logger
        this.container = container
        this.openApiInfo = openApiInfo
    }

    public async start(): Promise<void> {
        await this.useContainer();
        const app: Application = createExpressServer(this.options());
        this.serveApiDocs(app)
        app.listen(this.port, () => this.logger.info(`Listening at port ${this.port}`))
    }

    /**
     * Configura el container para instanciar los controladores.
     * @private
     */
    private async useContainer() {
        useContainer(new ContainerAdapter(this.container));
    }

    /**
     * Muestra la documentación de la api.
     * @param app
     * @private
     */
    private serveApiDocs(app: Application) {
        const schemas = validationMetadatasToSchemas({
            refPointerPrefix: '#/components/schemas/',
        })

        const spec = routingControllersToSpec(
            getMetadataArgsStorage(),
            this.options(),
            {
                ...this.openApiInfo,
                components: {schemas},
            }
        )

        app.use(`${this.options().routePrefix}/api-docs`, swaggerUi.serve, swaggerUi.setup(spec));
        app.get(`${this.options().routePrefix}/api.json`, (req, res) =>
            res.json(spec));
    }

    /**
     * Opciones para routing-controllers.
     * @private
     */
    private options() {
        return {
            routePrefix: "/v1",
            controllers: [__dirname + "/application/**/*"],
            middlewares: [
                HTTPLogger,
                HTTPErrorHandlerLogger
            ]
        }
    }
}
