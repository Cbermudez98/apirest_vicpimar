import { StorageController } from './../controllers/storage.controller';
import { TYPES } from './../shared/containers/types';
import { inject, injectable } from 'inversify';
import express, { Express, Router, Request, Response } from "express";
import { container } from "../shared/containers/containers";
import { Auth } from '../middlewares/auth';
import { HttpResponse } from '../shared/httpResponse/httpResponse';
import "reflect-metadata";

@injectable()
export class Routes {
    private route: Router;
    @inject(TYPES.AUTH) private auth: Auth;

    constructor() {
        this.route = express.Router();
        this.auth = new Auth();
    }

    public initializeRoute(): Router {
        this.route.get("/getToken", (req: Request, res: Response) => {
            const htpResponse = container.get<HttpResponse>(TYPES.HTTP_RESPONSE);
            htpResponse.response(Promise.resolve({token: this.auth.getToken()}), req, res);
        });

        this.route.get("/stock", this.auth.validateToken(), (req: Request, res: Response) => {
            const htpResponse = container.get<HttpResponse>(TYPES.HTTP_RESPONSE);
            const storageController = container.get<StorageController>(TYPES.STORAGE_CONTROLLER);
            htpResponse.response(storageController.stock(), req, res);
        });

        this.route.get("/dailySell", this.auth.validateToken(), (req: Request, res: Response) => {
            const htpResponse = container.get<HttpResponse>(TYPES.HTTP_RESPONSE);
            const storageController = container.get<StorageController>(TYPES.STORAGE_CONTROLLER);
            htpResponse.response(storageController.dailySell(), req, res);
        });
        return this.route;
    }
}