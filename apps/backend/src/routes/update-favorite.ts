import express from "express";
import {getAuth} from "@clerk/express";
import prisma from "@repo/database";

interface IUpdateFavoriteRequest {
    id: number;
    favorite: boolean;
}

async function updateFavoriteRoute(req: express.Request, res: express.Response) {
    const dreq: IUpdateFavoriteRequest = req.body as IUpdateFavoriteRequest;
    //get clerk id for currently signed in employee
    const { userId, isAuthenticated } = getAuth(req)
    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" })
    }
    try {
        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId
            },
        })
        //check favorite, if favorite is true we need to add to the list, if it is false we need to delete from list
            if (dreq.favorite) {
                const data = await prisma.employee.update({
                    where: {
                        id: employee.id,
                    },
                    data: {
                        favorites: {
                            push: dreq.id,
                        },
                    },
                });

                res.status(200).send(data);
            }
            else {
                const updatedFavorites = employee.favorites.filter(
                    (fav) => fav !== dreq.id
                );
                const data = await prisma.employee.update({
                    where: {
                        id: employee.id,
                    },
                    data: {
                        favorites: updatedFavorites,
                    },
                });
                res.status(200).send(data);
            }

    } catch (error) {
        res.status(400).send(error);
    }
}

export default updateFavoriteRoute;