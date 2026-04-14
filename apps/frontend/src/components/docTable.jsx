"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function DocTable(_a) {
    var rows = _a.rows;
    return (<table className="border-collapse w-full">
            <thead className="text-gray-500">
                <tr>
                    <th className="p-2 border-b border-gray-300 text-xs">NAME</th>
                    <th className="p-2 border-b border-gray-300 text-xs">DATE</th>
                    <th className="p-2 border-b border-gray-300 text-xs">STATUS</th>
                </tr>
            </thead>
            <tbody>
            {rows.map(function (row, i) { return (<tr key={i}>
                    <td className="p-2 border-b border-gray-300 text-xs text-[darkolivegreen] font-bold">{row.docTitle}</td>
                    <td className="p-2 border-b border-gray-300 text-xs text-[darkgray] font-bold">{row.docDate}</td>
                    <td className="p-2 border-b border-gray-300 text-xs text-[#D98627] font-bold">{row.docStatus}</td>
                </tr>); })}
            </tbody>
        </table>);
}
exports.default = DocTable;
