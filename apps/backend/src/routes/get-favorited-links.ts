import express from "express";
import prisma from "@repo/database";
import { getAuth } from "@clerk/express";

async function favoriteLinksRoute(req: express.Request, res: express.Response) {
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
                favorite_links: true,
            },
        });

        const favoriteIds = employee.favorite_links;
        //check if they have favorites
        if (favoriteIds.length === 0) {
            return res.json([]);
        }


        // get the documents that are in the favorite list
        const links = await prisma.links.findMany({
            where: {
                id: { in: favoriteIds },
            },
        });

        const result = links.map(link => ({
            ...link,
            favorite: true,
        }));

        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to fetch favorites" });
    }
}

export default favoriteLinksRoute;