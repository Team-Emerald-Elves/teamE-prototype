import express, {type Express} from "express";
import {prisma} from "../lib/prisma.ts";

interface IEmployeeID {
    id: string;
    first_name?: string;
    last_name?: string;
    uname?: string;
    email?: string;
    roles?: string[];
}

function contentEmployeeRoute(req: express.Request, res: express.Response) {
    const employee: IEmployeeID = req.body as IEmployeeID;
    prisma.documentContent.findMany({
        where: {
            bucket: {
                employeeId: employee.id
            }
        }
    })
        .then((data) => {
        res.json(data)
    }).catch((err) => {
        console.log("Error: ", err)
    });
}
export default contentEmployeeRoute;