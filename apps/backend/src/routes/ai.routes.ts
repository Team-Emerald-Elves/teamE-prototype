import { getAuth } from "@clerk/express";
import * as express from "express"

const AiRouter = express.Router();

AiRouter.get("/find-doc", async (req: express.Request, res: express.Response) => {
    const { userId, isAuthenticated } = getAuth(req);
    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" });
    }
});

export default AiRouter