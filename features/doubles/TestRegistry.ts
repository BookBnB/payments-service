import {DIContainer} from "@wessberg/di";
import IServicioCore from "../../src/domain/common/servicios/IServicioCore";
import Registry from "../../src/infra/container/Registry";
import { IMetricMonitor } from "../../src/app/metrics/MetricMonitor";

export default class TestRegistry extends Registry {
    constructor(
        private readonly servicioCore: IServicioCore,
        private readonly mockMonitor: IMetricMonitor
    ) {
        super();
    }

    protected async registrarServiciosComunes(container: DIContainer) {
        container.registerSingleton<IServicioCore>(() => this.servicioCore);
    }

    protected async registrarMetricas(container: DIContainer) {
        container.registerSingleton<IMetricMonitor>(() => this.mockMonitor)
    }
}
