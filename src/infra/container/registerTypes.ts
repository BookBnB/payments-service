import { DIContainer } from "@wessberg/di";
import { Connection } from "typeorm";
import Web3 from "web3";
import { PaymentController } from "../../application/PaymentController";
import { HTTPErrorHandlerLogger, HTTPLogger } from "../logging/HTTPLogger";
import Log4JSLogger from "../logging/Logger";
import typeOrmConnection from "../typeOrmConnection";
import { IContainer } from "./Container";

/**
 * Registra las relaciones entre las abstracciones y las clases
 * concretas.
 * Es obligatorio recibir un DIContainer porque los tipos se resuelven
 * en tiempo de compilación. Si recibimos un IContainer no se compila
 * correctamente. Esto es necesario para cualquier sentencia que
 * registre cualquier relación.
 * @param container
 */
export default async (container: DIContainer): Promise<IContainer> => {
    const connection = await typeOrmConnection()
    container.registerSingleton<Connection>(() => connection)

    // Users
    await registerWeb3(container);
    await registerPayments(container);
    await registerLoggers(container);

    // Return
    return container
}

const registerWeb3 = async (container: DIContainer) => {
    console.log(process.env.NODE_URL)
    const web3: Web3 = new Web3(process.env.NODE_URL || "");
    container.registerSingleton<Web3>(() => web3);
}

const registerPayments = async (container: DIContainer) => {
    const web3 = await container.get<Web3>();
    container.registerSingleton<PaymentController>(() => new PaymentController(web3))
}

const registerLoggers = async (container: DIContainer) => {
    const httpLogger = new Log4JSLogger('HTTP');
    container.registerSingleton<HTTPLogger>(() =>
        new HTTPLogger(httpLogger))

    container.registerSingleton<HTTPErrorHandlerLogger>(() =>
        new HTTPErrorHandlerLogger(httpLogger))
}
