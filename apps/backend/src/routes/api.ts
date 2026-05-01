import Router, { type Request, type Response } from "express";
import {
    requireAuth,
    getAuth,
    clerkClient,
    type EmailAddress,
} from "@clerk/express";
import { UpdateLockBody, GetLockQuery } from "../lib/zod/routes.schemas.ts";
import validate from "../lib/zod/middleware.ts";
import prisma, { Prisma, type Employee } from "@repo/database";
import { Resend } from "resend";

const APIRouter = Router();

APIRouter.get("/me", requireAuth(), async (req, res) => {
    // Use `getAuth()` to get the user's `userId`
    const { userId, isAuthenticated } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId as string);

    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    // id: string;
    // clerkUserId: string | null;
    // uname: string;
    // first_name: string;
    // last_name: string;
    // roles: UserRoles[];
    // email: string | null;

    try {
        if (!clerkUser)
            throw new Error("Authenticated user doesn't exist in clerk.");

        const currentUser: Employee = await prisma.employee.upsert({
            where: { clerkUserId: userId, uname: clerkUser.username as string },
            update: {},
            create: {
                clerkUserId: userId,
                uname: clerkUser.username as string,
                first_name: clerkUser.firstName ?? "firstname",
                last_name: clerkUser.lastName ?? "lastname",
                roles: ["UnderWriter"],
                bucket: {
                    create: {
                        public: true, // Resources avaliable to public.
                        file_size_limit: 52428800, // 50MB
                    },
                },
                email:
                    clerkUser.primaryEmailAddress?.emailAddress ??
                    "example@email.com",
            },
        });

        return res.status(200).json(currentUser);
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.log(error.code, error.message);
        }
        res.status(403).json({
            message: `Employee in clerk but missing supabase record. (${error})`,
        });
    }
});

async function updateLock(req: Request, res: Response) {
    try {
        const { id, status } = req.body ?? {};

        console.log("BODY:", req.body);
        console.log("TYPES:", {
            id: typeof req.body?.id,
            status: typeof req.body?.status,
        });

        if (typeof id !== "number" || typeof status !== "boolean") {
            return res.status(400).json({
                message:
                    "Invalid body. Expected { id: number, status: boolean }",
            });
        }
        const { userId, isAuthenticated } = getAuth(req);
        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId,
            },
        });
        if (status) {
            await prisma.documentContent.update({
                where: {
                    id: id,
                },
                data: {
                    lock: employee.id,
                },
            });
            const event = await prisma.calendarEvents.findFirstOrThrow({
                where: {
                    doc_id: id,
                },
            });
            await prisma.calendarEvents.update({
                where: {
                    id: event.id,
                },
                data: {
                    lock: employee.id,
                },
            });
        } else {
            await prisma.documentContent.update({
                where: {
                    id: id,
                },
                data: {
                    lock: "none",
                },
            });
            const event = await prisma.calendarEvents.findFirstOrThrow({
                where: {
                    doc_id: id,
                },
            });
            await prisma.calendarEvents.update({
                where: {
                    id: event.id,
                },
                data: {
                    lock: "none",
                },
            });
        }

        return res.status(200).json({ id, status });
    } catch (error) {
        return res.status(500).json({ message: "Failed to update lock" });
    }
}

async function getLock(req: Request, res: Response) {
    const id = Number(req.query.id);

    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid id" });
    }

    try {
        const data = await prisma.documentContent.findFirst({
            where: {
                id: id,
            },
        });

        return res.status(200).json(data?.lock);
    } catch (error) {
        return res.status(500).json({ message: "Failed to get lock", error });
    }
}

export async function invite(email: string, password: string) {
    const resend = new Resend(process.env.RESEND_KEY!);

    const eRes = await resend.emails.send({
        from: `Hanover <${process.env.INVITE_EMAIL}>`,
        to: email,
        subject: "Invited",
        html: `<p>Congrats on sending your <strong>Email test!<br></strong> Your password:${password}</p>`,
    });
    if (eRes.error) {
        console.log("Email invite error: ", JSON.stringify(eRes));
        return false;
    }
    return true;
}

APIRouter.put("/update-lock", validate(UpdateLockBody), updateLock);
APIRouter.get("/get-lock", validate(GetLockQuery), getLock);

export default APIRouter;
