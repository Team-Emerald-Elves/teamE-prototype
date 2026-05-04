"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DismissNotificationModel = exports.LayoutRequestPostModel = exports.AiRequestModel = exports.UpdateFavoriteModel = exports.LinkRequestPostModel = exports.LinkRequestGetModel = exports.LinkRoleModel = exports.EmployeeRequestModel = exports.ListEmployeesModel = exports.EditEmployeeModel = exports.CreateEmployeeModel = exports.ContentEmployeeModel = exports.GetLockQuery = exports.UpdateLockBodyLink = exports.UpdateLockBody = exports.DeleteDocumentContentModel = exports.DocumentContentModel = exports.EmployeeDataModel = exports.notificationModel = void 0;
var z = require("zod");
var database_1 = require("@repo/database");
var StatusEnum = z
    .enum(["not_started", "in_progress", "needs_review", "done", "expired"])
    .default("not_started");
var UserRoleEnum = z.enum(database_1.UserRoles);
var ActionEnum = z.enum(["list", "create", "edit", "delete"]);
exports.notificationModel = z.object({
    id: z.uuid().optional(),
    createdAt: z.date().optional(),
    title: z.string(),
    employeeId: z.uuid().optional().optional(),
    public: z.boolean().optional().optional(),
    targetRoles: z.array(UserRoleEnum).default([]),
});
exports.EmployeeDataModel = z.object({
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
exports.DocumentContentModel = z.object({
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
exports.DeleteDocumentContentModel = z.object({
    id: z.number(),
    name: z.string().optional(),
});
var LinkDataModel = z.object({
    id: z.uuid().optional(),
    link_name: z.string().optional(),
    url: z.url().optional(),
    owner: z.string().optional(),
});
//api.ts
exports.UpdateLockBody = z.object({
    id: z.number(),
    status: z.boolean(),
});
exports.UpdateLockBodyLink = z.object({
    id: z.string(),
    status: z.boolean(),
});
exports.GetLockQuery = z.object({
    id: z.boolean(),
});
//content-employee-route.ts
exports.ContentEmployeeModel = z.object({
    id: z.number(),
});
//create-employee.ts
exports.CreateEmployeeModel = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.email(),
    uname: z.string(),
});
//edit-employee.ts
exports.EditEmployeeModel = z.object({
    id: z.uuid(),
    uname: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    roles: z.array(z.string()).optional(),
    email: z.email().optional(),
});
//employee.ts //to test
exports.ListEmployeesModel = z.object({
    action: z.string().optional(),
    id: z.string().optional(),
    uname: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
});
exports.EmployeeRequestModel = z.object({
    action: ActionEnum.optional(),
    employeeData: z
        .object({
        id: z.string(),
    })
        .optional(),
});
//get-link-role.ts
exports.LinkRoleModel = z.object({
    owner: z.string(),
});
//links.ts
exports.LinkRequestGetModel = z.object({
    action: z.literal("list").optional(),
    link_name: z.string().optional(),
});
exports.LinkRequestPostModel = z.object({
    action: ActionEnum.optional(),
    linkData: LinkDataModel.optional(),
});
exports.UpdateFavoriteModel = z.object({
    id: z.number(),
    favorite: z.boolean(),
});
exports.AiRequestModel = z.object({
    prompt: z.string(),
});
//layouts.ts
var LayoutDataModel = z.object({
    layout: z
        .array(z
        .object({
        i: z.string(),
        x: z.number(),
        y: z.number(),
        w: z.number(),
        h: z.number(),
    })
        .passthrough())
        .optional(),
    activeWidgets: z.array(z.string()).optional(),
});
exports.LayoutRequestPostModel = z.object({
    action: ActionEnum.optional(),
    layoutData: LayoutDataModel.optional(),
});
exports.DismissNotificationModel = z.object({
    ids: z.array(z.string()),
});
