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
exports.invite = invite;
var express_1 = require("express");
var express_2 = require("@clerk/express");
var routes_schemas_ts_1 = require("../lib/zod/routes.schemas.ts");
var middleware_ts_1 = require("../lib/zod/middleware.ts");
var database_1 = require("@repo/database");
var resend_1 = require("resend");
var ai_routes_ts_1 = require("./ai.routes.ts");
var ecache_ts_1 = require("../lib/ecache.ts");
var APIRouter = (0, express_1.default)();
APIRouter.get("/me", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, clerkUser, currentUser, error_1;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                if (!isAuthenticated) {
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                }
                return [4 /*yield*/, ecache_ts_1.clerkCache.getUser(userId)];
            case 1:
                clerkUser = _f.sent();
                _f.label = 2;
            case 2:
                _f.trys.push([2, 4, , 5]);
                if (!clerkUser)
                    throw new Error("Authenticated user doesn't exist in clerk.");
                return [4 /*yield*/, database_1.default.employee.upsert({
                        where: { clerkUserId: userId, uname: clerkUser.username },
                        update: {},
                        create: {
                            clerkUserId: userId,
                            uname: clerkUser.username,
                            first_name: (_b = clerkUser.firstName) !== null && _b !== void 0 ? _b : "firstname",
                            last_name: (_c = clerkUser.lastName) !== null && _c !== void 0 ? _c : "lastname",
                            roles: ["UnderWriter"],
                            bucket: {
                                create: {
                                    public: true, // Resources avaliable to public.
                                    file_size_limit: 52428800, // 50MB
                                },
                            },
                            email: (_e = (_d = clerkUser.primaryEmailAddress) === null || _d === void 0 ? void 0 : _d.emailAddress) !== null && _e !== void 0 ? _e : "example@email.com",
                        },
                    })];
            case 3:
                currentUser = _f.sent();
                return [2 /*return*/, res.status(200).json(currentUser)];
            case 4:
                error_1 = _f.sent();
                if (error_1 instanceof database_1.Prisma.PrismaClientKnownRequestError) {
                    console.log(error_1.code, error_1.message);
                }
                res.status(403).json({
                    message: "Employee in clerk but missing supabase record. (".concat(error_1, ")"),
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
function updateLock(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, id, status_1, _b, userId, isAuthenticated, employee, event_1, error_2;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, , 6]);
                    _a = (_c = req.body) !== null && _c !== void 0 ? _c : {}, id = _a.id, status_1 = _a.status;
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
                    return [4 /*yield*/, database_1.default.documentContent.update({
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
                    return [4 /*yield*/, database_1.default.calendarEvents.findFirstOrThrow({
                            where: {
                                doc_id: id,
                            },
                        })];
                case 3:
                    event_1 = _d.sent();
                    return [4 /*yield*/, database_1.default.calendarEvents.update({
                            where: {
                                id: event_1.id,
                            },
                            data: {
                                lock: employee.id,
                            },
                        })];
                case 4:
                    _d.sent();
                    return [2 /*return*/, res.status(200).json({ id: id, status: status_1 })];
                case 5:
                    error_2 = _d.sent();
                    return [2 /*return*/, res.status(500).json({ message: "Failed to update lock" })];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getLock(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = Number(req.query.id);
                    if (isNaN(id)) {
                        return [2 /*return*/, res.status(400).json({ message: "Invalid id" })];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, database_1.default.documentContent.findFirst({
                            where: {
                                id: id,
                            },
                        })];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, res.status(200).json(data === null || data === void 0 ? void 0 : data.lock)];
                case 3:
                    error_3 = _a.sent();
                    return [2 /*return*/, res.status(500).json({ message: "Failed to get lock", error: error_3 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function invite(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var resend, eRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resend = new resend_1.Resend(process.env.RESEND_KEY);
                    return [4 /*yield*/, resend.emails.send({
                            from: "Hanover <".concat(process.env.INVITE_EMAIL, ">"),
                            to: email,
                            subject: "Invited",
                            html: "<p>Congrats on sending your <strong>Email test!<br></strong> Your password:".concat(password, "</p>"),
                        })];
                case 1:
                    eRes = _a.sent();
                    if (eRes.error) {
                        console.log("Email invite error: ", JSON.stringify(eRes));
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
APIRouter.put("/update-lock", (0, middleware_ts_1.default)(routes_schemas_ts_1.UpdateLockBody), updateLock);
APIRouter.get("/get-lock", (0, middleware_ts_1.default)(routes_schemas_ts_1.GetLockQuery), getLock);
APIRouter.use("/ai", (0, middleware_ts_1.default)(routes_schemas_ts_1.AiRequestModel), ai_routes_ts_1.default);
exports.default = APIRouter;
