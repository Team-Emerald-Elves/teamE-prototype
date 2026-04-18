import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import employeeRoute from "./routes/employee.ts";
import linkRoute from "./routes/links.ts";
import serviceReqRoute from "./routes/servicereqs.ts";
import assignedRoute from "./routes/assigned.ts";
import createOldEmployeeRoute from "./routes/create-employee.ts";
import supaBaseRouter from './routes/supabase.routes.ts';
import bodyParser from "body-parser";
import createServiceReqRoute from "./routes/create-servicereq.ts";
import { clerkMiddleware, requireAuth} from '@clerk/express'
import editEmployeeRoute from "./routes/edit-employee.ts";
import {
    CreateEmployeeModel,
    CreateServiceReqModel,
    EditEmployeeModel,
    LinkRoleModel,
    UpdateFavoriteModel
} from './lib/zod/routes.schemas.ts'
import { validate } from './lib/zod/middleware.ts'

import cors from 'cors';
import APIRouter from './routes/api.ts';

import linkRoleRoute from "./routes/get-link-role.ts";
import favoriteRoute from "./routes/get-favorited.ts";
import updateFavoriteRoute from "./routes/update-favorite.ts";
import statsRoutes from "./routes/statistics.ts";


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

app.get('/', (req, res) => {
    res.sendStatus(200);
})

app.use('/employee', employeeRoute); //validated in employee.ts
app.use('/links', linkRoute) //validated in links.ts
app.use('/api/tests', APIRouter)

app.get('/servicereqs', requireAuth(), serviceReqRoute)

app.get('/assigned', requireAuth(), assignedRoute);
app.get('/statistics', statsRoutes)
app.get('/get-favorited', favoriteRoute);
//app.get('/content-employee',contentEmployeeRoute)

app.post('/create-employee', validate(CreateEmployeeModel), createOldEmployeeRoute);
app.post('/get-link-role', validate(LinkRoleModel), linkRoleRoute)
app.post('/update-favorite', validate(UpdateFavoriteModel), updateFavoriteRoute);

app.post('/create-srvreq', requireAuth(), createServiceReqRoute);


app.post('/edit-employee', validate(EditEmployeeModel), editEmployeeRoute);

app.post('/create-srvreq', validate(CreateServiceReqModel), createServiceReqRoute);

app.post('/create-srvreq', createServiceReqRoute);

app.listen(PORT, () => {
    console.log(`\x1b[33mServer started on\x1b[36m http://localhost:${PORT}!\x1b[0m`);
})