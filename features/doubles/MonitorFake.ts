import { Application } from "express";
import { IMetricMonitor } from "../../src/app/metrics/MetricMonitor";

export default class MonitorFake implements IMetricMonitor {
    monitor(app: Application): void {
    }
}
