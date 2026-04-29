import express, {type Request, type Response} from "express";
import prisma, {type Employee} from "@repo/database";
import { getAuth, clerkClient } from "@clerk/express";


import { ListEmployeesModel, EmployeeRequestModel } from '../lib/zod/routes.schemas.ts';
import validate  from '../lib/zod/middleware.ts';

import path from "path";
import {buildWhereClause, buildWhereClausesEmployee} from "../lib/filters.ts";

const employeeRoute = express()

interface EmployeeRequest{
    action: 'list' | 'create' | 'edit' | 'delete';
    employeeData: Partial<Employee> | undefined;
}

employeeRoute.post('/', (req: express.Request, res: express.Response)=> {
    const {action} = req.query;
    const {id, uname, first_name, last_name, email} = req.query as Partial<Employee>
    const eReq: EmployeeRequest = req.body as EmployeeRequest;
    // if (!eReq.employeeData) {
    //     res.status(400).json({
    //         error: "INVALID_EMPLOYEE_DATA"
    //     });
    //     return;
    // }

    if (eReq.action == "create") {
        createEmployee(eReq.employeeData!, res);
        return;
    }

    if (eReq.action == "edit") {
        editEmployee(eReq.employeeData!, res);
        return;
    }

    if (eReq.action == "delete") {
        deleteEmployee(eReq.employeeData!, res);
        return;
    }

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

//checks if employee is a new user
employeeRoute.get('/new-user', async (req: express.Request, res: express.Response) => {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const employee = await prisma.employee.findFirst({
            where: { clerkUserId: userId },
            select: { newUser: true }
        });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        return res.status(200).json({ newUser: employee.newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to check new user status" });
    }
});

//dismiss manual popup-- no longer new user
employeeRoute.post('/new-user/dismiss', async (req: express.Request, res: express.Response) => {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const employee = await prisma.employee.updateMany({
            where: { clerkUserId: userId },
            data: { newUser: false }
        });

        return res.status(200).json({ message: "New user status cleared" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to update new user status" });
    }
});

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

        const whereClauseReg = buildWhereClausesEmployee(req.body, {})

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