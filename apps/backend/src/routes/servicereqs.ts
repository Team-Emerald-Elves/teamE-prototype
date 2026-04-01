import express from "express";

interface IServiceRequest {
    //
}

function serviceReqRoute(req: express.Request, res: express.Response) {
    res.send("service request");
}

export default serviceReqRoute;