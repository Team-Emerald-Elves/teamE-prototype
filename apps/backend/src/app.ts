import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import employeeRoute from "./routes/employee.ts";
import serviceReqRoute from "./routes/servicereqs.ts";
import assignedRoute from "./routes/assigned.ts";

const app = express();
const PORT = parseInt(process.env.PORT!) || 3000;
let filename = "";

const __dirname = path.dirname(fileURLToPath(import.meta.url + "/../"));
console.log(__dirname);

//app.use("/public", express.static('public'));

app.get('/', (req, res) => {
    res.sendStatus(200);
})

app.get('/employee', employeeRoute);

app.get('/servicereqs', serviceReqRoute)

app.get('/assigned', assignedRoute);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}!`);
})
