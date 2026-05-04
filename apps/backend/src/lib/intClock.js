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
var database_1 = require("@repo/database");
var FULLDAY = 8.64e7;
var expiringDocuments = function () { return __awaiter(void 0, void 0, void 0, function () {
    var now, oneDayFromNow, documents;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                now = new Date();
                oneDayFromNow = new Date(Date.now() + FULLDAY);
                return [4 /*yield*/, database_1.default.documentContent.findMany({
                        where: {
                            expiration_date: {
                                gte: now,
                                lte: oneDayFromNow,
                            },
                            expiration_warn: false,
                        },
                    })];
            case 1:
                documents = _a.sent();
                if (documents.length < 1)
                    return [2 /*return*/];
                console.log("Creating ".concat(documents.length, " notifications."));
                return [4 /*yield*/, database_1.default.documentContent.updateMany({
                        where: {
                            id: {
                                in: documents.map(function (doc) { return doc.id; }),
                            },
                        },
                        data: {
                            expiration_warn: true,
                        },
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, Promise.all(documents.map(function (doc) { return __awaiter(void 0, void 0, void 0, function () {
                        var targetRoles;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, database_1.default.notification.create({
                                        data: {
                                            title: "".concat(doc.name.substring(0, 14) + (doc.name.length >= 12 ? "..." : ""), " is expiring tomorrow!"),
                                            public: true,
                                            targetRoles: [
                                                doc.assigned_role,
                                                "Administrator",
                                            ],
                                        },
                                    })];
                                case 1:
                                    _a.sent();
                                    targetRoles = __spreadArray(__spreadArray([], (doc.assigned_role ? [doc.assigned_role] : []), true), [
                                        database_1.UserRoles.Administrator,
                                    ], false);
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
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var fullyDismissedNotifications = function () { return __awaiter(void 0, void 0, void 0, function () {
    var employees, publicNotifications, notificationIdsToDelete, _i, employees_1, employee, _a, _b, notification, _loop_1, _c, publicNotifications_1, notification, idsToDelete, employeeUpdates, result;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, database_1.default.employee.findMany({
                    select: {
                        id: true,
                        roles: true,
                        DismissedNotifs: true,
                        Notifications: {
                            where: {
                                public: false,
                            },
                            select: {
                                id: true,
                            },
                        },
                    },
                })];
            case 1:
                employees = _d.sent();
                return [4 /*yield*/, database_1.default.notification.findMany({
                        where: {
                            public: true,
                        },
                        select: {
                            id: true,
                            targetRoles: true,
                        },
                    })];
            case 2:
                publicNotifications = _d.sent();
                notificationIdsToDelete = new Set();
                // 1. Delete private notifications dismissed by their assigned employee
                for (_i = 0, employees_1 = employees; _i < employees_1.length; _i++) {
                    employee = employees_1[_i];
                    for (_a = 0, _b = employee.Notifications; _a < _b.length; _a++) {
                        notification = _b[_a];
                        if (employee.DismissedNotifs.includes(notification.id)) {
                            notificationIdsToDelete.add(notification.id);
                        }
                    }
                }
                _loop_1 = function (notification) {
                    var targetEmployees = employees.filter(function (employee) {
                        return employee.roles.some(function (role) {
                            return notification.targetRoles.includes(role);
                        });
                    });
                    // Avoid deleting if no employees currently match the target roles
                    if (targetEmployees.length === 0) {
                        return "continue";
                    }
                    var dismissedByEveryone = targetEmployees.every(function (employee) {
                        return employee.DismissedNotifs.includes(notification.id);
                    });
                    if (dismissedByEveryone) {
                        notificationIdsToDelete.add(notification.id);
                    }
                };
                // 2. Delete public role notifications dismissed by everyone in the target role(s)
                for (_c = 0, publicNotifications_1 = publicNotifications; _c < publicNotifications_1.length; _c++) {
                    notification = publicNotifications_1[_c];
                    _loop_1(notification);
                }
                idsToDelete = __spreadArray([], notificationIdsToDelete, true);
                if (idsToDelete.length === 0) {
                    return [2 /*return*/, {
                            deletedCount: 0,
                            cleanedEmployeesCount: 0,
                            deletedNotificationIds: [],
                        }];
                }
                employeeUpdates = employees
                    .map(function (employee) {
                    var cleanedDismissedNotifs = employee.DismissedNotifs.filter(function (notifId) { return !notificationIdsToDelete.has(notifId); });
                    return {
                        employeeId: employee.id,
                        cleanedDismissedNotifs: cleanedDismissedNotifs,
                        changed: cleanedDismissedNotifs.length !==
                            employee.DismissedNotifs.length,
                    };
                })
                    .filter(function (employee) { return employee.changed; });
                return [4 /*yield*/, database_1.default.$transaction(function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                        var deleted;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, tx.notification.deleteMany({
                                        where: {
                                            id: {
                                                in: idsToDelete,
                                            },
                                        },
                                    })];
                                case 1:
                                    deleted = _a.sent();
                                    return [4 /*yield*/, Promise.all(employeeUpdates.map(function (employee) {
                                            return tx.employee.update({
                                                where: {
                                                    id: employee.employeeId,
                                                },
                                                data: {
                                                    DismissedNotifs: {
                                                        set: employee.cleanedDismissedNotifs,
                                                    },
                                                },
                                            });
                                        }))];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/, deleted];
                            }
                        });
                    }); })];
            case 3:
                result = _d.sent();
                return [2 /*return*/, {
                        deletedCount: result.count,
                        cleanedEmployeesCount: employeeUpdates.length,
                        deletedNotificationIds: idsToDelete,
                    }];
        }
    });
}); };
var intClock = function () { return __awaiter(void 0, void 0, void 0, function () {
    var removedNotifs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, expiringDocuments()];
            case 1:
                _a.sent();
                return [4 /*yield*/, fullyDismissedNotifications()];
            case 2:
                removedNotifs = _a.sent();
                if (removedNotifs.deletedCount > 0)
                    console.log("[InitClock] Deleted ".concat(removedNotifs.deletedCount, " notifications."));
                if (removedNotifs.cleanedEmployeesCount > 0)
                    console.log("[InitClock] Cleaned up ".concat(removedNotifs.cleanedEmployeesCount, " employees."));
                if (removedNotifs.deletedNotificationIds.length > 0)
                    console.log("[InitClock] Deleted notification IDs: ".concat(removedNotifs.deletedNotificationIds.join(", ")));
                return [2 /*return*/];
        }
    });
}); };
exports.default = intClock;
