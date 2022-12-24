import { injectable } from 'inversify';
import { Request, Response } from "express";
import "reflect-metadata";

@injectable()
export class HttpResponse{
    constructor() {

    }

    public response(promise: Promise<any>, req: Request, res: Response){
        promise.then((data: any) => {
            res.status(200).json(data);
        })
        .catch((error: any) => {
            res.status(500).json({
                status: "Internal server error",
                msg: "Something went wrong"
            });
        });
    }
}