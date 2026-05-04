import express from "express";
import prisma from "@repo/database";

interface IData {
    owner: string;
}

async function linkRoleRoute(req: express.Request, res: express.Response) {
    try {
        const data = req.body as IData;

        const links = await prisma.links.findMany({
            where: {
                owner: data.owner,
            },
        });

        return res.json(links);
    } catch (err) {
        console.error("[ERROR]", err);
        return res.sendStatus(500);
    }
}

export default linkRoleRoute;
