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
import intClock from './lib/intClock.ts'

import linkRoleRoute from "./routes/get-link-role.ts";
import favoriteRoute from "./routes/get-favorited.ts";
import updateFavoriteRoute from "./routes/update-favorite.ts";
import statsRoutes from "./routes/statistics.ts";
import updateFavoriteLinksRoute from "./routes/update-favorite-link.ts";
import favoriteLinksRoute from "./routes/get-favorited-links.ts";
import eventsRoute from "./routes/get-events.ts";
import addEventRoute from "./routes/add-event.ts";
import updateEventRoute from "./routes/update-event.ts";
import CheckoutLinks from "./routes/checkin-checkout-links.ts";
import deleteEventRoute from "./routes/delete-event.ts";
import linkTagUpdate from "./routes/update-link-tags.ts";
import linkTagDelete from "./routes/link-tag-delete.ts";
import notifyRouter from "./routes/notifications.routes.ts";


const app = express();
const PORT = parseInt(process.env.PORT!) || 3000;

/**
 * This TypeScript file binds the routes from express to the handlers in the routes directory.
 */

const corsOptions = {
  origin: process.env.FRONTEND_SERVER,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

console.log(`Allowing server ${process.env.FRONTEND_SERVER} communication in CORS config.`)

app.use(cors(corsOptions));

// Middleware.
app.use(bodyParser.json());
app.use(clerkMiddleware());

// Router-level middleware.
app.use('/api/supabase', supaBaseRouter);

app.use('/api/notifs', notifyRouter);

app.use('/employee', employeeRoute); //validated in employee.ts
app.use('/links', linkRoute) //validated in links.ts
app.use('/api/tests', APIRouter)
app.use('/checkin-checkout-links', CheckoutLinks)

app.get('/servicereqs', requireAuth(), serviceReqRoute)
app.get('/assigned', requireAuth(), assignedRoute);
app.get('/statistics', statsRoutes)
app.get('/get-favorited', favoriteRoute);
app.get('/get-events', eventsRoute);
app.get('/get-favorited-links', favoriteLinksRoute);
app.get('/', (req, res) => {res.status(200).json({message:'Backend express server running.'})})

app.post('/create-employee', createOldEmployeeRoute);
app.post('/get-link-role', linkRoleRoute)
app.post('/update-favorite', updateFavoriteRoute);
app.post('/update-favorite-link', updateFavoriteLinksRoute);
app.post('/create-srvreq', requireAuth(), createServiceReqRoute);
app.post('/edit-employee', validate(EditEmployeeModel), editEmployeeRoute);
app.post('/add-event', addEventRoute);
app.post('/update-event', updateEventRoute);
app.post('/create-srvreq', validate(CreateServiceReqModel), createServiceReqRoute);
app.post('/create-srvreq', createServiceReqRoute);

app.put('/update-link-tags', linkTagUpdate);

app.delete('/delete-link-tag', linkTagDelete);
app.delete('/delete-event', deleteEventRoute);

app.listen(PORT, () => {
    console.log(`\x1b[33mServer started on\x1b[36m http://localhost:${PORT}!\x1b[0m`);

    console.log("Starting internal clock.")
    setInterval(intClock, 5000);
})