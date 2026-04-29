import express from "express";
import prisma from "@repo/database";

interface ILinkTagContentRemove {
    id: string;
    tag: string;
}
async function linkTagDelete(req: express.Request, res: express.Response) {

    const l: ILinkTagContentRemove = req.body


    try {
        console.log(document)
        // Update contents for document.
        const doc = await prisma.links.findFirstOrThrow({
            where: {
                id: l.id,
            },
        })

        const updatedTags = (doc.meta_tags || []).filter(
            (t: string) => t !== l.tag
        );

        const newDoc = await prisma.links.update({
            where: {
                id: l.id,
            },
            data: {
                meta_tags: updatedTags,
            },
        });

        console.log("New doc created: ", newDoc);


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

export default linkTagDelete;