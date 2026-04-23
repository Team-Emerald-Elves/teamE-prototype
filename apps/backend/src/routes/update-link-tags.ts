import express, {type Request, type Response} from "express";
import prisma from "@repo/database";

interface ILinkTagContent {
    id: string;
    meta_tags: string[];
}

async function linkTagUpdate(req: express.Request, res: express.Response) {

        const l: ILinkTagContent = req.body


        try {
            // Update contents for document.
            const newDoc = await prisma.links.update({
                where: {
                    id: l.id,
                },
                data: {
                    meta_tags: l.meta_tags,
                }
            })

            console.log("New link created: ", newDoc);


            if (!newDoc) {
                throw new Error(`Failed to update tags.`)
            }
            res.sendStatus(200)

        } catch (error) {
            console.error("Update document error:", error);

            res.status(500).json({
                message: "Error modifying document",
                error: String(error),
            });
        }
    }

    export default linkTagUpdate;