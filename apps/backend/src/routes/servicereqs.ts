import express from "express";

interface IServiceRequest {
    id?: number;
    created_at?: number;
    assigned_at?: string;
    assigned_id?: string;
    creator_id?: string;
    description: string;
}

function serviceReqRoute(req: express.Request, res: express.Response) {
    res.send("service request");
}

export default serviceReqRoute;