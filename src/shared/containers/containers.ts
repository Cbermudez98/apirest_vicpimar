import { Container } from "inversify";
import { TYPES } from "./types";
import { HttpResponse } from "../httpResponse/httpResponse";
import { Auth } from "../../middlewares/auth";
import { Routes } from "../../routes/routes";
import { StorageDta } from "../../dta/storage.dta";
import { StorageController } from "../../controllers/storage.controller";
import "reflect-metadata";

const container = new Container();

/* Start building a container */
container.bind<HttpResponse>(TYPES.HTTP_RESPONSE).to(HttpResponse);
container.bind<Auth>(TYPES.AUTH).to(Auth);
container.bind<Routes>(TYPES.ROUTES).to(Routes);
container.bind<StorageDta>(TYPES.STORAGE_DTA).to(StorageDta);
container.bind<StorageController>(TYPES.STORAGE_CONTROLLER).to(StorageController);

export { container };
