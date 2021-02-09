import { Application } from "express";
import apiMetrics from "prometheus-api-metrics";
import { IMetricMonitor } from "./MetricMonitor";

export class PrometheusMonitor implements IMetricMonitor {
    public monitor(app: Application): void {
        app.use(apiMetrics({
            metricsPath: process.env.PROM_METRICS_PATH || "/metrics"
        }))
    }
}