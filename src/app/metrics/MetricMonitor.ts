import { Application } from "express";

export interface IMetricMonitor {
    monitor(app: Application): void
}