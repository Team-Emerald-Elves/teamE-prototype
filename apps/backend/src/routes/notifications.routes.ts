import { Router, type Request, type Response } from 'express'
import validate from '../lib/zod/middleware.ts'
import { notificationModel } from '../lib/zod/routes.schemas.ts'
import { getAuth, clerkClient } from '@clerk/express'
import prisma, {Prisma, type Employee, type Notification, type UserRoles} from '@repo/database'
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

            const notifications: Notification[] = await prisma.notification.findMany({
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

            const updatedNotifications = await Promise.all(
                notifications.map(async (n) => {
                    if (!n.public || !n.creatorId) {
                        return n;
                    }

                    const creator = await clerkClient.users.getUser(n.creatorId);

                    return {
                        ...n,
                        profileIcon: creator.imageUrl,
                    };
                })
            );

            if (updatedNotifications.length > 0) {
                return res.status(200).json(updatedNotifications);
            }

            return res.status(404).json({ message: "No notifications found." });

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
    '/create-notification',
    validate(notificationModel),
    async (req: Request, res: Response) => {
        const { userId, isAuthenticated } = getAuth(req);

        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        try {
            const notification = await prisma.notification.create({
                data: {
                    ...req.body,
                    creatorId: userId
                }
            });

            const targetRoles: UserRoles[] = notification.targetRoles;


            await prisma.employee.updateMany({
                where: {
                    roles: {
                        hasSome: targetRoles
                    }
                },
                data: {
                    unreadNotif: true
                }
            });

            return res.status(200).json({message: "Notification created", notification});

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Failed to create notification"
            });
        }
    }
);

export default notifyRouter