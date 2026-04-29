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
var express_2 = require("@clerk/express");
var database_1 = require("@repo/database");
var supabase_ts_1 = require("../lib/supabase.ts");
var routes_schemas_ts_1 = require("../lib/zod/routes.schemas.ts");
var middleware_ts_1 = require("../lib/zod/middleware.ts");
var mime_1 = require("mime");
var filters_ts_1 = require("../lib/filters.ts");
var supaBaseRouter = (0, express_1.Router)();
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
function getMimeFromUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch(url, { method: 'HEAD' })];
                case 1:
                    response = _a.sent();
                    // The server tells you exactly what the file is
                    return [2 /*return*/, response.headers.get('Content-Type')];
                case 2:
                    error_1 = _a.sent();
                    console.error("Failed to fetch headers:", error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
supaBaseRouter.post("/create-document", (0, middleware_ts_1.default)(routes_schemas_ts_1.DocumentContentModel), 
//requireAuth(),
function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, document, supabaseClient, employee, expirationDate, documentStatus, assignedRole, _b, decoded, _c, data, error, data_1, documentContents, ROLE_COLORS, color, error_2;
    var _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                console.log("Uid: ", userId);
                if (!isAuthenticated) {
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                }
                document = req.body;
                return [4 /*yield*/, (0, supabase_ts_1.createSupabaseForRequest)()];
            case 1:
                supabaseClient = _l.sent();
                _l.label = 2;
            case 2:
                _l.trys.push([2, 12, , 13]);
                return [4 /*yield*/, database_1.default.employee.findFirstOrThrow({
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
                employee = _l.sent();
                expirationDate = toExpirationDate(document.expiration_date);
                documentStatus = Object.values(database_1.Status).includes(document.document_status)
                    ? document.document_status
                    : database_1.Status.not_started;
                assignedRole = Object.values(database_1.UserRoles).includes(document.assigned_role)
                    ? document.assigned_role
                    : database_1.UserRoles.UnderWriter;
                if (!!document.filePayload) return [3 /*break*/, 5];
                console.log('Document source file is streamed.');
                _b = document;
                return [4 /*yield*/, getMimeFromUrl(document.url)];
            case 4:
                _b.mime_type = (_d = _l.sent()) !== null && _d !== void 0 ? _d : "text/plain";
                return [3 /*break*/, 9];
            case 5:
                console.log('Document source file is being uploaded.');
                decoded = base64ToArrayBuffer(document.filePayload);
                document.mime_type = mime_1.default.getType(document.fileName);
                // Upload document to authenticated employee with supabase bucket association.
                console.log("File name: ".concat(document.fileName, ", mimetype: ").concat(document.mime_type));
                return [4 /*yield*/, supabaseClient.storage
                        .from(employee.bucket.id)
                        .upload(document.fileName, decoded, {
                        contentType: document.mime_type,
                        upsert: true
                    })];
            case 6:
                _c = _l.sent(), data = _c.data, error = _c.error;
                if (!(!data || error)) return [3 /*break*/, 7];
                throw new Error("Failed to upload document '".concat(document.name, "' for user '").concat(employee.uname, "'. (").concat(error, ")"));
            case 7: return [4 /*yield*/, supabaseClient.storage
                    .from(employee.bucket.id)
                    .getPublicUrl(document.fileName)];
            case 8:
                data_1 = (_l.sent()).data;
                document.url = data_1.publicUrl;
                console.log("Public file URL: " + document.url);
                _l.label = 9;
            case 9: return [4 /*yield*/, database_1.default.documentContent.create({
                    data: {
                        name: (_e = document.name) !== null && _e !== void 0 ? _e : "Not found.",
                        url: (_f = document.url) !== null && _f !== void 0 ? _f : "Not found.",
                        content_owner: (_g = document.content_owner) !== null && _g !== void 0 ? _g : "Not Found.",
                        assigned_role: assignedRole,
                        bucketId: employee.bucket.id,
                        mime_type: (_h = document.mime_type) !== null && _h !== void 0 ? _h : "text/plain",
                        expiration_date: expirationDate,
                        document_status: documentStatus,
                        document_type: (_j = document.document_type) !== null && _j !== void 0 ? _j : "Reference"
                    }
                })];
            case 10:
                documentContents = _l.sent();
                ROLE_COLORS = {
                    Administrator: "#6D28D9",
                    BusinessAnalyst: "#93C5FD",
                    UnderWriter: "#F9A8D4",
                    ExcelOperator: "#2DD4BF",
                    BusinessOperator: "#C4B5FD",
                    ActuarialAnalyst: "#F0ABFC",
                };
                color = (_k = ROLE_COLORS[assignedRole]) !== null && _k !== void 0 ? _k : "#6b7280";
                return [4 /*yield*/, database_1.default.calendarEvents.create({
                        data: {
                            title: documentContents.name,
                            start_date: documentContents.expiration_date,
                            end_date: new Date(documentContents.expiration_date.getTime() + 1000 * 60 * 60),
                            all_day: false,
                            emp_id: null,
                            lock: "none",
                            doc_id: documentContents.id,
                            color: color,
                        }
                    })];
            case 11:
                _l.sent();
                res.sendStatus(200);
                return [3 /*break*/, 13];
            case 12:
                error_2 = _l.sent();
                res.status(401).json("{\"message\":\"Error creating document in bucket: ".concat(error_2, "\"}"));
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
supaBaseRouter.delete('/delete-document', (0, middleware_ts_1.default)(routes_schemas_ts_1.DeleteDocumentContentModel), 
// requireAuth(),
function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, _b, id, name, supabaseClient, employee_1, event_1, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                _b = req.body, id = _b.id, name = _b.name;
                return [4 /*yield*/, (0, supabase_ts_1.createSupabaseForRequest)()];
            case 1:
                supabaseClient = _c.sent();
                if (!isAuthenticated) {
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                }
                _c.label = 2;
            case 2:
                _c.trys.push([2, 7, , 8]);
                return [4 /*yield*/, database_1.default.employee.findFirstOrThrow({
                        where: {
                            clerkUserId: userId
                        },
                        include: {
                            bucket: true
                        }
                    })];
            case 3:
                employee_1 = _c.sent();
                return [4 /*yield*/, database_1.default.calendarEvents.findFirstOrThrow({
                        where: {
                            doc_id: id
                        }
                    })];
            case 4:
                event_1 = _c.sent();
                return [4 /*yield*/, database_1.default.calendarEvents.delete({
                        where: {
                            id: event_1.id
                        }
                    })];
            case 5:
                _c.sent();
                database_1.default.documentContent.findFirst({
                    where: {
                        id: id
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
                                    console.error("Failed to delete document '".concat(name, "' for user '").concat(employee_1.uname, "'."));
                                }
                                return [2 /*return*/];
                        }
                    });
                }); }).catch(function (error) {
                    console.error("No bucket associated with employee: " + error);
                });
                // delete existing content for document.
                return [4 /*yield*/, database_1.default.documentContent.delete({
                        where: {
                            id: id
                        },
                    }).catch(function (error) {
                        console.error("Couldn't delete document meta infomation.");
                    })];
            case 6:
                // delete existing content for document.
                _c.sent();
                res.sendStatus(200);
                return [3 /*break*/, 8];
            case 7:
                error_3 = _c.sent();
                res.status(401).json("{\"message\":\"Error deleting document in bucket: ".concat(error_3, "\"}"));
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
supaBaseRouter.put('/update-document', (0, middleware_ts_1.default)(routes_schemas_ts_1.DocumentContentModel), 
// requireAuth(),
function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, document, supabaseClient, employee, newDoc, event_2, ROLE_COLORS, _b, data, error, error_4;
    var _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = (0, express_2.getAuth)(req), userId = _a.userId, isAuthenticated = _a.isAuthenticated;
                if (!isAuthenticated) {
                    return [2 /*return*/, res.status(401).json({ error: "Not authenticated" })];
                }
                console.log("Uid: ", userId);
                document = req.body;
                return [4 /*yield*/, (0, supabase_ts_1.createSupabaseForRequest)()];
            case 1:
                supabaseClient = _j.sent();
                _j.label = 2;
            case 2:
                _j.trys.push([2, 8, , 9]);
                return [4 /*yield*/, database_1.default.employee.findFirstOrThrow({
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
                return [4 /*yield*/, database_1.default.documentContent.update({
                        where: {
                            id: document.id,
                        },
                        data: {
                            name: (_c = document.name) !== null && _c !== void 0 ? _c : "Not found.",
                            url: (_d = document.url) !== null && _d !== void 0 ? _d : "Local upload",
                            content_owner: (_e = document.content_owner) !== null && _e !== void 0 ? _e : "Not Found.",
                            assigned_role: (_f = document.assigned_role) !== null && _f !== void 0 ? _f : database_1.UserRoles.UnderWriter,
                            bucketId: employee.bucket.id,
                            mime_type: (_g = document.mime_type) !== null && _g !== void 0 ? _g : "text/plain",
                            expiration_date: toExpirationDate(document.expiration_date),
                            document_status: document.document_status,
                            document_type: (_h = document.document_type) !== null && _h !== void 0 ? _h : "Reference"
                        }
                    })];
            case 4:
                newDoc = _j.sent();
                return [4 /*yield*/, database_1.default.calendarEvents.findFirstOrThrow({
                        where: {
                            doc_id: document.id
                        }
                    })];
            case 5:
                event_2 = _j.sent();
                ROLE_COLORS = {
                    Administrator: "#6D28D9",
                    BusinessAnalyst: "#93C5FD",
                    UnderWriter: "#F9A8D4",
                    ExcelOperator: "#2DD4BF",
                    BusinessOperator: "#C4B5FD",
                    ActuarialAnalyst: "#F0ABFC",
                };
                return [4 /*yield*/, database_1.default.calendarEvents.update({
                        where: {
                            id: event_2.id
                        },
                        data: {
                            title: newDoc.name,
                            start_date: newDoc.expiration_date,
                            end_date: new Date(newDoc.expiration_date.getTime() + 1000 * 60 * 60),
                            color: ROLE_COLORS[newDoc.assigned_role],
                        }
                    })];
            case 6:
                _j.sent();
                console.log("New doc created: ", newDoc);
                return [4 /*yield*/, supabaseClient.storage
                        .from(employee.bucket.id).update(document.name.trim(), document.filePayload)];
            case 7:
                _b = _j.sent(), data = _b.data, error = _b.error;
                if (!data || error) {
                    throw new Error("Failed to modify document '".concat(document.name, "' for user '").concat(employee.uname, "'."));
                }
                res.sendStatus(200);
                return [3 /*break*/, 9];
            case 8:
                error_4 = _j.sent();
                console.error("Update document error:", error_4);
                res.status(500).json({
                    message: "Error modifying document",
                    error: String(error_4),
                });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
supaBaseRouter.put('/update-document-tags', 
// requireAuth(),
function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var document, newDoc, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                document = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log(document);
                return [4 /*yield*/, database_1.default.documentContent.update({
                        where: {
                            id: document.id,
                        },
                        data: {
                            meta_tags: document.meta_tags,
                        }
                    })];
            case 2:
                newDoc = _a.sent();
                console.log("New doc created: ", newDoc);
                if (!newDoc) {
                    throw new Error("Failed to update tags.");
                }
                res.sendStatus(200);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error("Update document error:", error_5);
                res.status(500).json({
                    message: "Error modifying document",
                    error: String(error_5),
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
supaBaseRouter.delete('/remove-document-tag', 
// requireAuth(),
function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var document, doc, updatedTags, newDoc, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                document = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                console.log(document);
                return [4 /*yield*/, database_1.default.documentContent.findFirstOrThrow({
                        where: {
                            id: document.id,
                        },
                    })];
            case 2:
                doc = _a.sent();
                updatedTags = (doc.meta_tags || []).filter(function (t) { return t !== document.tag; });
                return [4 /*yield*/, database_1.default.documentContent.update({
                        where: {
                            id: document.id,
                        },
                        data: {
                            meta_tags: updatedTags,
                        },
                    })];
            case 3:
                newDoc = _a.sent();
                console.log("New doc created: ", newDoc);
                if (!newDoc) {
                    throw new Error("Failed to update tags.");
                }
                res.sendStatus(200);
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                console.error("Update document error:", error_6);
                res.status(500).json({
                    message: "Error modifying document",
                    error: String(error_6),
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
supaBaseRouter.post('/list-documents', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isAuthenticated, employee, favoriteSet_1, whereClauseReg, documents, ownerIds, lockIds, allEmployeeIds, employees, employeeMap_1, formattedDocs, sortedDocs, keyToMatch_1, error_7;
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
                return [4 /*yield*/, database_1.default.employee.findFirstOrThrow({
                        where: {
                            clerkUserId: userId,
                        },
                        select: {
                            favorites: true,
                            roles: true
                        },
                    })];
            case 2:
                employee = _b.sent();
                favoriteSet_1 = new Set(employee.favorites);
                whereClauseReg = (0, filters_ts_1.buildWhereClause)(req.body, {});
                return [4 /*yield*/, database_1.default.documentContent.findMany({
                        where: whereClauseReg
                    })];
            case 3:
                documents = _b.sent();
                ownerIds = documents.map(function (doc) { return doc.content_owner; });
                lockIds = documents
                    .map(function (doc) { return doc.lock; })
                    .filter(function (id) { return id && id !== "none"; });
                allEmployeeIds = __spreadArray([], new Set(__spreadArray(__spreadArray([], ownerIds, true), lockIds, true)), true);
                return [4 /*yield*/, database_1.default.employee.findMany({
                        where: {
                            id: { in: allEmployeeIds },
                        },
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                        },
                    })];
            case 4:
                employees = _b.sent();
                employeeMap_1 = new Map(employees.map(function (emp) { return [
                    emp.id,
                    "".concat(emp.first_name, " ").concat(emp.last_name),
                ]; }));
                formattedDocs = documents.map(function (doc) { return (__assign(__assign({}, doc), { content_owner: employeeMap_1.get(doc.content_owner) || "Unknown", lock_name: doc.lock === "none"
                        ? "Unlocked"
                        : employeeMap_1.get(doc.lock) || "Unknown", 
                    // keep favorite flag consistent
                    favorite: favoriteSet_1.has(doc.id) })); });
                sortedDocs = formattedDocs.sort(function (a, b) {
                    if (a.favorite === b.favorite)
                        return 0;
                    return a.favorite ? -1 : 1;
                });
                keyToMatch_1 = employee.roles[0];
                sortedDocs.sort(function (a, b) {
                    if (a.assigned_role === b.assigned_role)
                        return 0;
                    return (a.assigned_role === keyToMatch_1) ? -1 : 1;
                });
                console.log(sortedDocs);
                res.status(200).json(sortedDocs);
                return [3 /*break*/, 6];
            case 5:
                error_7 = _b.sent();
                console.error(error_7);
                res.status(500).json({ message: "Failed to fetch documents" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
supaBaseRouter.post("/get-hit-counts", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, start, end, startDate, endDate, hits, documentIds, docs, _b, docTypeMap, dateRange, cursor, chartMap, _i, dateRange_1, date, _c, hits_1, row, date, count, entry, docType, error_8;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = req.body, start = _a.start, end = _a.end;
                if (!start || !end) {
                    return [2 /*return*/, res.status(400).json({
                            message: "start and end dates are required",
                        })];
                }
                _e.label = 1;
            case 1:
                _e.trys.push([1, 6, , 7]);
                startDate = new Date(start);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(end);
                endDate.setHours(0, 0, 0, 0);
                return [4 /*yield*/, database_1.default.hit_counts.groupBy({
                        by: ["hit_date", "target_type", "target_id"],
                        where: {
                            hit_date: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                        _sum: {
                            count: true,
                        },
                    })];
            case 2:
                hits = _e.sent();
                documentIds = __spreadArray([], new Set(hits
                    .filter(function (h) { return h.target_type === "DOCUMENT"; })
                    .map(function (h) { return Number(h.target_id); })), true);
                if (!(documentIds.length > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, database_1.default.documentContent.findMany({
                        where: {
                            id: { in: documentIds },
                        },
                        select: {
                            id: true,
                            document_type: true,
                        },
                    })];
            case 3:
                _b = _e.sent();
                return [3 /*break*/, 5];
            case 4:
                _b = [];
                _e.label = 5;
            case 5:
                docs = _b;
                docTypeMap = new Map(docs.map(function (d) {
                    var _a;
                    return [
                        String(d.id),
                        ((_a = d.document_type) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "",
                    ];
                }));
                dateRange = [];
                cursor = new Date(startDate);
                while (cursor <= endDate) {
                    dateRange.push(cursor.toISOString().split("T")[0]);
                    cursor.setDate(cursor.getDate() + 1);
                }
                chartMap = new Map();
                for (_i = 0, dateRange_1 = dateRange; _i < dateRange_1.length; _i++) {
                    date = dateRange_1[_i];
                    chartMap.set(date, {
                        date: date,
                        documents: 0,
                        links: 0,
                        reference: 0,
                        workflow: 0,
                    });
                }
                for (_c = 0, hits_1 = hits; _c < hits_1.length; _c++) {
                    row = hits_1[_c];
                    date = row.hit_date.toISOString().split("T")[0];
                    count = (_d = row._sum.count) !== null && _d !== void 0 ? _d : 0;
                    entry = chartMap.get(date);
                    if (!entry)
                        continue;
                    if (row.target_type === "DOCUMENT") {
                        entry.documents += count;
                        docType = docTypeMap.get(row.target_id);
                        if (docType === "reference") {
                            entry.reference += count;
                        }
                        if (docType === "workflow") {
                            entry.workflow += count;
                        }
                    }
                    if (row.target_type === "LINK") {
                        entry.links += count;
                    }
                }
                return [2 /*return*/, res.status(200).json(__spreadArray([], chartMap.values(), true))];
            case 6:
                error_8 = _e.sent();
                console.error("Hit count chart error:", error_8);
                return [2 /*return*/, res.status(500).json({
                        message: "Error generating hit count chart",
                        error: String(error_8),
                    })];
            case 7: return [2 /*return*/];
        }
    });
}); });
supaBaseRouter.post("/add-hit-count", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, id, today, hit, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("reached hit count add");
                _a = req.body, type = _a.type, id = _a.id;
                today = new Date();
                today.setHours(0, 0, 0, 0);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, database_1.default.hit_counts.upsert({
                        where: {
                            target_type_target_id_hit_date: {
                                target_type: type,
                                target_id: String(id),
                                hit_date: today
                            }
                        },
                        update: {
                            count: { increment: 1 }
                        },
                        create: {
                            target_type: type,
                            target_id: String(id),
                            hit_date: today,
                            count: 1
                        }
                    })];
            case 2:
                hit = _b.sent();
                ;
                return [2 /*return*/, res.status(200).json(hit)];
            case 3:
                error_9 = _b.sent();
                console.error("Hit count chart error:", error_9);
                return [2 /*return*/, res.status(500).json({
                        message: "Error generating hit count chart",
                        error: String(error_9),
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = supaBaseRouter;
