import {Action, ClassConstructor, IocAdapter} from "routing-controllers";
import {IContainer} from "./Container";

export default class ContainerAdapter implements IocAdapter {

    constructor(private readonly container: IContainer) {
    }

    get<T>(someClass: ClassConstructor<T>, action?: Action): T {
        return this.container.get({identifier: someClass.name});
    }
}
