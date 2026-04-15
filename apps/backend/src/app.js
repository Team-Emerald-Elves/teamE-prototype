"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var url_1 = require("url");
var path_1 = require("path");
var employee_ts_1 = require("./routes/employee.ts");
var links_ts_1 = require("./routes/links.ts");
var servicereqs_ts_1 = require("./routes/servicereqs.ts");
var assigned_ts_1 = require("./routes/assigned.ts");
var create_employee_ts_1 = require("./routes/create-employee.ts");
var supabase_routes_ts_1 = require("./routes/supabase.routes.ts");
var body_parser_1 = require("body-parser");
var create_servicereq_ts_1 = require("./routes/create-servicereq.ts");
var express_2 = require("@clerk/express");
var edit_employee_ts_1 = require("./routes/edit-employee.ts");
var cors_1 = require("cors");
var api_ts_1 = require("./routes/api.ts");
var get_link_role_ts_1 = require("./routes/get-link-role.ts");
var get_favorited_ts_1 = require("./routes/get-favorited.ts");
var update_favorite_ts_1 = require("./routes/update-favorite.ts");
var app = (0, express_1.default)();
var PORT = parseInt(process.env.PORT) || 3000;
var __filename = (0, url_1.fileURLToPath)("".concat(import.meta.url, "/../"));
var __dirname = (0, path_1.dirname)(__filename);
/**
 * This TypeScript file binds the routes from express to the handlers in the routes directory.
 */
//app.use("/public", express.static('public'));
// Source - https://stackoverflow.com/a/73921588
// Posted by KrystianKasp98
// Retrieved 2026-04-07, License - CC BY-SA 4.0
app.use((0, cors_1.default)());
// Middleware.
app.use(body_parser_1.default.json());
app.use((0, express_2.clerkMiddleware)());
// Router-level middleware.
app.use('/api/supabase', supabase_routes_ts_1.default);
app.get('/', function (req, res) {
    res.sendStatus(200);
});
app.use('/employee', employee_ts_1.default);
app.use('/links', links_ts_1.default);
app.use('/api/tests', api_ts_1.default);
app.get('/servicereqs', (0, express_2.requireAuth)(), servicereqs_ts_1.default);
app.get('/assigned', (0, express_2.requireAuth)(), assigned_ts_1.default);
app.get('/get-favorited', get_favorited_ts_1.default);
//app.get('/content-employee',contentEmployeeRoute)
app.post('/create-employee', create_employee_ts_1.default);
app.post('/get-link-role', get_link_role_ts_1.default);
app.post('/update-favorite', update_favorite_ts_1.default);
app.post('/create-srvreq', (0, express_2.requireAuth)(), create_servicereq_ts_1.default);
app.post('/edit-employee', edit_employee_ts_1.default);
app.post('/create-srvreq', create_servicereq_ts_1.default);
app.post('/create-srvreq', create_servicereq_ts_1.default);
app.listen(PORT, function () {
    console.log("\u001B[33mServer started on\u001B[36m http://localhost:".concat(PORT, "!\u001B[0m"));
});
