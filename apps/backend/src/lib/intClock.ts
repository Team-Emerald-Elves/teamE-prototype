import prisma, { UserRoles, type documentContent } from "@repo/database";

const FULLDAY: number = 8.64e7;

const expiringDocuments = async () => {

    const now = new Date();
    const oneDayFromNow = new Date(Date.now() + FULLDAY);

    const documents: documentContent[] = await prisma.documentContent.findMany({
        where: {
            expiration_date: {
                gte: now,
                lte: oneDayFromNow,
            },
            expiration_warn: false,
        },
    });

    if (documents.length < 1) return;
    console.log(`Creating ${documents.length} notifications.`);

    await prisma.documentContent.updateMany({
        where: {
            id: {
                in: documents.map((doc) => doc.id),
            },
        },
        data: {
            expiration_warn: true,
        },
    });

    await Promise.all(
        documents.map(async (doc: documentContent) => {
            await prisma.notification.create({
                data: {
                    title: `${doc.name.substring(0, 14) + (doc.name.length >= 12 ? "..." : "")} is expiring tomorrow!`,
                    public: true,
                    targetRoles: [
                        doc.assigned_role as UserRoles,
                        "Administrator",
                    ],
                },
            });
            const targetRoles: UserRoles[] = [
                ...(doc.assigned_role ? [doc.assigned_role] : []),
                UserRoles.Administrator,
            ];

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
        }),
    );
}

const fullyDismissedNotifications = async () => {
  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      roles: true,
      DismissedNotifs: true,
      Notifications: {
        where: {
          public: false,
        },
        select: {
          id: true,
        },
      },
    },
  });

  const publicNotifications = await prisma.notification.findMany({
    where: {
      public: true,
    },
    select: {
      id: true,
      targetRoles: true,
    },
  });

  const notificationIdsToDelete = new Set<string>();

  // 1. Delete private notifications dismissed by their assigned employee
  for (const employee of employees) {
    for (const notification of employee.Notifications) {
      if (employee.DismissedNotifs.includes(notification.id)) {
        notificationIdsToDelete.add(notification.id);
      }
    }
  }

  // 2. Delete public role notifications dismissed by everyone in the target role(s)
  for (const notification of publicNotifications) {
    const targetEmployees = employees.filter((employee) =>
      employee.roles.some((role) => notification.targetRoles.includes(role))
    );

    // Avoid deleting if no employees currently match the target roles
    if (targetEmployees.length === 0) {
      continue;
    }

    const dismissedByEveryone = targetEmployees.every((employee) =>
      employee.DismissedNotifs.includes(notification.id)
    );

    if (dismissedByEveryone) {
      notificationIdsToDelete.add(notification.id);
    }
  }

  const idsToDelete = [...notificationIdsToDelete];

  if (idsToDelete.length === 0) {
    return {
      deletedCount: 0,
      cleanedEmployeesCount: 0,
      deletedNotificationIds: [],
    };
  }

  // 3. Remove deleted notification IDs from every employee's DismissedNotifs list
  const employeeUpdates = employees
    .map((employee) => {
      const cleanedDismissedNotifs = employee.DismissedNotifs.filter(
        (notifId) => !notificationIdsToDelete.has(notifId)
      );

      return {
        employeeId: employee.id,
        cleanedDismissedNotifs,
        changed:
          cleanedDismissedNotifs.length !== employee.DismissedNotifs.length,
      };
    })
    .filter((employee) => employee.changed);

  const result = await prisma.$transaction(async (tx) => {
    const deleted = await tx.notification.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });

    await Promise.all(
      employeeUpdates.map((employee) =>
        tx.employee.update({
          where: {
            id: employee.employeeId,
          },
          data: {
            DismissedNotifs: {
              set: employee.cleanedDismissedNotifs,
            },
          },
        })
      )
    );

    return deleted;
  });

  return {
    deletedCount: result.count,
    cleanedEmployeesCount: employeeUpdates.length,
    deletedNotificationIds: idsToDelete,
  };
};

const intClock = async () => {

    await expiringDocuments()
    const removedNotifs = await fullyDismissedNotifications()

    if (removedNotifs.deletedCount > 0) console.log(`[InitClock] Deleted ${removedNotifs.deletedCount} notifications.`);
    if (removedNotifs.cleanedEmployeesCount > 0) console.log(`[InitClock] Cleaned up ${removedNotifs.cleanedEmployeesCount} employees.`);
    if (removedNotifs.deletedNotificationIds.length > 0) console.log(`[InitClock] Deleted notification IDs: ${removedNotifs.deletedNotificationIds.join(", ")}`);

};
export default intClock;
