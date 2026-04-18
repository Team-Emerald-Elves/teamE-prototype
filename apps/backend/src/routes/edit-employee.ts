import express from "express";
import {prisma} from "../lib/prisma.ts";
import {type Employee} from "../lib/prismadefs.ts"



interface IEditEmployeeRequest {
    id: string;
    uname: string | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    roles: string[] | undefined;
    email: string | undefined;
}

async function editEmployeeRoute(req: express.Request, res: express.Response) {
    const ereq: IEditEmployeeRequest = req.body as IEditEmployeeRequest;
    try {
        const employee: Employee = await prisma.employee.update({
            where: {
                id: ereq.id,
            },
            data: ereq,
        });

        if (!employee) {
            res.status(400).send({
                error: "Employee not found",
            })
        }

        res.status(200).send(employee);
    } catch (error) {
        res.status(400).send(error);
    }
}

export default editEmployeeRoute;