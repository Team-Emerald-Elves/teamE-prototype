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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var middleware_ts_1 = require("../lib/zod/middleware.ts");
var routes_schemas_ts_1 = require("../lib/zod/routes.schemas.ts");
var express_2 = require("@clerk/express");
var database_1 = require("@repo/database");
var notifyRouter = (0, express_1.Router)();
var clerkUserImageCache = new Map();
notifyRouter.get("/get-notifications", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, employee, notifications, creatorIds, updatedNotifications, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                if (!isAuthenticated) {
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, database_1.default.employee.findUnique({
                        where: {
                            clerkUserId: userId,
                        },
                        select: {
                            id: true,
                            roles: true,
                            clerkUserId: true,
                            DismissedNotifs: true,
                            unreadNotif: true,
                        },
                    })];
            case 2:
                employee = _b.sent();
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({
                            message: "Employee doesn't exist as a record in the database.",
                        })];
                }
                return [4 /*yield*/, database_1.default.notification.findMany({
                        where: {
                            OR: [
                                {
                                    employeeId: employee.id,
                                },
                                {
                                    public: true,
                                    targetRoles: {
                                        hasSome: employee.roles,
                                    },
                                },
                            ],
                            id: {
                                notIn: employee.DismissedNotifs,
                            },
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    })];
            case 3:
                notifications = _b.sent();
                creatorIds = __spreadArray([], new Set(notifications
                    .filter(function (n) { return n.public && n.creatorId; })
                    .map(function (n) { return n.creatorId; })), true);
                return [4 /*yield*/, Promise.all(creatorIds.map(function (creatorId) { return __awaiter(void 0, void 0, void 0, function () {
                        var creator;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (clerkUserImageCache.has(creatorId)) {
                                        return [2 /*return*/];
                                    }
                                    return [4 /*yield*/, express_2.clerkClient.users.getUser(creatorId)];
                                case 1:
                                    creator = _a.sent();
                                    clerkUserImageCache.set(creatorId, creator.imageUrl);
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 4:
                _b.sent();
                updatedNotifications = notifications.map(function (n) {
                    if (!n.public || !n.creatorId) {
                        return n;
                    }
                    return __assign(__assign({}, n), { profileIcon: clerkUserImageCache.get(n.creatorId) });
                });
                return [2 /*return*/, res.status(200).json({
                        Notifications: updatedNotifications,
                        newNotifications: employee.unreadNotif,
                    })];
            case 5:
                error_1 = _b.sent();
                if (error_1 instanceof database_1.Prisma.PrismaClientKnownRequestError) {
                    console.error(error_1.message);
                }
                else {
                    console.error(error_1);
                }
                return [2 /*return*/, res.status(500).json({
                        message: "check backend server log.",
                    })];
            case 6: return [2 /*return*/];
        }
    });
}); });
notifyRouter.post("/set-read", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, error_2;
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
                return [4 /*yield*/, database_1.default.employee.update({
                        where: {
                            clerkUserId: userId,
                        },
                        data: {
                            unreadNotif: false,
                        },
                    })];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(200).json({
                        message: "Notifications marked as read.",
                    })];
            case 3:
                error_2 = _b.sent();
                if (error_2 instanceof database_1.Prisma.PrismaClientKnownRequestError) {
                    console.error(error_2.message);
                }
                else {
                    console.error(error_2);
                }
                return [2 /*return*/, res.status(500).json({
                        message: "check backend server log.",
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
notifyRouter.post("/create-notification", (0, middleware_ts_1.default)(routes_schemas_ts_1.notificationModel), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, employee, notification, targetRoles, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                if (!isAuthenticated) {
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                return [4 /*yield*/, database_1.default.employee.findUnique({
                        where: {
                            clerkUserId: userId,
                        },
                    })];
            case 2:
                employee = _b.sent();
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({
                            message: "Employee doesn't exist as a record in the database.",
                        })];
                }
                return [4 /*yield*/, database_1.default.notification.create({
                        data: __assign(__assign({}, req.body), { creatorId: userId, employee: {
                                connect: {
                                    id: employee.id,
                                },
                            } }),
                    })];
            case 3:
                notification = _b.sent();
                targetRoles = notification.targetRoles;
                if (!notification.public) return [3 /*break*/, 5];
                return [4 /*yield*/, database_1.default.employee.updateMany({
                        where: {
                            roles: {
                                hasSome: targetRoles,
                            },
                        },
                        data: {
                            unreadNotif: true,
                        },
                    })];
            case 4:
                _b.sent();
                return [3 /*break*/, 7];
            case 5:
                if (!notification.employeeId) return [3 /*break*/, 7];
                return [4 /*yield*/, database_1.default.employee.update({
                        where: {
                            id: notification.employeeId,
                        },
                        data: {
                            unreadNotif: true,
                        },
                    })];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [2 /*return*/, res.status(200).json({
                    message: "Notification created",
                    notification: notification,
                })];
            case 8:
                error_3 = _b.sent();
                if (error_3 instanceof database_1.Prisma.PrismaClientKnownRequestError) {
                    console.error(error_3.message);
                }
                else {
                    console.error(error_3);
                }
                return [2 /*return*/, res.status(500).json({
                        error: "Failed to create notification",
                    })];
            case 9: return [2 /*return*/];
        }
    });
}); });
notifyRouter.post("/dismiss-notifications", (0, middleware_ts_1.default)(routes_schemas_ts_1.DismissNotificationModel), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, ids, employee, uniqueDismissedNotifs, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                ids = req.body.ids;
                if (!isAuthenticated) {
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, database_1.default.employee.findUnique({
                        where: {
                            clerkUserId: userId,
                        },
                        select: {
                            DismissedNotifs: true,
                        },
                    })];
            case 2:
                employee = _b.sent();
                if (!employee) {
                    return [2 /*return*/, res.status(404).json({
                            message: "Employee doesn't exist as a record in the database.",
                        })];
                }
                uniqueDismissedNotifs = __spreadArray([], new Set(__spreadArray(__spreadArray([], employee.DismissedNotifs, true), ids, true)), true);
                return [4 /*yield*/, database_1.default.employee.update({
                        where: {
                            clerkUserId: userId,
                        },
                        data: {
                            DismissedNotifs: {
                                set: uniqueDismissedNotifs,
                            },
                        },
                    })];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(200).json({
                        message: "Successfully dismissed notifications.",
                        dismissedNotificationIds: uniqueDismissedNotifs,
                    })];
            case 4:
                error_4 = _b.sent();
                if (error_4 instanceof database_1.Prisma.PrismaClientKnownRequestError) {
                    console.error(error_4.message);
                }
                else {
                    console.error(error_4);
                }
                return [2 /*return*/, res.status(500).json({
                        message: "check backend server log.",
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = notifyRouter;
