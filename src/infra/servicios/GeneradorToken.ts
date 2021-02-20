import IGeneradorToken from "../../domain/servidores/servicios/GeneradorToken";
import tokenGenerator from "uuid-apikey"


export class GeneradorToken implements IGeneradorToken {
    generarToken(): string {
        return tokenGenerator.create().apiKey;
    }
}
