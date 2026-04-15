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
var supabase_ts_1 = require("../lib/supabase.ts");
var client_ts_1 = require("../../prisma/generated/client.ts");
var supaBaseRouter = (0, express_1.Router)();
// const clerkClient = createClerkClient({
//     secretKey: process.env.CLERK_SECRET_KEY
// })
function toExpirationDate(value) {
    if (value instanceof Date && !isNaN(value.getTime())) {
        return value;
    }
    if (typeof value === 'string') {
        var parsed = new Date(value);
        if (!isNaN(parsed.getTime())) {
            return parsed;
        }
    }
    return new Date(Date.now() + 24 * 60 * 60 * 1000);
}
supaBaseRouter.post("/create-document", 
//requireAuth(),
function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, document, supabaseClient, employee, expirationDate, documentStatus, assignedRole, documentContents, _b, data, error, error_1;
    var _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                console.log(userId);
                if (!isAuthenticated) {
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                }
                document = req.body;
                return [4 /*yield*/, (0, supabase_ts_1.createSupabaseForRequest)()];
            case 1:
                supabaseClient = _h.sent();
                _h.label = 2;
            case 2:
                _h.trys.push([2, 7, , 8]);
                return [4 /*yield*/, prisma_ts_1.prisma.employee.findFirstOrThrow({
                        where: {
                            clerkUserId: userId
                        },
                        include: {
                            bucket: true
                        }
                    })
                    // Create contents for document.
                ];
            case 3:
                employee = _h.sent();
                expirationDate = toExpirationDate(document.expiration_date);
                documentStatus = Object.values(client_ts_1.Status).includes(document.document_status)
                    ? document.document_status
                    : client_ts_1.Status.not_started;
                assignedRole = Object.values(client_ts_1.UserRoles).includes(document.assigned_role)
                    ? document.assigned_role
                    : client_ts_1.UserRoles.UnderWriter;
                return [4 /*yield*/, prisma_ts_1.prisma.documentContent.create({
                        data: {
                            name: (_c = document.name) !== null && _c !== void 0 ? _c : "Not found.",
                            url: (_d = document.url) !== null && _d !== void 0 ? _d : "Local upload",
                            content_owner: (_e = document.content_owner) !== null && _e !== void 0 ? _e : "Not Found.",
                            assigned_role: assignedRole,
                            bucketId: employee.bucket.id,
                            mime_type: (_f = document.mime_type) !== null && _f !== void 0 ? _f : "text/plain",
                            expiration_date: expirationDate.toISOString(),
                            document_status: documentStatus,
                            document_type: (_g = document.document_type) !== null && _g !== void 0 ? _g : "Reference"
                        }
                    })];
            case 4:
                documentContents = _h.sent();
                if (!(documentContents.url === "Local upload")) return [3 /*break*/, 6];
                return [4 /*yield*/, supabaseClient.storage
                        .from(employee.bucket.id)
                        .upload(document.url.trim(), document.filePayload)];
            case 5:
                _b = _h.sent(), data = _b.data, error = _b.error;
                if (!data || error) {
                    throw new Error("Failed to upload document '".concat(document.name, "' for user '").concat(employee.uname, "'."));
                }
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                error_1 = _h.sent();
                res.status(401).json("{\"message\":\"Error creating document in bucket: ".concat(error_1, "\"}"));
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
supaBaseRouter.delete('/delete-document', 
// requireAuth(),
function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, document, supabaseClient, employee_1, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                document = req.body;
                return [4 /*yield*/, (0, supabase_ts_1.createSupabaseForRequest)()];
            case 1:
                supabaseClient = _b.sent();
                if (!isAuthenticated) {
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                }
                _b.label = 2;
            case 2:
                _b.trys.push([2, 5, , 6]);
                return [4 /*yield*/, prisma_ts_1.prisma.employee.findFirstOrThrow({
                        where: {
                            clerkUserId: userId
                        },
                        include: {
                            bucket: true
                        }
                    })];
            case 3:
                employee_1 = _b.sent();
                prisma_ts_1.prisma.documentContent.findFirst({
                    where: {
                        id: document.id
                    }
                }).then(function (d) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, data, error;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, supabaseClient.storage
                                    .from(employee_1.bucket.id).remove([(d === null || d === void 0 ? void 0 : d.name).trim()])];
                            case 1:
                                _a = _b.sent(), data = _a.data, error = _a.error;
                                if (!data || error) {
                                    console.error("Failed to delete document '".concat(document.name, "' for user '").concat(employee_1.uname, "'."));
                                }
                                return [2 /*return*/];
                        }
                    });
                }); }).catch(function (error) {
                    console.error("No bucket associated with employee: " + error);
                });
                // delete existing content for document.
                return [4 /*yield*/, prisma_ts_1.prisma.documentContent.delete({
                        where: {
                            id: document.id
                        },
                    }).catch(function (error) {
                        console.error("Couldn't delete document meta infomation.");
                    })];
            case 4:
                // delete existing content for document.
                _b.sent();
                res.sendStatus(200);
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                res.status(401).json("{\"message\":\"Error deleting document in bucket: ".concat(error_2, "\"}"));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
supaBaseRouter.put('/update-document', 
// requireAuth(),
function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, document, supabaseClient, employee, _b, data, error, error_3;
    var _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                if (!isAuthenticated) {
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                }
                console.log(userId);
                document = req.body;
                return [4 /*yield*/, (0, supabase_ts_1.createSupabaseForRequest)()];
            case 1:
                supabaseClient = _j.sent();
                _j.label = 2;
            case 2:
                _j.trys.push([2, 6, , 7]);
                return [4 /*yield*/, prisma_ts_1.prisma.employee.findFirstOrThrow({
                        where: {
                            clerkUserId: userId
                        },
                        include: {
                            bucket: true
                        }
                    })
                    // Update contents for document.
                ];
            case 3:
                employee = _j.sent();
                // Update contents for document.
                return [4 /*yield*/, prisma_ts_1.prisma.documentContent.update({
                        where: {
                            id: document.id,
                        },
                        data: {
                            name: (_c = document.name) !== null && _c !== void 0 ? _c : "Not found.",
                            url: (_d = document.url) !== null && _d !== void 0 ? _d : "Local upload",
                            content_owner: (_e = document.content_owner) !== null && _e !== void 0 ? _e : "Not Found.",
                            assigned_role: (_f = document.assigned_role) !== null && _f !== void 0 ? _f : client_ts_1.UserRoles.UnderWriter,
                            bucketId: employee.bucket.id,
                            mime_type: (_g = document.mime_type) !== null && _g !== void 0 ? _g : "text/plain",
                            expiration_date: toExpirationDate(document.expiration_date).toISOString(),
                            document_status: document.document_status,
                            document_type: (_h = document.document_type) !== null && _h !== void 0 ? _h : "Reference"
                        }
                    })];
            case 4:
                // Update contents for document.
                _j.sent();
                return [4 /*yield*/, supabaseClient.storage
                        .from(employee.bucket.id).update(document.name.trim(), document.filePayload)];
            case 5:
                _b = _j.sent(), data = _b.data, error = _b.error;
                if (!data || error) {
                    throw new Error("Failed to modify document '".concat(document.name, "' for user '").concat(employee.uname, "'."));
                }
                return [3 /*break*/, 7];
            case 6:
                error_3 = _j.sent();
                console.error("Update document error:", error_3);
                res.status(500).json({
                    message: "Error modifying document",
                    error: String(error_3),
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
supaBaseRouter.get('/list-documents', 
//requireAuth(),
function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, documents, error_4;
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
                return [4 /*yield*/, prisma_ts_1.prisma.documentContent.findMany()];
            case 2:
                documents = _b.sent();
                res.status(200).json(documents);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                res.status(404).json("{\"message\":\"Failed to find employee: ".concat(error_4, "\"}"));
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = supaBaseRouter;
