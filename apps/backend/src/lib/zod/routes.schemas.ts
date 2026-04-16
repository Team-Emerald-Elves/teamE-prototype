import * as z from "zod";


const StatusEnum = z.enum(['not_started', 'in_progress', 'needs_review', 'done', 'expired']).default('not_started')
const UserRoleEnum = z.enum([  'Administrator', 'UnderWriter', 'BusinessAnalyst']);
const ActionEnum = z.enum(['list', 'create', 'edit','delete']);

const EmployeeSchema = z.object({
    id: z.string(),
    clerkUserId: z.string().optional(),
    uname: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    roles: UserRoleEnum,
    email: z.email().optional(),
})


const documentContentSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    url: z.url().optional(),
    content_owner: z.string(),
    lock: z.boolean().default(false),
    assigned_role: UserRoleEnum.optional(),
    last_modified: z.date(),
    expiration_date: z.date(),
    mime_type: z.string().default('text/plain'),
    document_status: StatusEnum.default('not_started'),
    document_type: z.string(),
    favorite: z.boolean().default(false),
    //IDocumentContent
    documentID: z.number(),
    filePayload: z.string().optional(),
})


const LinkSchema = z.object({
    id: z.uuid().optional(),
    link_name: z.string().optional(),
    url: z.url().optional(),
    owner: z.string().optional(),
})


//api.ts
export const UpdateLockBody = z.object({
    id: z.number(),
    status: z.boolean(),
});

export const GetLockQuery = z.object({
    id: z.string(),
})

//content-employee-route.ts
export const ContentEmployeeBody = z.object({
    id: z.number(),
})

//create-employee.ts
export const CreateEmployeeBody = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.email(),
    uname: z.string(),
})

//create-servicereq.ts
export const CreateServiceReqBody = z.object({
    uname: z.string().optional(),
    description: z.string(),
})

//edit-employee.ts
export const EditEmployeeBody = z.object({
    id: z.string(),
    uname: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    roles: z.array(z.string()).optional(),
    email: z.email().optional(),
})


//employee.ts
export const ListEmployeesQuery = z.object({
    action: ActionEnum.optional(),
    id: z.string().optional(),
    uname: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),

})

// export const ListEmployeesBody = z.object({
//
// })

//get-link-role.ts
export const LinkRoleBody = z.object({
    owner: z.string(),
})

//links.ts

// export const LinkRequestQuery = z.object({
// })
//
// export const LinkRequestBody = z.object({
//
// })

//supabase.routes.ts

// export const CreateDocBody = z.object({
//
// })
//
// export const DeleteDocBody = z.object({
//
// })
//
//
// const UpdateDocBody = z.object({
//
// })

export const UpdateFavoriteBody = z.object({
    id: z.number(),
    favorite: z.boolean(),
})
