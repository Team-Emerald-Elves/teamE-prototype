import express from 'express';
import bodyParser from "body-parser";
import { clerkMiddleware, requireAuth} from '@clerk/express'
import editEmployeeRoute from "./routes/edit-employee.ts";
import validate from './lib/zod/middleware.ts'
import cors from 'cors';
import intClock from './lib/intClock.ts'

import {
    CreateEmployeeModel,
    EditEmployeeModel,
    LinkRoleModel,
    UpdateFavoriteModel
} from './lib/zod/routes.schemas.ts'
import {
  APIRouter,
  linkRoleRoute,
  favoriteRoute,
  updateFavoriteRoute,
  statsRoutes,
  updateFavoriteLinksRoute,
  favoriteLinksRoute,
  eventsRoute,
  addEventRoute,
  updateEventRoute,
  CheckoutLinks,
  deleteEventRoute,
  linkTagUpdate,
  linkTagDelete,
  notifyRouter,
  employeeRoute,
  linkRoute,
  assignedRoute,
  createOldEmployeeRoute,
  supaBaseRouter
} from "./routes/index.ts"

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

app.get('/assigned', requireAuth(), assignedRoute);
app.get('/statistics', requireAuth(), statsRoutes)
app.get('/get-favorited', requireAuth(), favoriteRoute);
app.get('/get-events', requireAuth(), eventsRoute);
app.get('/get-favorited-links', requireAuth(), favoriteLinksRoute);
app.get('/', (req, res) => {res.status(200).json({message:'Backend express server running.'})})

app.post('/create-employee', requireAuth(), validate(CreateEmployeeModel), createOldEmployeeRoute);
app.post('/get-link-role', requireAuth(), validate(LinkRoleModel), linkRoleRoute)
app.post('/update-favorite', requireAuth(), validate(UpdateFavoriteModel), updateFavoriteRoute);
app.post('/update-favorite-link', requireAuth(), updateFavoriteLinksRoute);
app.post('/edit-employee', requireAuth(), validate(EditEmployeeModel), editEmployeeRoute);
app.post('/add-event', requireAuth(), addEventRoute);
app.post('/update-event', requireAuth(), updateEventRoute);
app.put('/update-link-tags', requireAuth(), linkTagUpdate);

app.delete('/delete-link-tag', requireAuth(), linkTagDelete);
app.delete('/delete-event', requireAuth(), deleteEventRoute);

app.listen(PORT, () => {
    console.log(`\x1b[33mServer started on\x1b[36m http://localhost:${PORT}!\x1b[0m`);

    console.log("Starting internal clock.")
    setInterval(intClock, 5000);
})