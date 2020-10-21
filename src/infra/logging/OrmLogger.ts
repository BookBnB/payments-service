import {Logger, QueryRunner} from "typeorm";
import {ILogger} from "./Logger";


export default class LoggerAdapter implements Logger {

    public constructor(private readonly logger: ILogger) {
    }

    private static stringifyParams(parameters: any[]) {
        try {
            return JSON.stringify(parameters);
        } catch (error) { // most probably circular objects in parameters
            return parameters;
        }
    }

    private static sql(query: string, parameters?: any[]) {
        return query + (parameters && parameters.length
            ? " -- PARAMETERS: " + LoggerAdapter.stringifyParams(parameters)
            : "");
    }

    log(level: "log" | "info" | "warn" | "debug" | "error", message: any, queryRunner?: QueryRunner): any {
        level = level === "log" ? "debug" : level;
        this.logger[level](message)
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        this.log("debug", message, queryRunner)
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.log("debug", "query" + ": " + LoggerAdapter.sql(query, parameters));
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.log("error", `query failed: ` + LoggerAdapter.sql(query, parameters));
        this.log("error", `error:` + error);
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.log("warn", `query is slow: ` + LoggerAdapter.sql(query, parameters));
        this.log("warn", `execution time: ` + time);
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        this.log("debug", message)
    }
}
