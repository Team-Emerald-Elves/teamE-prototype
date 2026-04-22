import express from "express";
import prisma, {type Employee} from "@repo/database";
import { clerkClient } from "@clerk/express";

import { ListEmployeesModel, EmployeeRequestModel } from '../lib/zod/routes.schemas.ts';
import { validate } from '../lib/zod/middleware.ts';

import path from "path";
import {buildWhereClause} from "../lib/filters.ts";

const employeeRoute = express()

interface EmployeeRequest{
    action: 'list' | 'create' | 'edit' | 'delete';
    employeeData: Partial<Employee> | undefined;
}

employeeRoute.post('/', validate(ListEmployeesModel), (req: express.Request, res: express.Response)=> {
    const {action} = req.query;
    const {id, uname, first_name, last_name, email} = req.query as Partial<Employee>
    if (!action || action === 'list') {
        listEmployees({id, uname, first_name, last_name, email}, req, res);
        return;
    }
    res.status(200).json({
        error: "INVALID_EMPLOYEE_QUERY"
    })
})

employeeRoute.post('/', validate(EmployeeRequestModel), (req: express.Request, res: express.Response) => {
    const eReq: EmployeeRequest = req.body as EmployeeRequest;

    if (eReq.action == "list") {
        eReq.employeeData!.roles = undefined
        listEmployees(eReq.employeeData!, req, res);
        return;
    }

    if (!eReq.employeeData) {
        res.status(400).json({
            error: "INVALID_EMPLOYEE_DATA"
        });
        return;
    }

    if (eReq.action == "create") {
        createEmployee(eReq.employeeData, res);
        return;
    }

    if (eReq.action == "edit") {
        editEmployee(eReq.employeeData, res);
        return;
    }

    if (eReq.action == "delete") {
        deleteEmployee(eReq.employeeData, res);
        return;
    }

    // No/invalid action
    res.status(400).json({
        error: "INVALID_ACTION"
    });

})

function createEmployee(eData: Partial<Employee>, res: express.Response) {
    if (!eData.uname ||
        !eData.first_name ||
        !eData.last_name) {
        res.status(400).json({
            error: "INVALID_EMPLOYEE_DATA"
        });
        return;
    }


    prisma.employee.create({
        data: eData
    }).then((result: Employee) => {
        console.log(`Successfully created employee: ${result.uname}`);
        res.status(200).json(result); // Success
    }, (err) => {
        console.error(`[ERROR] Failed to create employee with error: ${err}`);
        res.sendStatus(500); // Failed
    })
}

async function editEmployee(eData: Partial<Employee>, res: express.Response) {
    console.log(eData)

    if (!eData.id) {
        res.status(400).send("INVALID_EMPLOYEE_DATA");
    }

    try {
        const employee: Employee = await prisma.employee.update({
            where: {
                id: eData.id,
            },
            data: eData,
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

async function deleteEmployee(eData: Partial<Employee>, res: express.Response) {
    console.log(eData)

    if (!eData.id) {
        res.status(400).send("INVALID_EMPLOYEE_DATA");
    }

    try {
        const bucket = await prisma.bucketMeta.delete({
            where: {
                employeeId : eData.id,
            },
        });
        const employee: Employee = await prisma.employee.delete({
            where: {
                id: eData.id,
            },
        });
        if (!bucket) {
            res.status(400).send({
                error: "Employee not found",
            })
        }
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

async function listEmployees(eData: Omit<Partial<Employee>, 'roles'> | undefined, req: express.Request, res: express.Response) {

    try {
        console.log(req.body)
        const whereClauseReg = buildWhereClause(req.body, {})

        const employees = await prisma.employee.findMany({
            where: whereClauseReg,
            orderBy: {
                first_name: "asc",
            },
        });

        const defaultImage = "/public/default-avatar.png";

        const enriched = await Promise.all(
            employees.map(async (emp: Employee) => {
                try {
                    if (!emp.clerkUserId) {
                        return {
                            ...emp,
                            imageUrl: defaultImage,
                        };
                    }

                    const user = await clerkClient.users.getUser(emp.clerkUserId);

                    return {
                        ...emp,
                        imageUrl: user.imageUrl || defaultImage,
                    };
                } catch (err) {
                    // fallback if Clerk user doesn't exist
                    return {
                        ...emp,
                        imageUrl: defaultImage,
                    };
                }
            })
        );

        return res.json(enriched);
    } catch (err) {
        console.error("[ERROR]", err);
        return res.sendStatus(500);
    }

}


export default employeeRoute;