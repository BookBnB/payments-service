import {Application} from "express";
import {getMetadataArgsStorage} from "routing-controllers";
import {routingControllersToSpec} from 'routing-controllers-openapi';
import {validationMetadatasToSchemas} from 'class-validator-jsonschema'
import swaggerUi from 'swagger-ui-express';
import {OpenAPIObject} from "openapi3-ts";
import {defaultMetadataStorage} from "class-transformer/storage";
import Api from "./Api";


export interface ApiConstructor {
    app: Application,
    openApiInfo?: Partial<OpenAPIObject>
}

export default class OpenApiSpec {
    private readonly app: Application;
    private readonly openApiInfo: Partial<OpenAPIObject>;

    constructor({app, openApiInfo = {}}: ApiConstructor) {
        this.app = app
        this.openApiInfo = openApiInfo
        this.initialize()
    }

    private initialize(): void{
        this.serveApiDocs()
    }

    /**
     * Muestra la documentación de la api.
     * @private
     */
    private serveApiDocs(): void {
        const schemas = validationMetadatasToSchemas({
            refPointerPrefix: '#/components/schemas/',
            classTransformerMetadataStorage: defaultMetadataStorage
        })

        const spec = routingControllersToSpec(
            getMetadataArgsStorage(),
            Api.options(),
            {
                ...this.openApiInfo,
                components: {
                    schemas,
                    securitySchemes: {
                        token: {
                            type: 'apiKey',
                            in: 'header',
                            name: 'Authorization'
                        }
                    }
                },
            }
        )

        const {routePrefix} = Api.options()
        this.serveApiSpec(spec, `${routePrefix}/api.json`)
        this.serveSwagger(`${routePrefix}/api.json`,
            `${routePrefix}/api-docs`)
    }

    /**
     * Muestra la especificación OpenApi en la url dada.
     * @param spec
     * @param url
     * @private
     */
    private serveApiSpec(spec: object, url: string) {
        this.app.get(url, (req, res) => res.json(spec));
    }

    /**
     * Muestra la interfaz swagger en la url dada.
     * @param specUrl
     * @param swaggerUrl
     * @private
     */
    private serveSwagger(specUrl: string, swaggerUrl: string) {
        this.app.use(swaggerUrl,
            swaggerUi.serve,
            swaggerUi.setup(undefined, {
                explorer: true,
                swaggerOptions: {
                    url: specUrl,
                },
                customSiteTitle: 'BookBnB: Core'
            }));
    }
}
