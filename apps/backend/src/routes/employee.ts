import express from "express";
import {prisma} from "../lib/prisma.ts";


interface IEmployee {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email?: string;
    roles?: string[];
}

function employeeRoute(req: express.Request, res: express.Response) {

    prisma.employee.findMany({
        orderBy: {
            first_name: "asc"
        }
    }).then((value) => {
        res.json(value);
    }, (err) => {
        console.error("[ERROR]", err);
    });

}

export default employeeRoute;