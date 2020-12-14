export default class TransaccionRevertidaError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, TransaccionRevertidaError.prototype);
    }

    public static desdeError(err: Error): Error {
        if (!err.stack || err.stack.indexOf('VM Exception while processing transaction: revert') == -1) {
            return err;
        }

        const start = err.stack.indexOf('revert') + 'revert'.length;
        const end = err.stack.indexOf('\n');

        if (start == -1 || end == -1) {
            return err;
        }

        const message = err.stack.slice(start, end).trim();

        return new TransaccionRevertidaError(message);
    }
}