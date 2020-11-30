import {ExpressErrorMiddlewareInterface, HttpError, Middleware} from "routing-controllers";


@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err?: any) => any): void {
        response.status(error.httpCode ?? error.statusCode ?? 500);
        response.json(this.processJsonError(error))
        next()
    }

    private processJsonError(error: any) {
        if (typeof error.toJSON === "function")
            return error.toJSON();

        let processedError: any = {};
        if (error instanceof Error) {
            processedError.name = error.name && error.name !== "Error" ? error.name : error.constructor.name;

            if (error.message)
                processedError.message = error.message;
            if (error.stack && process.env.NODE_ENV != 'production')
                processedError.stack = error.stack;

            Object.keys(error)
                .filter(key => key !== "stack" && key !== "name" && key !== "message" && (!(error instanceof HttpError) || key !== "httpCode"))
                .forEach(key => processedError[key] = (error as any)[key]);

            return Object.keys(processedError).length > 0 ? processedError : undefined;
        }

        return error;
    }
}
