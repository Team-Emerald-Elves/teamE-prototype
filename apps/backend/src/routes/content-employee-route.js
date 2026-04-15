"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_ts_1 = require("../lib/prisma.ts");
function contentEmployeeRoute(req, res) {
    var employee = req.body;
    prisma_ts_1.prisma.documentContent.findMany({
        where: {
            bucket: {
                employeeId: employee.id
            }
        }
    })
        .then(function (data) {
        res.json(data);
    }).catch(function (err) {
        console.log("Error: ", err);
    });
}
exports.default = contentEmployeeRoute;
