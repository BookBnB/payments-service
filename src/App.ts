import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { configure } from "log4js";
import app from './app';
import { ILogger } from "./infra/logging/Logger";
import logConfig from '../config/log-config.json';
import Registry from "./infra/container/Registry";
import {DIContainer} from "@wessberg/di";

async function main() {
	dotenvExpand(dotenv.config())
	configure(logConfig);

	const DEFAULT_PORT: number = 4000;
	const port: number = process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT;

	const container = new DIContainer()
	await new Registry().registrar(container)

	const appLogger: ILogger = container.get<ILogger>();
    (await app(container)).listen(port, () => appLogger.info(`Listening at port ${port}`))
}

main();
