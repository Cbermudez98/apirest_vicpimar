import { StorageDta } from '../dta/storage.dta';
import { inject, injectable } from 'inversify';
import "reflect-metadata";
import { TYPES } from '../shared/containers/types';
@injectable()
export class StorageController {
    @inject(TYPES.STORAGE_DTA) private storageDta: StorageDta;
    constructor() {
        this.storageDta = new StorageDta();
    }

    public async stock() {
        return await this.storageDta.stock();
    }

    public async dailySell(startDate: string, endDate: string) {
        return await this.storageDta.dailySell(startDate, endDate);
    }

}