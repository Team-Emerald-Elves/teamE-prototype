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
var database_1 = require("@repo/database");
var express_2 = require("@clerk/express");
var routes_schemas_ts_1 = require("../lib/zod/routes.schemas.ts");
var middleware_ts_1 = require("../lib/zod/middleware.ts");
var linkRoute = (0, express_1.default)();
linkRoute.post("/", (0, middleware_ts_1.default)(routes_schemas_ts_1.LinkRequestPostModel), function (req, res) {
    var lReq = req.body;
    if (!lReq) {
        res.status(400).json({
            error: "INVALID_LINKS_POST",
        });
    }
    if (lReq.action == "list") {
        listLinks(req, lReq.linkData, res);
        return;
    }
    if (!lReq.linkData) {
        res.status(400).json({
            error: "INVALID_EMPLOYEE_DATA",
        });
        return;
    }
    if (lReq.action == "create") {
        createLink({
            link_name: lReq.linkData.link_name,
            url: lReq.linkData.url,
            owner: lReq.linkData.owner,
        }, res);
        return;
    }
    if (lReq.action == "edit") {
        editLink(lReq.linkData, res);
        return;
    }
    if (lReq.action == "delete" && lReq.linkData.id) {
        deleteLink(lReq.linkData, res);
        return;
    }
    // No/invalid action
    res.status(400).json({
        error: "INVALID_ACTION",
    });
});
function listLinks(req, lData, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, userId, isAuthenticated, body, employee, favoritedIds_1, links, lockIds, lockEmployees, lockMap_1, annotatedLinks, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                    if (!isAuthenticated) {
                        return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                    }
                    body = req.body;
                    return [4 /*yield*/, database_1.default.employee.findFirst({
                            where: { clerkUserId: userId },
                            select: { favorite_links: true },
                        })];
                case 1:
                    employee = _b.sent();
                    favoritedIds_1 = (employee === null || employee === void 0 ? void 0 : employee.favorite_links) || [];
                    return [4 /*yield*/, database_1.default.links.findMany({
                            orderBy: {
                                link_name: "asc",
                            },
                        })];
                case 2:
                    links = _b.sent();
                    lockIds = __spreadArray([], new Set(links
                        .map(function (link) { return link.lock; })
                        .filter(function (lock) { return lock && lock !== "none"; })), true);
                    return [4 /*yield*/, database_1.default.employee.findMany({
                            where: {
                                id: { in: lockIds },
                            },
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                            },
                        })];
                case 3:
                    lockEmployees = _b.sent();
                    lockMap_1 = new Map(lockEmployees.map(function (emp) { return [
                        emp.id,
                        "".concat(emp.first_name, " ").concat(emp.last_name),
                    ]; }));
                    annotatedLinks = links.map(function (link) { return (__assign(__assign({}, link), { favorite: favoritedIds_1.includes(link.id), lock_name: link.lock && link.lock !== "none"
                            ? lockMap_1.get(link.lock) || "Unknown"
                            : null })); });
                    // 7. Sort favorites first
                    annotatedLinks.sort(function (a, b) {
                        if (a.favorite === b.favorite)
                            return 0;
                        return a.favorite ? -1 : 1;
                    });
                    res.status(200).json(annotatedLinks);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    console.log(error_1);
                    res.status(400).json({
                        error: "INVALID_LINKS_QUERY",
                    });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function createLink(lData, res) {
    return __awaiter(this, void 0, void 0, function () {
        var link, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!lData || !lData.link_name || !lData.url) {
                        res.status(400).json({
                            error: "INVALID_LINKS_CREATION",
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, database_1.default.links.create({
                            data: lData,
                        })];
                case 2:
                    link = _a.sent();
                    res.status(200).json(link);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.log(error_2);
                    res.status(400).json({
                        error: "INVALID_LINKS_CREATION",
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function editLink(lData, res) {
    return __awaiter(this, void 0, void 0, function () {
        var link, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.default.links.update({
                            where: {
                                id: lData.id,
                            },
                            data: lData,
                        })];
                case 1:
                    link = _a.sent();
                    res.status(200).json(link);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.log(error_3);
                    res.status(400).json({
                        error: "INVALID_LINKS_EDIT",
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function deleteLink(lData, res) {
    return __awaiter(this, void 0, void 0, function () {
        var link, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.default.links.delete({
                            where: {
                                id: lData.id,
                            },
                        })];
                case 1:
                    link = _a.sent();
                    res.status(200).json(link);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.log(error_4);
                    res.status(400).json({
                        error: "INVALID_LINKS_Delete",
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.default = linkRoute;
