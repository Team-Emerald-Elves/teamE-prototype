import express from "express";
import {prisma} from "../lib/prisma.ts";
import {type Employee} from "../lib/prismadefs.ts";

const employeeRoute = express()

interface EmployeeRequest{
    action: 'list' | 'create' | 'edit' | 'delete';
    employeeData: Partial<Employee> | undefined;
}

employeeRoute.get('/', (req: express.Request, res: express.Response)=> {
    const {action} = req.query;
    const {id, uname, first_name, last_name, email} = req.query as Partial<Employee>
    if (!action || action === 'list') {
        listEmployees({id, uname, first_name, last_name, email}, res);
        return;
    }
    res.status(200).json({
        error: "INVALID_EMPLOYEE_QUERY"
    })
})

employeeRoute.post('/', (req: express.Request, res: express.Response) => {
    const eReq: EmployeeRequest = req.body as EmployeeRequest;

    if (eReq.action == "list") {
        eReq.employeeData!.roles = undefined
        listEmployees(eReq.employeeData!, res);
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

function listEmployees(eData: Omit<Partial<Employee>, 'roles'> | undefined, res: express.Response) {


    prisma.employee.findMany({
        orderBy: {
            first_name: "asc"
        },
        where: eData,
    }).then((value) => {
        res.json(value);
    }, (err) => {
        console.error("[ERROR]", err);
        res.sendStatus(500);
    });

}

export default employeeRoute;