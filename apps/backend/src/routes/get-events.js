"use strict";
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
var express_1 = require("@clerk/express");
var database_1 = require("@repo/database");
function eventsRoute(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        function boostSaturation(hex, factor) {
            if (factor === void 0) { factor = 1.2; }
            var num = parseInt(hex.replace("#", ""), 16);
            var r = (num >> 16) & 255;
            var g = (num >> 8) & 255;
            var b = num & 255;
            var avg = (r + g + b) / 3;
            r = Math.min(255, Math.max(0, avg + (r - avg) * factor));
            g = Math.min(255, Math.max(0, avg + (g - avg) * factor));
            b = Math.min(255, Math.max(0, avg + (b - avg) * factor));
            return "#".concat(((r << 16) | (g << 8) | b).toString(16).padStart(6, "0"));
        }
        var _a, userId, isAuthenticated, employee, employee_id, result, docIds, documents, ownerIds, owners, docToOwnerMap_1, ownerNameMap_1, empIds, employees, employeeMap_1, COLOR_TO_ROLE_1, formattedEvents, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, express_1.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                    if (!isAuthenticated) {
                        return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, database_1.default.employee.findFirstOrThrow({
                            where: {
                                clerkUserId: userId,
                            },
                        })];
                case 2:
                    employee = _b.sent();
                    employee_id = employee.id;
                    return [4 /*yield*/, database_1.default.calendarEvents.findMany({
                            where: {
                                OR: [
                                    {
                                        emp_id: employee_id,
                                    },
                                    {
                                        emp_id: null,
                                    },
                                ],
                            },
                        })];
                case 3:
                    result = _b.sent();
                    docIds = Array.from(new Set(result
                        .map(function (e) { return e.doc_id; })
                        .filter(function (id) { return id !== -1 && id !== null; })));
                    return [4 /*yield*/, database_1.default.documentContent.findMany({
                            where: {
                                id: { in: docIds },
                            },
                            select: {
                                id: true,
                                content_owner: true,
                            },
                        })];
                case 4:
                    documents = _b.sent();
                    ownerIds = Array.from(new Set(documents.map(function (d) { return d.content_owner; }).filter(Boolean)));
                    return [4 /*yield*/, database_1.default.employee.findMany({
                            where: {
                                id: { in: ownerIds },
                            },
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                            },
                        })];
                case 5:
                    owners = _b.sent();
                    docToOwnerMap_1 = new Map(documents.map(function (d) { return [d.id, d.content_owner]; }));
                    ownerNameMap_1 = new Map(owners.map(function (o) { return [o.id, "".concat(o.first_name, " ").concat(o.last_name).trim()]; }));
                    empIds = Array.from(new Set(result
                        .map(function (e) { return e.lock; })
                        .filter(function (lock) { return lock && lock !== "none"; })));
                    return [4 /*yield*/, database_1.default.employee.findMany({
                            where: {
                                id: { in: empIds },
                            },
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                            },
                        })];
                case 6:
                    employees = _b.sent();
                    employeeMap_1 = new Map(employees.map(function (e) { return [
                        e.id,
                        "".concat(e.first_name, " ").concat(e.last_name).trim(),
                    ]; }));
                    COLOR_TO_ROLE_1 = {
                        "#6D28D9": "Administrator",
                        "#93C5FD": "BusinessAnalyst",
                        "#F9A8D4": "UnderWriter",
                        "#2DD4BF": "ExcelOperator",
                        "#C4B5FD": "BusinessOperator",
                        "#F0ABFC": "ActuarialAnalyst",
                    };
                    formattedEvents = result.map(function (event) {
                        var _a, _b, _c;
                        var contentOwnerName = null;
                        if (event.doc_id !== -1) {
                            var ownerId = docToOwnerMap_1.get(event.doc_id);
                            if (ownerId) {
                                contentOwnerName = (_a = ownerNameMap_1.get(ownerId)) !== null && _a !== void 0 ? _a : null;
                            }
                        }
                        return {
                            id: event.id,
                            title: event.title,
                            start: event.start_date,
                            end: event.end_date,
                            allDay: event.all_day,
                            color: boostSaturation(event.color, 1.3),
                            extendedProps: {
                                lock: event.lock,
                                emp_id: event.emp_id,
                                created_at: event.created_at,
                                checkedOut: event.lock && event.lock !== "none"
                                    ? ((_b = employeeMap_1.get(event.lock)) !== null && _b !== void 0 ? _b : null)
                                    : "none",
                                contentOwner: contentOwnerName,
                                doc_id: event.doc_id,
                                role: (_c = COLOR_TO_ROLE_1[event.color]) !== null && _c !== void 0 ? _c : null,
                            },
                        };
                    });
                    return [2 /*return*/, res.json(formattedEvents)];
                case 7:
                    error_1 = _b.sent();
                    console.error(error_1);
                    return [2 /*return*/, res.status(500).json({ message: "Failed to fetch favorites" })];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.default = eventsRoute;
