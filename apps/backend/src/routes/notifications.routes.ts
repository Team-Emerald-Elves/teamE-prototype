import { Router, type Request, type Response } from "express";
import validate from "../lib/zod/middleware.ts";
import { notificationModel } from "../lib/zod/routes.schemas.ts";
import { getAuth } from "@clerk/express";
import prisma, {
    Prisma,
    type Employee,
    type Notification,
    type UserRoles,
} from "@repo/database";
import {
    DismissNotificationModel
} from '../lib/zod/routes.schemas.ts'
import { useResponsiveLayout } from "react-grid-layout";
import { clerkCache } from "../lib/ecache.ts";

const notifyRouter: Router = Router();

notifyRouter.get(
    "/get-notifications",
    // requireAuth()
    async (req: Request, res: Response) => {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const employee = await prisma.employee.findUnique({
            where: {
                clerkUserId: userId,
            },
            select: {
                id: true,
                roles: true,
                clerkUserId: true,
                DismissedNotifs: true
            },
        });

        if (!employee) return res.status(404).json({message: "Employee doesn't exist as a record in the database."})

        const notifications: Notification[] =
            await prisma.notification.findMany({
                where: {
                    OR: [
                        {
                            employeeId: employee?.id,
                        },
                        {
                            public: true,
                            targetRoles: {
                                hasSome: employee?.roles,
                            },
                        },
                    ],
                    id: {
                        notIn: employee?.DismissedNotifs
                    }
                },
                orderBy: {
                    createdAt: "desc",
                },
        });

        await prisma.employee.update({
            where: {
                clerkUserId: userId
            },
            data: {
                unreadNotif: false
            }
        })

        const user = await clerkClient.users.getUser(
        const user = await clerkCache.getUser(
            employee?.clerkUserId as string,
        );

        const updatedNotifications = await Promise.all(
            notifications.map(async (n) => {
                if (!n.public || !n.creatorId) {
                    return n;
                }

                const creator = await clerkCache.getUser(n.creatorId);

                return {
                    ...n,
                    profileIcon: creator.imageUrl,
                };
            }),
        );

        if (updatedNotifications.length > 0) {
            return res.status(200).json(updatedNotifications);
        }

        return res.status(404).json({ message: "No notifications found." });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError)
            console.error(error.message);
        else console.error(error);
        return res.status(500).json({ message: "check backend server log." });
    }
});

// Create notifications.

notifyRouter.post(
    "/create-notification",
    validate(notificationModel),
    async (req: Request, res: Response) => {
        const { userId, isAuthenticated } = getAuth(req);

        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        try {

            const employee: Employee | null = await prisma.employee.findUnique({where:{clerkUserId: userId}})

            if (!employee) return res.status(404).json({message: "Employee doesn't exist as a record in the database."})

            const notification = await prisma.notification.create({
                data: {
                    ...req.body,
                    creatorId: userId,
                    employee: employee
                },
            });

            const targetRoles: UserRoles[] = notification.targetRoles;

            await prisma.employee.updateMany({
                where: {
                    roles: {
                        hasSome: targetRoles,
                    },
                },
                data: {
                    unreadNotif: true,
                },
            });

            return res
                .status(200)
                .json({ message: "Notification created", notification });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Failed to create notification",
            });
        }
    },
);

// Dismiss notifications.

notifyRouter.post(
    '/dismiss-notifications',
    validate(DismissNotificationModel),
    // requireAuth(),
    async (req: Request, res: Response) => {
        
        const { userId, isAuthenticated } = getAuth(req);
        const { ids } = req.body

        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const employee = await prisma.employee.findUnique({
            where: {
                clerkUserId: userId
            },
            select: {
                DismissedNotifs: true
            }
        });

        if (!employee) return res.status(404).json({message: "Employee doesn't exist as a record in the database."})

        await prisma.employee.update({
            where: {
                clerkUserId: userId
            },
            data: {
                DismissedNotifs: {
                    set: [...new Set([...employee?.DismissedNotifs as string[], ...ids])]
                }
            }
        });

        res.status(200).json({message: `Successfully dismissed notifications: ${employee.DismissedNotifs}`})
    }
)

export default notifyRouter;
