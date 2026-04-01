import express from "express";

function assignedRoute(req: express.Request, res: express.Response) {
    res.send("assigned");
}

export default assignedRoute;