import { Router, type Request, type Response } from "express";
import validate from "../lib/zod/middleware.ts";
import {
  notificationModel,
  DismissNotificationModel,
} from "../lib/zod/routes.schemas.ts";
import { getAuth, clerkClient } from "@clerk/express";
import prisma, {
  Prisma,
  type Employee,
  type Notification,
  type UserRoles,
} from "@repo/database";

const notifyRouter: Router = Router();

const clerkUserImageCache = new Map<string, string>();

notifyRouter.get(
  "/get-notifications",
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
          DismissedNotifs: true,
          unreadNotif: true,
        },
      });

      if (!employee) {
        return res.status(404).json({
          message: "Employee doesn't exist as a record in the database.",
        });
      }

      const notifications: Notification[] = await prisma.notification.findMany({
        where: {
          OR: [
            {
              employeeId: employee.id,
            },
            {
              public: true,
              targetRoles: {
                hasSome: employee.roles,
              },
            },
          ],
          id: {
            notIn: employee.DismissedNotifs,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const creatorIds = [
        ...new Set(
          notifications
            .filter((n) => n.public && n.creatorId)
            .map((n) => n.creatorId as string),
        ),
      ];

      await Promise.all(
        creatorIds.map(async (creatorId) => {
          if (clerkUserImageCache.has(creatorId)) {
            return;
          }

          const creator = await clerkClient.users.getUser(creatorId);
          clerkUserImageCache.set(creatorId, creator.imageUrl);
        }),
      );

      const updatedNotifications = notifications.map((n) => {
        if (!n.public || !n.creatorId) {
          return n;
        }

        return {
          ...n,
          profileIcon: clerkUserImageCache.get(n.creatorId),
        };
      });

      return res.status(200).json({
        Notifications: updatedNotifications,
        newNotifications: employee.unreadNotif,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(error.message);
      } else {
        console.error(error);
      }

      return res.status(500).json({
        message: "check backend server log.",
      });
    }
  },
);

notifyRouter.post("/set-read", async (req: Request, res: Response) => {
  const { userId, isAuthenticated } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    await prisma.employee.update({
      where: {
        clerkUserId: userId,
      },
      data: {
        unreadNotif: false,
      },
    });

    return res.status(200).json({
      message: "Notifications marked as read.",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    return res.status(500).json({
      message: "check backend server log.",
    });
  }
});

notifyRouter.post(
  "/create-notification",
  validate(notificationModel),
  async (req: Request, res: Response) => {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const employee: Employee | null = await prisma.employee.findUnique({
        where: {
          clerkUserId: userId,
        },
      });

      if (!employee) {
        return res.status(404).json({
          message: "Employee doesn't exist as a record in the database.",
        });
      }

      const notification = await prisma.notification.create({
        data: {
          ...req.body,
          creatorId: userId,
          employee: {
            connect: {
              id: employee.id,
            },
          },
        },
      });

      const targetRoles: UserRoles[] = notification.targetRoles;

      if (notification.public) {
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
      } else if (notification.employeeId) {
        await prisma.employee.update({
          where: {
            id: notification.employeeId,
          },
          data: {
            unreadNotif: true,
          },
        });
      }

      return res.status(200).json({
        message: "Notification created",
        notification,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(error.message);
      } else {
        console.error(error);
      }

      return res.status(500).json({
        error: "Failed to create notification",
      });
    }
  },
);

notifyRouter.post(
  "/dismiss-notifications",
  validate(DismissNotificationModel),
  async (req: Request, res: Response) => {
    const { userId, isAuthenticated } = getAuth(req);
    const { ids } = req.body as { ids: string[] };

    if (!isAuthenticated) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const employee = await prisma.employee.findUnique({
        where: {
          clerkUserId: userId,
        },
        select: {
          DismissedNotifs: true,
        },
      });

      if (!employee) {
        return res.status(404).json({
          message: "Employee doesn't exist as a record in the database.",
        });
      }

      const uniqueDismissedNotifs = [
        ...new Set([...employee.DismissedNotifs, ...ids]),
      ];

      await prisma.employee.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          DismissedNotifs: {
            set: uniqueDismissedNotifs,
          },
        },
      });

      return res.status(200).json({
        message: "Successfully dismissed notifications.",
        dismissedNotificationIds: uniqueDismissedNotifs,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(error.message);
      } else {
        console.error(error);
      }

      return res.status(500).json({
        message: "check backend server log.",
      });
    }
  },
);

export default notifyRouter;