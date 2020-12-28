export default class BilleteraInexistenteError extends Error {
    constructor(msg: string) {
        super(msg)
        Object.setPrototypeOf(this, BilleteraInexistenteError.prototype);
    }
}