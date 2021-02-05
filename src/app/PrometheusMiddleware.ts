import { Application } from "express";
import apiMetrics from "prometheus-api-metrics";

export default class PrometheusMiddleware {
    public constructor(app: Application) {
        app.use(apiMetrics({
            metricsPath: process.env.PROM_METRICS_PATH || "/v1/metricas"
        }))
    }
}
