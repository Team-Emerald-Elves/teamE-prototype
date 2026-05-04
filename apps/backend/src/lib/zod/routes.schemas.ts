import * as z from "zod";
import { UserRoles } from "@repo/database";
import { title } from "process";

const StatusEnum = z
    .enum(["not_started", "in_progress", "needs_review", "done", "expired"])
    .default("not_started");
const UserRoleEnum = z.enum(UserRoles);
const ActionEnum = z.enum(["list", "create", "edit", "delete"]);

export const notificationModel = z.object({
    id: z.uuid().optional(),
    createdAt: z.date().optional(),
    title: z.string(),
    employeeId: z.uuid().optional().optional(),
    public: z.boolean().optional().optional(),
    targetRoles: z.array(UserRoleEnum).default([]),
});

export const EmployeeDataModel = z.object({
    id: z.string().optional(),
    clerkUserId: z.string().optional(),
    uname: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    roles: UserRoleEnum.optional(),
    email: z.email().optional(),
    favorites: z.array(z.number()),
    favorite_links: z.array(z.string()),
});

export const DocumentContentModel = z.object({
    id: z.number(),
    name: z.string(),
    url: z.union([z.url().optional(), z.string().optional()]),
    content_owner: z.string(),
    lock: z.boolean().default(false),
    assigned_role: UserRoleEnum.optional(),
    expiration_date: z.coerce.date().optional(),
    mime_type: z.string().default("text/plain"),
    document_status: StatusEnum.default("not_started"),
    document_type: z.string(),
    favorite: z.boolean().default(false),
    //IDocumentContent
    documentID: z.number().optional(),
    filePayload: z.string().optional(),
});

export const DeleteDocumentContentModel = z.object({
    id: z.number(),
    name: z.string().optional(),
});

const LinkDataModel = z.object({
    id: z.uuid().optional(),
    link_name: z.string().optional(),
    url: z.url().optional(),
    owner: z.string().optional(),
});

//api.ts
export const UpdateLockBody = z.object({
    id: z.number(),
    status: z.boolean(),
});

export const UpdateLockBodyLink = z.object({
    id: z.string(),
    status: z.boolean(),
});

export const GetLockQuery = z.object({
    id: z.boolean(),
});

//content-employee-route.ts
export const ContentEmployeeModel = z.object({
    id: z.number(),
});

//create-employee.ts
export const CreateEmployeeModel = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.email(),
    uname: z.string(),
});

//edit-employee.ts
export const EditEmployeeModel = z.object({
    id: z.uuid(),
    uname: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    roles: z.array(z.string()).optional(),
    email: z.email().optional(),
});

//employee.ts //to test
export const ListEmployeesModel = z.object({
    action: z.string().optional(),
    id: z.string().optional(),
    uname: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
});

export const EmployeeRequestModel = z.object({
    action: ActionEnum.optional(),
    employeeData: z
        .object({
            id: z.string(),
        })
        .optional(),
});

//get-link-role.ts
export const LinkRoleModel = z.object({
    owner: z.string(),
});

//links.ts
export const LinkRequestGetModel = z.object({
    action: z.literal("list").optional(),
    link_name: z.string().optional(),
});

export const LinkRequestPostModel = z.object({
    action: ActionEnum.optional(),
    linkData: LinkDataModel.optional(),
});

export const UpdateFavoriteModel = z.object({
    id: z.number(),
    favorite: z.boolean(),
});

export const AiRequestModel = z.object({
    prompt: z.string(),
});

//layouts.ts
const LayoutDataModel = z.object({
    layout: z
        .array(
            z
                .object({
                    i: z.string(),
                    x: z.number(),
                    y: z.number(),
                    w: z.number(),
                    h: z.number(),
                })
                .passthrough(),
        )
        .optional(),
    activeWidgets: z.array(z.string()).optional(),
});

export const LayoutRequestPostModel = z.object({
    action: ActionEnum.optional(),
    layoutData: LayoutDataModel.optional(),
});

export const DismissNotificationModel = z.object({
    ids: z.array(z.string()),
});
