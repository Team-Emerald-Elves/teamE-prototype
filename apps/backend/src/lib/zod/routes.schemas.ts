import * as z from "zod";


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

export const CreateEmployeeBody = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    uname: z.string(),
})

export const CreateServiceReqBody = z.object({
    uname: z.string(),
    description: z.string(),
})

export const EditEmployeeBody = z.object({
    id: z.string(),
    uname: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    roles: z.array(z.string).optional(),
    email: z.string().email().optional(),
})