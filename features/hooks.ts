import {After, AfterAll, Before, BeforeAll} from "cucumber";
import express from "express"
import Api from "../src/app/Api";
import Log4JSLogger from "../src/infra/logging/Logger";
import {DIContainer} from "@wessberg/di";
import {Connection} from "typeorm";
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import Registry from "../src/infra/container/Registry";

dotenvExpand(dotenv.config({path: 'features/.env'}))

/**
 * Setup api
 */
Before(async function () {
    const app = express()
    this.app = app
    this.container = new DIContainer()
    await new Registry().registrar(this.container);
    return new Api({
        app,
        logger: new Log4JSLogger('Api'),
        container: this.container,
    });
});

After(async function () {
    const container: DIContainer = this.container;
    return await container.get<Connection>().close()
});
