import express from "express";
import prisma, { Prisma } from "@repo/database";
import { getAuth } from "@clerk/express";
import type { Layout } from "react-grid-layout";

import { LayoutRequestPostModel } from "../lib/zod/routes.schemas.ts";
import { validate } from "../lib/zod/middleware.ts";

const layoutRoute = express();

interface LayoutData {
    layout?: Layout[];
    activeWidgets?: string[];
}

interface LayoutRequest {
    action: "list" | "create" | "edit" | "delete";
    layoutData: LayoutData | undefined;
}

layoutRoute.post("/", validate(LayoutRequestPostModel), (req: express.Request, res: express.Response) => {
    const lReq: LayoutRequest = req.body as LayoutRequest;

    if (!lReq) {
        res.status(400).json({ error: "INVALID_LAYOUT_POST" });
        return;
    }

    if (lReq.action == "list" || !lReq.action) {
        getLayout(req, res);
        return;
    }

    if (!lReq.layoutData) {
        res.status(400).json({ error: "INVALID_LAYOUT_DATA" });
        return;
    }

    if (lReq.action == "create" || lReq.action == "edit") {
        saveLayout(req, lReq.layoutData, res);
        return;
    }

    res.status(400).json({ error: "INVALID_ACTION" });
});

async function getLayout(req: express.Request, res: express.Response) {
    try {
        const { userId, isAuthenticated } = getAuth(req);
        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const employee = await prisma.employee.findFirst({
            where: { clerkUserId: userId },
            select: { id: true },
        });
        if (!employee) {
            return res.status(404).json({ error: "EMPLOYEE_NOT_FOUND" });
        }

        const layout = await prisma.layout.findFirst({
            where: { owner: employee.id },
        });
        if (!layout) {
            return res.status(200).json(null);
        }

        return res.status(200).json({
            layout: layout.layout,
            activeWidgets: layout.widgets,
            employeeId: employee.id,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "INVALID_LAYOUT_QUERY" });
    }
}

async function saveLayout(req: express.Request, lData: LayoutData, res: express.Response) {
    try {
        const { userId, isAuthenticated } = getAuth(req);
        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        const employee = await prisma.employee.findFirst({
            where: { clerkUserId: userId },
            select: { id: true },
        });
        if (!employee) {
            return res.status(404).json({ error: "EMPLOYEE_NOT_FOUND" });
        }

        const { layout, activeWidgets } = lData;
        if (!layout || !activeWidgets) {
            return res.status(400).json({ error: "INVALID_LAYOUT_SAVE" });
        }

        const existing = await prisma.layout.findFirst({
            where: { owner: employee.id },
        });

        const layoutJson = layout as unknown as Prisma.InputJsonValue;

        const saved = existing
            ? await prisma.layout.update({
                where: { id: existing.id },
                data: { layout: layoutJson, widgets: activeWidgets },
            })
            : await prisma.layout.create({
                data: { owner: employee.id, layout: layoutJson, widgets: activeWidgets },
            });

        return res.status(200).json({
            layout: saved.layout,
            activeWidgets: saved.widgets,
            employeeId: employee.id,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "INVALID_LAYOUT_SAVE" });
    }
}

export default layoutRoute;
