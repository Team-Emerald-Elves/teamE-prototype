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
var prisma_ts_1 = require("../lib/prisma.ts");
var APIRouter = (0, express_1.Router)();
APIRouter.get('/me', (0, express_2.requireAuth)(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, clerkUser, currentUser, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                return [4 /*yield*/, express_2.clerkClient.users.getUser(userId)];
            case 1:
                clerkUser = _c.sent();
                console.log(userId);
                if (!isAuthenticated) {
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                }
                currentUser = null;
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 6]);
                return [4 /*yield*/, prisma_ts_1.prisma.employee.findFirstOrThrow({
                        where: { clerkUserId: userId }
                    })];
            case 3:
                currentUser = _c.sent();
                return [3 /*break*/, 6];
            case 4:
                error_1 = _c.sent();
                if (!clerkUser)
                    throw new Error("Authenticated user doesn't exist in clerk.");
                return [4 /*yield*/, prisma_ts_1.prisma.employee.create({
                        data: {
                            clerkUserId: userId,
                            uname: clerkUser.username,
                            first_name: "admin",
                            last_name: "1",
                            roles: ["UnderWriter"],
                            bucket: {
                                create: {}
                            },
                            email: (_b = clerkUser.emailAddresses[0]) === null || _b === void 0 ? void 0 : _b.emailAddress
                        }
                    })];
            case 5:
                currentUser = _c.sent();
                return [3 /*break*/, 6];
            case 6:
                if (currentUser)
                    res.status(200).json(currentUser);
                else
                    res.sendStatus(403).json({ "message": "Employee in clerk but missing supabase record." });
                return [2 /*return*/];
        }
    });
}); });
exports.default = APIRouter;
