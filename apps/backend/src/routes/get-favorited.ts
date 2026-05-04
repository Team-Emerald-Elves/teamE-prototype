import express from "express";
import { getAuth } from "@clerk/express";
import prisma from "@repo/database";

async function favoriteRoute(req: express.Request, res: express.Response) {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        //get employee currently signed in
        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId,
            },
            select: {
                favorites: true,
            },
        });

        const favoriteIds = employee.favorites;
        //check if they have favorites
        if (favoriteIds.length === 0) {
            return res.json([]);
        }

        // get the documents that are in the favorite list
        const documents = await prisma.documentContent.findMany({
            where: {
                id: { in: favoriteIds },
            },
        });

        // get all contnet owner ids (need to convert to names)
        const ownerIds = [
            ...new Set(documents.map((doc) => doc.content_owner)),
        ] as string[];

        // get employees that are content owners
        const owners = await prisma.employee.findMany({
            where: {
                id: { in: ownerIds },
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
            },
        });

        // map ids to names for content owners
        const ownerMap = new Map(
            owners.map((o) => [o.id, `${o.first_name} ${o.last_name}`]),
        );

        // add the favorite as true (since these are all favorites)
        const result = documents.map((doc) => ({
            ...doc,
            content_owner:
                ownerMap.get(doc.content_owner as string) || "Unknown",
            favorite: true,
        }));

        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch favorites" });
    }
}

export default favoriteRoute;
