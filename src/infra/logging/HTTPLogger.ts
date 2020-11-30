import {ILogger} from "./Logger";
import {Application} from "express";


export class HTTPLogger {
    private readonly logger: ILogger;

    public constructor({app, logger}: { app: Application, logger: ILogger }) {
        this.logger = logger
        app.use((request: any, response: any, next: (err?: any) => any) =>
            this.use(request, response, next))
    }

    use(request: any, response: any, next: (err?: any) => any): void {
        response.on('finish', () => {
            this.logger.info(HTTPLogger.logMessage(request, response))
        })
        next();
    }

    private static logMessage(request: any, response: any) {
        const {method, url} = request;
        const status_code = response.statusCode;
        return `${method}:${url} status_code:${status_code}`;
    }
}

export class HTTPErrorHandlerLogger {
    private readonly logger: ILogger;

    public constructor({app, logger}: { app: Application, logger: ILogger }) {
        this.logger = logger
        app.use((error: any, request: any, response: any, next: (err?: any) => any) =>
            this.error(error, request, response, next))
    }

    error(error: any, request: any, response: any, next: (err?: any) => any): void {
        this.logger.error(HTTPErrorHandlerLogger.logMessage(error, request, response))
        next();
    }

    private static logMessage(error: any, request: any, response: any) {
        const {method, url} = request;
        const status_code = response.statusCode;
        return `${method}:${url} status_code:${status_code} ${error.stack}`;
    }
}
