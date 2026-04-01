import express from "express";
import { prisma } from "../lib/prisma";

function assignedRoute(req: express.Request, res: express.Response) {
    res.send("assigned");
}

export default assignedRoute;