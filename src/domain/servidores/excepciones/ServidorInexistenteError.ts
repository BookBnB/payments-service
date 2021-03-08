export default class ServidorInexistenteError extends Error {
    constructor(msg: string) {
        super(msg)
        Object.setPrototypeOf(this, ServidorInexistenteError.prototype);
    }
}