export default class BilleteraYaExisteError extends Error {
    constructor(m: string = 'Billetera ya existe') {
        super(m);
        Object.setPrototypeOf(this, BilleteraYaExisteError.prototype);
    }
}
