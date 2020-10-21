import { Logger, getLogger } from "log4js";

export interface ILogger {
	trace(message: any, ...args: any[]): void;
	debug(message: any, ...args: any[]): void;
	info(message: any, ...args: any[]): void;
	warn(message: any, ...args: any[]): void;
	error(message: any, ...args: any[]): void;  
}

export default class Log4JSLogger implements ILogger {
	private logger: Logger;

	public constructor(name: string) {
		this.logger = getLogger(name);
	}

	public trace(message: any, ...args: any[]): void { this.logger.trace.apply(this.logger, [message, ...args]); }
	public debug(message: any, ...args: any[]): void { this.logger.debug.apply(this.logger, [message, ...args]); }
	public info(message: any, ...args: any[]): void { this.logger.info.apply(this.logger, [message, ...args]); }
	public warn(message: any, ...args: any[]): void { this.logger.warn.apply(this.logger, [message, ...args]); }
	public error(message: any, ...args: any[]): void { this.logger.error.apply(this.logger, [message, ...args]); }	
}
