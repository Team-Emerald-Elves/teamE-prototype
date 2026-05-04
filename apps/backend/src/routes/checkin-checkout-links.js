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
var express_1 = require("express");
var express_2 = require("@clerk/express");
var routes_schemas_ts_1 = require("../lib/zod/routes.schemas.ts");
var middleware_ts_1 = require("../lib/zod/middleware.ts");
var database_1 = require("@repo/database");
var CheckoutLinks = (0, express_1.default)();
function updateLinkLock(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, id, status_1, _b, userId, isAuthenticated, employee, error_1;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    _a = (_c = req.body) !== null && _c !== void 0 ? _c : {}, id = _a.id, status_1 = _a.status;
                    if (typeof id !== "string" || typeof status_1 !== "boolean") {
                        return [2 /*return*/, res.status(400).json({
                                message: "Invalid body. Expected { id: string, status: boolean }",
                            })];
                    }
                    _b = (0, express_2.getAuth)(req), userId = _b.userId, isAuthenticated = _b.isAuthenticated;
                    if (!isAuthenticated) {
                        return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                    }
                    return [4 /*yield*/, database_1.default.employee.findFirstOrThrow({
                            where: {
                                clerkUserId: userId,
                            },
                        })];
                case 1:
                    employee = _d.sent();
                    return [4 /*yield*/, database_1.default.links.update({
                            where: {
                                id: id,
                            },
                            data: {
                                lock: status_1 ? employee.id : "none",
                                lock_name: employee.first_name + " " + employee.last_name,
                            },
                        })];
                case 2:
                    _d.sent();
                    return [2 /*return*/, res.status(200).json({ id: id, status: status_1 })];
                case 3:
                    error_1 = _d.sent();
                    return [2 /*return*/, res.status(500).json({ message: "Failed to update lock" })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getLinkLock(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.query.id;
                    if (!id) {
                        return [2 /*return*/, res.status(400).json({ message: "Invalid id" })];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, database_1.default.links.findFirst({
                            where: {
                                id: id,
                            },
                        })];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, res.status(200).json(data === null || data === void 0 ? void 0 : data.lock)];
                case 3:
                    error_2 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ message: "Failed to get lock", error: error_2 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
CheckoutLinks.put("/update-link-lock", (0, middleware_ts_1.default)(routes_schemas_ts_1.UpdateLockBodyLink), updateLinkLock);
CheckoutLinks.get("/get-link-lock", (0, middleware_ts_1.default)(routes_schemas_ts_1.GetLockQuery), getLinkLock);
exports.default = CheckoutLinks;
