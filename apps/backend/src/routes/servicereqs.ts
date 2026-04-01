import express from "express";
import { prisma } from "../lib/prisma";

function serviceReqRoute(req: express.Request, res: express.Response) {
    res.send("service request");
}

export default serviceReqRoute;