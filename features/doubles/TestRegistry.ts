import {DIContainer} from "@wessberg/di";
import IServicioCore from "../../src/domain/common/servicios/IServicioCore";
import Registry from "../../src/infra/container/Registry";

export default class TestRegistry extends Registry {
    constructor(private readonly servicioCore: IServicioCore) {
        super();
    }

    protected async registrarServiciosComunes(container: DIContainer) {
        container.registerSingleton<IServicioCore>(() => this.servicioCore);
    }
}
