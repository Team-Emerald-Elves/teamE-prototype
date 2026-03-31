import express from "express";

function employeeRoute(req: express.Request, res: express.Response) {
    res.send("employee");
}

export default employeeRoute;