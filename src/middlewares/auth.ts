import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';
require('dotenv').config();
import jwt from "jsonwebtoken";
import "reflect-metadata";

@injectable()
export class Auth {
    private SECRET_KEY: string = process.env.SECRET_KEY || "";
    constructor() {
    }

    public getToken() {
        return jwt.sign({ date: new Date().getTime }, this.SECRET_KEY, {
            expiresIn: "2 days"
        });
    }

    public validateToken() {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const token = req.header('Authorization')?.replace('Bearer ', '');
                if (!token) {
                    throw new Error();
                }
                next();
            } catch (error) {
                res.status(401).json({msd: "Authentication failed"});
            }
        };
    }

}