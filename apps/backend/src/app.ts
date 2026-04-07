import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import employeeRoute from "./routes/employee.ts";
import serviceReqRoute from "./routes/servicereqs.ts";
import assignedRoute from "./routes/assigned.ts";
import createEmployeeRoute from "./routes/create-employee.ts";
import supaBaseRouter from './routes/supabase.routes.ts';
import bodyParser from "body-parser";
import createServiceReqRoute from "./routes/create-servicereq.ts";
import { clerkMiddleware, clerkClient, requireAuth, getAuth } from '@clerk/express'
import { prisma } from './lib/prisma.ts';


import cors from 'cors';

import editEmployeeRoute from "./routes/edit-employee.ts";

const app = express();
const PORT = parseInt(process.env.PORT!) || 3000;

const __filename = fileURLToPath(`${import.meta.url}/../`);
const __dirname = dirname(__filename);

/**
 * This TypeScript file binds the routes from express to the handlers in the routes directory.
 */

//app.use("/public", express.static('public'));
// Source - https://stackoverflow.com/a/73921588
// Posted by KrystianKasp98
// Retrieved 2026-04-07, License - CC BY-SA 4.0

app.use(cors());

// Middleware.
app.use(bodyParser.json());
app.use(clerkMiddleware());

// Router-level middleware.
app.use('/api/supabase', supaBaseRouter);

// Test for clark authentication.
app.get('/me', requireAuth(), async (req, res) => {
  
    // Use `getAuth()` to get the user's `userId`
  const { userId } = getAuth(req)

  // Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId as string)

  return res.json({ user })
})

app.get('/', (req, res) => {
    res.sendStatus(200);
})

app.get('/employee', requireAuth(), employeeRoute);

app.get('/servicereqs', requireAuth(), serviceReqRoute)

app.get('/assigned', requireAuth(), assignedRoute);

app.post('/create-employee', requireAuth(), createEmployeeRoute);

app.post('/create-srvreq', requireAuth(), createServiceReqRoute);

app.post('/edit-employee', editEmployeeRoute);

app.post('/create-srvreq', createServiceReqRoute);

app.listen(PORT, () => {
    console.log(`\x1b[33mServer started on\x1b[36m http://localhost:${PORT}!\x1b[0m`);
})
