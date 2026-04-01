import express from "express";
import {prisma} from "../lib/prisma.ts";
import bodyParser from "body-parser";


interface IEmployee {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email?: string;
    roles?: string[];
}

function employeeRoute(req: express.Request, res: express.Response) {

    prisma.employee.findMany({
        orderBy: {
            name: "asc"
        }
    }).then((value) => {
        console.log("Employees returned")
        console.log("Employees: ", value);
    }, (err) => {
        console.error("[ERROR]", err);
    });

    let employee: IEmployee = {
        id: 0,
        firstName: "fname",
        lastName: "lname",
        username: "uname",
        email: "flname@company.com",
    }
    res.json(employee);
}

export default employeeRoute;