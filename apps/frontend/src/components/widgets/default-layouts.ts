import type { SavedDashboard } from "./widget-def";

interface RoleLayout extends SavedDashboard {}

const sharedLayout: RoleLayout = {
    activeWidgets: ["favorites", "userLogs", "hitCounts", "calendar"],
    layout: [
        { i: "favorites", x: 0, y: 0,  w: 12, h: 6, resizeHandles: ["s"] },
        { i: "userLogs",  x: 0, y: 8,  w: 5,  h: 9, resizeHandles: ["s"] },
        { i: "hitCounts", x: 5, y: 8,  w: 7,  h: 9 },
        { i: "calendar",  x: 0, y: 14, w: 12, h: 6 },
    ],
};

export const defaultLayouts: Record<string, RoleLayout> = {
    businessanalyst: sharedLayout,
    underwriter: sharedLayout,
};

export const fallbackLayout: RoleLayout = {
    activeWidgets: [
        "favorites",
        "numStats",
        "pieRoles",
        "pieDocs",
        "userLogs",
        "hitCounts",
        "calendar",
    ],
    layout: [
        //row 1
        { i: "favorites", x: 0, y: 0, w: 12, h: 6, resizeHandles: ["s"] },
        //row 2
        { i: "numStats", x: 0, y: 4, w: 4, h: 4 },
        { i: "pieRoles", x: 4, y: 4, w: 4, h: 4 },
        { i: "pieDocs", x: 8, y: 4, w: 4, h: 4 },
        //row 3
        { i: "userLogs", x: 0, y: 8, w: 5, h: 9, resizeHandles: ["s"]},
        { i: "hitCounts", x: 5, y: 8, w: 7, h: 9 },
        { i: "calendar", x: 0, y: 14, w: 12, h: 6 },
    ],
};
