import express from "express";

interface IEmployee {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email?: string;
    roles?: string[];
}
function employeeRoute(req: express.Request, res: express.Response) {
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