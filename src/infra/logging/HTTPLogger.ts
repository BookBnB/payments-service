import {Middleware, ExpressMiddlewareInterface, ExpressErrorMiddlewareInterface} from "routing-controllers";
import {ILogger} from "./Logger";

@Middleware({ type: "after" })
export class HTTPLogger implements ExpressMiddlewareInterface {

    public constructor(private readonly logger: ILogger) {
    }

    use(request: any, response: any, next: (err?: any) => any): void {
        this.logger.info(HTTPLogger.logMessage(request, response))
        next();
    }

    private static logMessage(request: any, response: any) {
        const {method, url} = request;
        const status_code = response.statusCode;
        return `${method}:${url} status_code:${status_code}`;
    }
}

@Middleware({ type: "after" })
export class HTTPErrorHandlerLogger implements ExpressErrorMiddlewareInterface {

    public constructor(private readonly logger: ILogger) {
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
