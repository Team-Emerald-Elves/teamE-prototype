"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var database_1 = require("@repo/database");
var express_2 = require("@clerk/express");
var routes_schemas_ts_1 = require("../lib/zod/routes.schemas.ts");
var middleware_ts_1 = require("../lib/zod/middleware.ts");
var ecache_ts_1 = require("../lib/ecache.ts");
var employeeRoute = (0, express_1.default)();
employeeRoute.post("/", function (req, res) {
    var action = req.query.action;
    var _a = req.query, id = _a.id, uname = _a.uname, first_name = _a.first_name, last_name = _a.last_name, email = _a.email;
    var eReq = req.body;
    // if (!eReq.employeeData) {
    //     res.status(400).json({
    //         error: "INVALID_EMPLOYEE_DATA"
    //     });
    //     return;
    // }
    if (eReq.action == "create") {
        createEmployee(eReq.employeeData, res);
        return;
    }
    if (eReq.action == "edit") {
        editEmployee(eReq.employeeData, res);
        return;
    }
    if (eReq.action == "delete") {
        deleteEmployee(eReq.employeeData, res);
        return;
    }
    if (!action || action === "list") {
        listEmployees({ id: id, uname: uname, first_name: first_name, last_name: last_name, email: email }, res);
        return;
    }
    res.status(200).json({
        error: "INVALID_EMPLOYEE_QUERY",
    });
});
employeeRoute.post("/", (0, middleware_ts_1.default)(routes_schemas_ts_1.EmployeeRequestModel), function (req, res) {
    var eReq = req.body;
    if (eReq.action == "list") {
        eReq.employeeData.roles = undefined;
        listEmployees(eReq.employeeData, res);
        return;
    }
    if (!eReq.employeeData) {
        res.status(400).json({
            error: "INVALID_EMPLOYEE_DATA",
        });
        return;
    }
    if (eReq.action == "create") {
        createEmployee(eReq.employeeData, res);
        return;
    }
    if (eReq.action == "edit") {
        editEmployee(eReq.employeeData, res);
        return;
    }
    if (eReq.action == "delete") {
        deleteEmployee(eReq.employeeData, res);
        return;
    }
    // No/invalid action
    res.status(400).json({
        error: "INVALID_ACTION",
    });
});
//checks if employee is a new user
employeeRoute.get("/new-user", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, employee, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                if (!isAuthenticated) {
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, database_1.default.employee.findFirst({
                        where: { clerkUserId: userId },
                        select: { newUser: true },
                    })];
            case 2:
                employee = _b.sent();
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({ error: "Employee not found" })];
                }
                return [2 /*return*/, res.status(200).json({ newUser: employee.newUser })];
            case 3:
                error_1 = _b.sent();
                console.error(error_1);
                return [2 /*return*/, res
                        .status(500)
                        .json({ error: "Failed to check new user status" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
//dismiss manual popup-- no longer new user
employeeRoute.post("/new-user/dismiss", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, employee, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                if (!isAuthenticated) {
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, database_1.default.employee.updateMany({
                        where: { clerkUserId: userId },
                        data: { newUser: false },
                    })];
            case 2:
                employee = _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "New user status cleared" })];
            case 3:
                error_2 = _b.sent();
                console.error(error_2);
                return [2 /*return*/, res
                        .status(500)
                        .json({ error: "Failed to update new user status" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
function createEmployee(eData, res) {
    if (!eData.uname || !eData.first_name || !eData.last_name) {
        res.status(400).json({
            error: "INVALID_EMPLOYEE_DATA",
        });
        return;
    }
    database_1.default.employee
        .create({
        data: eData,
    })
        .then(function (result) {
        console.log("Successfully created employee: ".concat(result.uname));
        res.status(200).json(result); // Success
    }, function (err) {
        console.error("[ERROR] Failed to create employee with error: ".concat(err));
        res.sendStatus(500); // Failed
    });
}
function editEmployee(eData, res) {
    return __awaiter(this, void 0, void 0, function () {
        var employee, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(eData);
                    if (!eData.id) {
                        res.status(400).send("INVALID_EMPLOYEE_DATA");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, database_1.default.employee.update({
                            where: {
                                id: eData.id,
                            },
                            data: eData,
                        })];
                case 2:
                    employee = _a.sent();
                    if (!employee) {
                        res.status(400).send({
                            error: "Employee not found",
                        });
                    }
                    res.status(200).send(employee);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    res.status(400).send(error_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function deleteEmployee(eData, res) {
    return __awaiter(this, void 0, void 0, function () {
        var bucket, employee, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(eData);
                    if (!eData.id) {
                        res.status(400).send("INVALID_EMPLOYEE_DATA");
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, database_1.default.bucketMeta.delete({
                            where: {
                                employeeId: eData.id,
                            },
                        })];
                case 2:
                    bucket = _a.sent();
                    return [4 /*yield*/, database_1.default.employee.delete({
                            where: {
                                id: eData.id,
                            },
                        })];
                case 3:
                    employee = _a.sent();
                    if (!bucket) {
                        res.status(400).send({
                            error: "Employee not found",
                        });
                    }
                    if (!employee) {
                        res.status(400).send({
                            error: "Employee not found",
                        });
                    }
                    res.status(200).send(employee);
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    res.status(400).send(error_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function listEmployees(eData, res) {
    return __awaiter(this, void 0, void 0, function () {
        var employees, defaultImage_1, enriched, err_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, database_1.default.employee.findMany({
                            orderBy: {
                                first_name: "asc",
                            },
                        })];
                case 1:
                    employees = _a.sent();
                    defaultImage_1 = "/public/default-avatar.png";
                    return [4 /*yield*/, Promise.all(employees.map(function (emp) { return __awaiter(_this, void 0, void 0, function () {
                            var user, err_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        if (!emp.clerkUserId) {
                                            return [2 /*return*/, __assign(__assign({}, emp), { imageUrl: defaultImage_1 })];
                                        }
                                        return [4 /*yield*/, ecache_ts_1.clerkCache.getUser(emp.clerkUserId)];
                                    case 1:
                                        user = _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, emp), { imageUrl: user.imageUrl || defaultImage_1 })];
                                    case 2:
                                        err_2 = _a.sent();
                                        // fallback if Clerk user doesn't exist
                                        return [2 /*return*/, __assign(__assign({}, emp), { imageUrl: defaultImage_1 })];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    enriched = _a.sent();
                    return [2 /*return*/, res.json(enriched)];
                case 3:
                    err_1 = _a.sent();
                    console.error("[ERROR]", err_1);
                    return [2 /*return*/, res.sendStatus(500)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.default = employeeRoute;
