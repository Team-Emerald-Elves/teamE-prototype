import type { User } from "@clerk/express";
import prisma, { UserRoles, type documentContent } from "@repo/database";

const FULLDAY: number = 8.64e7;

const intClock: Function = async () => {
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
            await prisma.notification.createMany({
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
                doc.assigned_role as UserRoles,
                "Administrator",
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
};
export default intClock;
