import express from "express";
import prisma, { Prisma, type UserRoles, type Employee } from "@repo/database"


async function editEmployeeRoute(req: express.Request, res: express.Response) {
    const ereq: Employee = req.body as Employee;
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
        if (error instanceof Prisma.PrismaClientKnownRequestError)
        res.status(400).send(error.message);
    }
}

export default editEmployeeRoute;