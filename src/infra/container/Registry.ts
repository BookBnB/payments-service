import { DIContainer } from "@wessberg/di";
import { Connection, Repository } from "typeorm";
import Web3 from "web3";
import { BilleteraController } from "../../application/BilleteraController";
import { PagoController } from "../../application/PaymentController";
import { PublicacionController } from "../../application/PublicacionController";
import { ReservaController } from "../../application/ReservaController";
import { CrearBilletera } from "../../domain/billeteras/casos-uso/CrearBilletera";
import Billetera from "../../domain/billeteras/entidades/Billetera";
import IBilleteraRepositorio from "../../domain/billeteras/repositorios/BilleteraRepositorio";
import { ICreadorBilleteras } from "../../domain/billeteras/servicios/CreadorBilleteras";
import IServicioCore from "../../domain/common/servicios/IServicioCore";
import { IContratoBookBnB } from "../../domain/contrato/servicios/ContratoBookBnB";
import { CrearPublicacion } from "../../domain/contrato/casos-uso/CrearPublicacion";
import { AprobarReserva } from "../../domain/contrato/casos-uso/AprobarReserva";
import { CrearReserva } from "../../domain/contrato/casos-uso/CrearReserva";
import { RechazarReserva } from "../../domain/contrato/casos-uso/RechazarReserva";
import { ContratoBookBnB } from "../servicios/ContratoBookBnB";
import { ErrorHandler } from "../ErrorHandler";
import { BilleteraRepositorio } from "../repositories/BilleteraRepositorio";
import CreadorBilleteras from "../servicios/CreadorBilleteras";
import ServicioCore from "../servicios/ServicioCore";
import typeOrmConnection from "../typeOrmConnection";
import { IContainer } from "./Container";
import Log4JSLogger, {ILogger} from "../logging/Logger";
import { IMetricMonitor } from "../../app/metrics/MetricMonitor";
import { PrometheusMonitor } from "../../app/metrics/PrometheusMonitor";

export default class Registry {
    public async registrar(container: DIContainer): Promise<IContainer> {
        await this.registrarLogger(container)
        await this.registrarTypeOrmConnection(container);
        await this.registrarErrorHandler(container)
        await this.registrarWeb3(container);
        await this.registrarServiciosComunes(container);
        await this.registrarPagos(container);
        await this.registrarBilleteras(container);
        await this.registrarPublicaciones(container);
        await this.registrarReservas(container)
        await this.registrarMetricas(container)

        return container;
    }

    protected async registrarLogger(container: DIContainer) {
        container.registerSingleton<ILogger>(() => new Log4JSLogger('App'));
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

    protected async registrarServiciosComunes(container: DIContainer) {
        container.registerSingleton<IServicioCore>(() => new ServicioCore(<string>process.env.CORE_URL))
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

    protected async registrarPublicaciones(container: DIContainer) {
        container.registerTransient<CrearPublicacion>()
        container.registerSingleton<PublicacionController>()

        container.registerSingleton<IContratoBookBnB>(() => new ContratoBookBnB())
    }

    protected async registrarReservas(container: DIContainer) {
        container.registerSingleton<CrearReserva>()
        container.registerSingleton<AprobarReserva>()
        container.registerSingleton<RechazarReserva>()
        container.registerSingleton<ReservaController>()
    }

    protected async registrarMetricas(container: DIContainer) {
        container.registerSingleton<IMetricMonitor>(() => new PrometheusMonitor())
    }
}
