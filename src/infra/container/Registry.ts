import { DIContainer } from "@wessberg/di";
import { Connection, Repository } from "typeorm";
import Web3 from "web3";
import { BilleteraController } from "../../application/BilleteraController";
import { PagoController } from "../../application/PaymentController";
import { CrearBilletera } from "../../domain/billeteras/casos-uso/CrearBilletera";
import Billetera from "../../domain/billeteras/entidades/Billetera";
import IBilleteraRepositorio from "../../domain/billeteras/repositorios/BilleteraRepositorio";
import { ICreadorBilleteras } from "../../domain/billeteras/servicios/CreadorBilleteras";
import { ErrorHandler } from "../ErrorHandler";
import { BilleteraRepositorio } from "../repositories/BilleteraRepositorio";
import CreadorBilleteras from "../servicios/CreadorBilleteras";
import typeOrmConnection from "../typeOrmConnection";
import { IContainer } from "./Container";

export default class Registry {
    public async registrar(container: DIContainer): Promise<IContainer> {
        await this.registrarTypeOrmConnection(container);
        await this.registrarErrorHandler(container)
        await this.registrarWeb3(container);
        await this.registrarPagos(container);
        await this.registrarBilleteras(container);

        return container;
    }

    protected async registrarTypeOrmConnection(container: DIContainer) {
        const connection = await typeOrmConnection();
        container.registerSingleton<Connection>(() => connection);
    }

    protected async registrarErrorHandler(container: DIContainer) {
        container.registerSingleton<ErrorHandler>()
    }

    protected async registrarWeb3(container: DIContainer) {
        const web3: Web3 = new Web3(process.env.NODE_URL || "");
        container.registerSingleton<Web3>(() => web3);
    }

    protected async registrarPagos(container: DIContainer) {
        const web3 = await container.get<Web3>();
        container.registerSingleton<PagoController>(() => new PagoController(web3))
    }

    protected async registrarBilleteras(container: DIContainer) {
        container.registerTransient<CrearBilletera>();
        container.registerSingleton<BilleteraController>();

        const repoBilleteras = await container.get<Connection>().getRepository(Billetera);
        container.registerSingleton<Repository<Billetera>>(() => repoBilleteras);
        container.registerSingleton<IBilleteraRepositorio>(() =>
            new BilleteraRepositorio(container.get<Repository<Billetera>>()));

        container.registerSingleton<ICreadorBilleteras>(() => new CreadorBilleteras());
    }
}
