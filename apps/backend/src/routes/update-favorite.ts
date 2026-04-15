import express from "express";
import prisma from "@repo/database";

interface IUpdateFavoriteRequest {
    id: number;
    favorite: boolean;
}

async function updateFavoriteRoute(req: express.Request, res: express.Response) {
    const dreq: IUpdateFavoriteRequest = req.body as IUpdateFavoriteRequest;
    try {
        const data = await prisma.documentContent.update({
            where: {
                id: dreq.id,
            },
            data: {
                favorite: !dreq.favorite,
            },
        });

        res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
}

export default updateFavoriteRoute;