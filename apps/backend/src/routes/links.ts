import express from "express";
import prisma, { type Links } from "@repo/database";
import { getAuth } from '@clerk/express'

import { LinkRequestGetModel, LinkRequestPostModel } from '../lib/zod/routes.schemas.ts';
import { validate } from '../lib/zod/middleware.ts';

const linkRoute = express()



interface LinkRequest {
    action: 'list' | 'create' | 'edit' | 'delete';
    linkData: Partial<Links> | undefined;
}

linkRoute.get('/', validate(LinkRequestGetModel), (req: express.Request, res: express.Response)=> {
    const {action} = req.query;
    const {link_name} = req.query as Links;
    if (!action || action === 'list') {
        listLinks(req, {link_name}, res);
        return;
    }
    res.status(200).json({
        error: "INVALID_LINKS_QUERY"
    })
})

linkRoute.post('/', validate(LinkRequestPostModel), (req: express.Request, res: express.Response) => {
    console.log("BODY: ", req.body)
    const lReq: LinkRequest = req.body as LinkRequest;

    if (!lReq) {
        res.status(400).json({
            error: "INVALID_LINKS_POST"
        })
    }


    if (lReq.action == "list") {
        listLinks(req, lReq.linkData!, res);
        return;
    }

    if (!lReq.linkData) {
        res.status(400).json({
            error: "INVALID_EMPLOYEE_DATA"
        });
        return;
    }

    if (lReq.action == "create") {
        createLink({
            link_name: lReq.linkData.link_name!,
            url: lReq.linkData.url!,
            owner: lReq.linkData.owner
        }, res);
        return;
    }

    if (lReq.action == "edit") {
        editLink(lReq.linkData, res);
        return;
    }

    if (lReq.action == "delete" && lReq.linkData.id) {
        deleteLink(lReq.linkData, res);
        return;
    }

    // No/invalid action
    res.status(400).json({
        error: "INVALID_ACTION"
    });

})

async function listLinks(req: express.Request, lData: Partial<Links> | undefined, res: express.Response) {
    try {
        const { userId, isAuthenticated } = getAuth(req);

        if (!isAuthenticated) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        // 1. Get employee (for favorites)
        const employee = await prisma.employee.findFirst({
            where: {
                clerkUserId: userId
            },
            select: { favorite_links: true }
        });

        const favoritedIds = employee?.favorite_links || [];

        // 2. Get all links
        const links: Links[] = await prisma.links.findMany({
            where: lData,
            orderBy: {
                link_name: 'asc'
            }
        });

        // 3. Annotate with favorite flag
        const annotatedLinks = links.map(link => ({
            ...link,
            favorite: favoritedIds.includes(link.id)
        }));

        // 4. Sort: favorites first, then others (both already alphabetically sorted)
        annotatedLinks.sort((a, b) => {
            if (a.favorite === b.favorite) return 0;
            return a.favorite ? -1 : 1;
        });

        res.status(200).json(annotatedLinks);

    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: "INVALID_LINKS_QUERY"
        });
    }
}

async function createLink(lData: Partial<Links> & Pick<Links, 'link_name' | 'url'>, res: express.Response) {
    if (!lData ||
        !lData.link_name ||
        !lData.url) {
        res.status(400).json({
            error: "INVALID_LINKS_CREATION"
        })
        return;
    }
    try {
        const link: Links = await prisma.links.create({
            data: lData
        })

        res.status(200).json(link)
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: "INVALID_LINKS_CREATION"
        })
    }
}

async function editLink(lData: Partial<Links>, res: express.Response) {
    try {
        const link: Links = await prisma.links.update({
            where: {
                id: lData.id!
            },
            data: lData
        })
        res.status(200).json(link)
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: "INVALID_LINKS_EDIT"
        })
    }
}

async function deleteLink(lData: Partial<Links>, res: express.Response) {
    try {
        const link: Links = await prisma.links.delete({
            where: {
                id: lData.id!
            }
        })
        res.status(200).json(link)
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: "INVALID_LINKS_Delete"
        })
    }
}

export default linkRoute;