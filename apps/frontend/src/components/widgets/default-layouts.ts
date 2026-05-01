import type { SavedDashboard } from "./widget-def";

interface RoleLayout extends SavedDashboard {}

export const defaultLayouts: Record<string, RoleLayout> = {
    businessanalyst: {
        activeWidgets: ["favorites", "userLogs", "hitCounts", "calendar"],
        layout: [
            { i: "favorites",  x: 0, y: 0, w: 12, h: 4 },
            { i: "userLogs",   x: 0, y: 4, w: 6,  h: 6 },
            { i: "hitCounts",  x: 6, y: 4, w: 6,  h: 6 },
            { i: "calendar",   x: 0, y: 10, w: 12, h: 6 },
        ],
    },
    underwriter: {
        activeWidgets: ["favorites", "userLogs", "hitCounts", "calendar"],
        layout: [
            { i: "favorites",  x: 0, y: 0, w: 12, h: 4 },
            { i: "userLogs",   x: 0, y: 4, w: 6,  h: 6 },
            { i: "hitCounts",  x: 6, y: 4, w: 6,  h: 6 },
            { i: "calendar",   x: 0, y: 10, w: 12, h: 6 },
        ],
    },
};

export const fallbackLayout: RoleLayout = {
    activeWidgets: ["favorites", "numStats", "pieRoles", "pieDocs", "userLogs", "hitCounts", "calendar"],
    layout: [
        { i: "favorites",  x: 0, y: 0,  w: 12, h: 4, isResizable:false },
        { i: "numStats",   x: 0, y: 4,  w: 5,  h: 4, isResizable:false },
        { i: "pieRoles",   x: 5, y: 4,  w: 4,  h: 4, isResizable:false },
        { i: "pieDocs",    x: 9, y: 4,  w: 3,  h: 4 , isResizable:false},
        { i: "userLogs",   x: 0, y: 8,  w: 6,  h: 6 , isResizable:false},
        { i: "hitCounts",  x: 6, y: 8,  w: 6,  h: 6 , isResizable:false},
        { i: "calendar",   x: 0, y: 14, w: 12, h: 6 , isResizable:false},
    ],
};
