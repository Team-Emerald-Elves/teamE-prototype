import { Router, type Request, type Response } from 'express'
import { validate } from '../lib/zod/middleware'
import { notificationModel } from '../lib/zod/routes.schemas'
import { getAuth, clerkClient } from '@clerk/express'
import prisma, { Prisma, type Employee, type Notification } from '@repo/database'
import { extend } from 'zod/mini'

const notifyRouter: Router = Router()

notifyRouter.get(
    '/get-notifications',
    async (req: Request, res: Response) => {
        const { userId, isAuthenticated } = getAuth(req)

        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" })
        }

        try {
            const employee = await prisma.employee.findUnique({
                where: {
                    clerkUserId: userId
                },
                select: {
                    id: true,
                    roles: true,
                    clerkUserId: true
                }
            })

            let notifications: Notification[] = await prisma.notification.findMany({
                where: {
                    OR: [
                        {
                            employeeId: employee?.id
                        },
                        {
                            public: true,
                            targetRoles: {
                                hasSome: employee?.roles
                            }
                        }
                    ]
                },
                orderBy: {
                    createdAt: "desc",
                },
            })

            const user = await clerkClient.users.getUser(employee?.clerkUserId as string)

            const updatedNotifications = notifications.map((n) => {
                return n.public ? { ...n, profileIcon: clerkClient.users.getUser(n.creatorId) }: n
            })

            if(notifications.length > 0)
                return res.status(200).json(notifications.push)
            else
                return res.status(404).json({message:'No notifcations found.'})

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
                console.error(error.message)
            else
                console.error(error)
            return res.status(500).json({message:'check backend server log.'})
        }
    }
)

notifyRouter.post(
    '/create-notifcation',
    validate(notificationModel),
    async (req: Request, res: Response) => {
        prisma.notification.create({
            data: req.body
        }).then((notifcation: Notification) => {
            return res.status(200).json({message:`Notifcation created: '${notifcation}'.`})
        }).catch((error) => {
            if (error instanceof Prisma.PrismaClientKnownRequestError)
                console.error("Prisma: " + error)
            else
                console.error(error)
        })
    }
)

export default notifyRouter