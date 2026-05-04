import express, { type Express } from "express";
import prisma from "@repo/database";

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
    // prisma.documentContent.findMany({
    //     where: {
    //         bucketId: {
    //             employeeId: employee.bucket!.id
    //         }
    //     }
    // })

    prisma.employee
        .findFirst({
            where: {
                id: employee.id,
            },
            select: {
                bucket: true,
            },
        })
        .then(async (data) => {
            const documents = await prisma.documentContent.findMany({
                where: {
                    bucketId: data?.bucket?.id,
                },
            });
            res.status(200).json(documents);
        })
        .catch((err) => {
            console.log("Error: ", err);
        });
}
export default contentEmployeeRoute;
