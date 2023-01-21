import { injectable } from 'inversify';
import * as mssql from "mssql";
require('dotenv').config();
import "reflect-metadata";

@injectable()
export class StorageDta {
    // private connection = `Server=${process.env.IP_CONNECTION},${process.env.PORT};Database=${process.env.DATABASE_NAME};User Id=${process.env.USER_DATABASE};Password=${process.env.PASSWORD_DATABASE}`;
    private sqlConfig: any = {
        user: process.env.USER_DATABASE,
        password: process.env.PASSWORD_DATABASE,
        database: process.env.DATABASE_NAME,
        server: process.env.IP_CONNECTION,
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 120000
        },
        options: {
          encrypt: false, // for azure
          trustServerCertificate: false // change to true for local dev / self-signed certs
        }
      }
    constructor() {}

    public async stock() {
        try {
            await mssql.connect(this.sqlConfig);
            const result = await mssql.query(`SELECT TT0.Fecha, TT0.Referencia, TT0.Bodega, CONVERT(NUMERIC(16,2),TT0.Unidades/TT0.Cajas) [Unidades] FROM (
                SELECT 
                CONVERT(DATE,GETDATE())	[Fecha],
                T0.ItemCode				[Referencia],
                T0.Warehouse			[Bodega],
                SUM(T0.InQty-T0.OutQty) [Unidades],
                T1.SalPackUn			[Cajas]
                FROM B1_OinmWithBinTransfer T0 
                INNER JOIN OITM T1 ON T0.ItemCode = T1.ItemCode
                WHERE 
                T0.DocDate <= GETDATE() AND 
                T1.ItmsGrpCod IN (102,113) AND 
                T0.Warehouse = '01' AND 
                T1.validFor = 'Y'
                GROUP BY T0.ItemCode, T0.Warehouse, T1.SalPackUn
                UNION ALL 
                SELECT 
                CONVERT(DATE,GETDATE())	[Fecha],
                T0.ItemCode				[Referencia],
                T0.Warehouse			[Bodega],
                SUM(T0.InQty-T0.OutQty) [Unidades],
                T1.SalPackUn			[Cajas]
                FROM B1_OinmWithBinTransfer T0 
                INNER JOIN OITM T1 ON T0.ItemCode = T1.ItemCode
                WHERE 
                T0.DocDate <= GETDATE() AND 
                T1.ItmsGrpCod IN (102,113) AND 
                T0.Warehouse = '12' AND 
                T1.validFor = 'Y'
                GROUP BY T0.ItemCode, T0.Warehouse, T1.SalPackUn
                ) TT0 WHERE TT0.Unidades > 0`);
            return result.recordset;
        } catch (error) {
            throw {
                error
            }
        }
    }

    public async dailySell(startDate: string, endDate: string) {
        try {
            const pool = await mssql.connect(this.sqlConfig);
            const result = await pool.request()
                .input("Fecha_Inicial", mssql.SmallDateTime, startDate)
                .input("Fecha_Final",mssql.SmallDateTime, endDate)
                .execute("Ventas_Princing");
            return result?.recordset || [];
        } catch (error) {
            console.error(error);
            throw {
                error
            }
        }
    }
    
}