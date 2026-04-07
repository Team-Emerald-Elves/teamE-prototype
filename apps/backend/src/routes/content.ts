import express from "express";
import { prisma } from "../lib/prisma.ts";

function contentRoute(req: express.Request, res: express.Response) {
    prisma.content
        .findMany({
            orderBy: {
                name: "asc",
            },
        })
        .then(
            (value) => {
                res.json(value);
            },
            (err) => {
                console.error("[ERROR]", err);
                res.sendStatus(500);
            }
        );
}
export default contentRoute;
function contentEmployee(req: express.Request, res: express.Response) {
    let employee: IEmployeeID = req.body
    prisma.content.findFirst({where: {employeeId: employee.id}}).then((data) => {
        res.json(data)
    }).catch((err) => {
        console.log("Error: ", err)
    })

}