import Api from "./Api";
import { configure } from "log4js";
import Log4JSLogger from "./infra/logging/Logger";
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import registerTypes from "./infra/container/registerTypes";
import {DIContainer} from "@wessberg/di";


async function main() {
	dotenvExpand(dotenv.config())
	configure(require('../config/log-config.json'));

	const DEFAULT_PORT: number = 3000;

	const port: number = process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT;

	const api: Api = new Api({
		port,
		logger: new Log4JSLogger('Api'),
		container: await registerTypes(new DIContainer()),
		openApiInfo: {
			info: {
				title: 'Node temple',
				version: '1.0.0'
			}
		}
	});

	await api.start();
}

main();
