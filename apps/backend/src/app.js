"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var express_2 = require("@clerk/express");
var edit_employee_ts_1 = require("./routes/edit-employee.ts");
var middleware_ts_1 = require("./lib/zod/middleware.ts");
var cors_1 = require("cors");
var intClock_ts_1 = require("./lib/intClock.ts");
var routes_schemas_ts_1 = require("./lib/zod/routes.schemas.ts");
var index_ts_1 = require("./routes/index.ts");
var set_read_ts_1 = require("./routes/set-read.ts");
var layouts_ts_1 = require("./routes/layouts.ts");
var app = (0, express_1.default)();
var PORT = parseInt(process.env.PORT) || 3000;
/**
 * This TypeScript file binds the routes from express to the handlers in the
 * routes directory.
 */
var corsOptions = {
    origin: process.env.FRONTEND_SERVER,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
console.log("Allowing server ".concat(process.env.FRONTEND_SERVER, " communication in CORS config."));
app.use((0, cors_1.default)(corsOptions));
// Middleware.
app.use(body_parser_1.default.json({
    limit: parseInt((_a = process.env.FILE_UPLOAD_LIMIT) !== null && _a !== void 0 ? _a : "1000000"),
}));
app.use((0, express_2.clerkMiddleware)());
// Router-level middleware.
app.use("/api/supabase", index_ts_1.supaBaseRouter);
app.use("/api/notifs", index_ts_1.notifyRouter);
app.use("/employee", index_ts_1.employeeRoute); //validated in employee.ts
app.use("/links", index_ts_1.linkRoute); //validated in links.ts
app.use("/api/tests", index_ts_1.APIRouter);
app.use("/checkin-checkout-links", index_ts_1.CheckoutLinks);
app.use("/layouts", layouts_ts_1.default);
app.get("/assigned", /* requireAuth(),*/ index_ts_1.assignedRoute);
app.get("/statistics", /* requireAuth(),*/ index_ts_1.statsRoutes);
app.get("/get-favorited", /* requireAuth(),*/ index_ts_1.favoriteRoute);
app.get("/get-events", /* requireAuth(),*/ index_ts_1.eventsRoute);
app.get("/get-favorited-links", /* requireAuth(),*/ index_ts_1.favoriteLinksRoute);
app.get("/", function (req, res) {
    res.status(200).json({ message: "Backend express server running." });
});
app.post("/create-employee", 
/* requireAuth(),*/ (0, middleware_ts_1.default)(routes_schemas_ts_1.CreateEmployeeModel), index_ts_1.createOldEmployeeRoute);
app.post("/get-link-role", 
/* requireAuth(),*/ (0, middleware_ts_1.default)(routes_schemas_ts_1.LinkRoleModel), index_ts_1.linkRoleRoute);
app.post("/update-favorite", 
/* requireAuth(),*/ (0, middleware_ts_1.default)(routes_schemas_ts_1.UpdateFavoriteModel), index_ts_1.updateFavoriteRoute);
app.post("/update-favorite-link", /* requireAuth(),*/ index_ts_1.updateFavoriteLinksRoute);
app.post("/edit-employee", 
/* requireAuth(),*/ (0, middleware_ts_1.default)(routes_schemas_ts_1.EditEmployeeModel), edit_employee_ts_1.default);
app.post("/add-event", /* requireAuth(),*/ index_ts_1.addEventRoute);
app.post("/update-event", /* requireAuth(),*/ index_ts_1.updateEventRoute);
app.post("/set-read", /* requireAuth(),*/ set_read_ts_1.default);
app.put("/update-link-tags", /* requireAuth(),*/ index_ts_1.linkTagUpdate);
app.delete("/delete-link-tag", /* requireAuth(),*/ index_ts_1.linkTagDelete);
app.delete("/delete-event", /* requireAuth(),*/ index_ts_1.deleteEventRoute);
app.listen(PORT, function () {
    console.log("\u001B[33mServer started on\u001B[36m http://localhost:".concat(PORT, "!\u001B[0m"));
    console.log("Starting internal clock.");
    setInterval(intClock_ts_1.default, 5000);
});
