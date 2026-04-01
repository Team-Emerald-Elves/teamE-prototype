import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import employeeRoute from "./routes/employee.ts";
import serviceReqRoute from "./routes/servicereqs.ts";
import assignedRoute from "./routes/assigned.ts";
import createEmployeeRoute from "./routes/create-employee.ts";
import bodyParser from "body-parser";
import createServiceReqRoute from "./routes/create-servicereq.ts";

const app = express();
const PORT = parseInt(process.env.PORT!) || 3000;
let filename = "";


const __dirname = path.dirname(fileURLToPath(import.meta.url + "/../"));
console.log(__dirname);

/**
 * This TypeScript file binds the routes from express to the handlers in the routes directory.
 */


//app.use("/public", express.static('public'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendStatus(200);
})

app.get('/employee', employeeRoute);

app.get('/servicereqs', serviceReqRoute)

app.get('/assigned', assignedRoute);

app.post('/create-employee', createEmployeeRoute);

app.post('/create-srvreq', createServiceReqRoute);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}!`);
})
