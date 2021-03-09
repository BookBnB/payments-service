import IGeneradorToken from "../../domain/servidores/servicios/GeneradorToken";
import crypto from "crypto"


export class GeneradorToken implements IGeneradorToken {
    generarToken(): string {
        return crypto.randomBytes(24).toString('hex');
    }
}
