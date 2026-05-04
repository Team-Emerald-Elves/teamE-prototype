import Router, { type Request, type Response } from "express";
import { getAuth, type EmailAddress } from "@clerk/express";
import {
    UpdateLockBody,
    GetLockQuery,
    AiRequestModel,
} from "../lib/zod/routes.schemas.ts";
import validate from "../lib/zod/middleware.ts";
import prisma, { Prisma, type Employee } from "@repo/database";
import { Resend } from "resend";
import AiRouter from "./ai.routes.ts";
import { clerkCache } from "../lib/ecache.ts";
import {type Employee} from "@repo/database/types";

const APIRouter = Router();

APIRouter.get("/me", async (req, res) => {
    // Use `getAuth()` to get the user's `userId`
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const clerkUser = await clerkCache.getUser(userId!);

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

        const { userId, isAuthenticated } = getAuth(req);

        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const employee = await prisma.employee.findFirstOrThrow({
            where: {
                clerkUserId: userId,
            },
        });

        await prisma.documentContent.update({
            where: {
                id: id,
            },
            data: {
                lock: status ? employee.id : "none",
                lock_name: employee.first_name + " " + employee.last_name,
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

export async function invite(employee: Employee, password: string, ) {
    const resend = new Resend(process.env.RESEND_KEY!);

    const eRes = await resend.emails.send({
        from: `Hanover <${process.env.INVITE_EMAIL}>`,
        to: employee.email as string,
        subject: "Invited",
        html: `<p>Hello ${employee.first_name} ${employee.last_name}!<br> Please use the following credentials to login to iBank: <br> Username - ${employee.uname} <br> Temp Password - ${password} <br> Make sure to change your password right away!</p>`,
    });
    if (eRes.error) {
        console.log("Email invite error: ", JSON.stringify(eRes));
        return false;
    }
    return true;
}

APIRouter.put("/update-lock", validate(UpdateLockBody), updateLock);
APIRouter.get("/get-lock", validate(GetLockQuery), getLock);
APIRouter.use("/ai", validate(AiRequestModel), AiRouter);

export default APIRouter;
