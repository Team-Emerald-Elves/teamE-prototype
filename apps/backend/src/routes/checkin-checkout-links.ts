import Router, { type Request, type Response } from "express"
import { getAuth, clerkClient, type EmailAddress } from '@clerk/express'
import { UpdateLockBodyLink, GetLockQuery } from '../lib/zod/routes.schemas.ts'
import validate from "../lib/zod/middleware.ts";
import prisma from "@repo/database";

const CheckoutLinks = Router()

async function updateLinkLock(req: Request, res: Response) {
    try {
        const { id, status } = req.body ?? {}

        if (typeof id !== "string" || typeof status !== "boolean") {
            return res.status(400).json({
                message: "Invalid body. Expected { id: string, status: boolean }"
            })
        }
        const {userId, isAuthenticated} = getAuth(req)
        if(!isAuthenticated) {
            return res.status(401).json({error: "Not authenticated"})
        }
        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId
            }
        })
        if(status){
            await prisma.links.update({
                where: {
                    id: id
                },
                data: {
                    lock: employee.id
                }
            })
        }
        else{
            await prisma.links.update({
                where: {
                    id: id
                },
                data: {
                    lock: "none"
                }
            })
        }

        return res.status(200).json({ id, status })
    } catch (error) {
        return res.status(500).json({ message: "Failed to update lock" })
    }
}

async function getLinkLock(req: Request, res: Response) {
    const id = req.query.id as string;

    if (!id) {
        return res.status(400).json({ message: "Invalid id" });
    }

    try {
        const data = await prisma.links.findFirst({
            where: {
                id: id
            }
        });

        return res.status(200).json(data?.lock);
    } catch (error) {
        return res.status(500).json({ message: "Failed to get lock", error });
    }
}


CheckoutLinks.put('/update-link-lock', validate(UpdateLockBodyLink), updateLinkLock)
CheckoutLinks.get('/get-link-lock', validate(GetLockQuery), (getLinkLock))

export default CheckoutLinks