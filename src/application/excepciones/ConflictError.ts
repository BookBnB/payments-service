import { HttpError } from "routing-controllers";

export default class ConflictError extends HttpError {
    constructor(msg: string) {
        super(409, msg);
        Object.setPrototypeOf(this, ConflictError.prototype)
    }

    toJSON() {
        return {
            status: this.httpCode,
            message: this.message
        }
    }
}