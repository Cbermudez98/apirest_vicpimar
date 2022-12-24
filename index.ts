import { TYPES } from './src/shared/containers/types';
import { inject, injectable } from 'inversify';
import express, { Application, Express } from "express";
import { Routes } from './src/routes/routes';
import "reflect-metadata";

@injectable()
export class Index {
    @inject(TYPES.ROUTES) private routes: Routes;
    private port: number = 3000;
    private app: Express;
    constructor() {
        this.routes = new Routes();
        this.app = express();
        this.app.set("port", this.port);
    }

    initServer() {
        this.app.use("/api/v1", this.routes.initializeRoute());
        this.app.listen(this.app.get("port"), () => {
            console.log(`Server running at port ${this.port}`);
        }).timeout = 120000;
    }
}

const index = new Index();
index.initServer();