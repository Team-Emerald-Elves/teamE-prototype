import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import employeeRoute from "./routes/employee.ts";
import serviceReqRoute from "./routes/servicereqs.ts";
import assignedRoute from "./routes/assigned.ts";
import createEmployeeRoute from "./routes/create-employee.ts";
import bodyParser from "body-parser";
import createServiceReqRoute from "./routes/create-servicereq.ts";
import editEmployeeRoute from "./routes/edit-employee.ts";

import cors from 'cors';


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

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendStatus(200);
})

app.get('/employee', employeeRoute);

app.get('/servicereqs', serviceReqRoute)

app.get('/assigned', assignedRoute);

app.post('/create-employee', createEmployeeRoute);

app.post('/edit-employee', editEmployeeRoute);

app.post('/create-srvreq', createServiceReqRoute);

app.listen(PORT, () => {
    console.log(`\x1b[33mServer started on\x1b[36m http://localhost:${PORT}!\x1b[0m`);
})
