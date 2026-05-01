import type { Layout } from "react-grid-layout";
import type { SavedDashboard } from "./widget-def";

interface LayoutRequest {
    action: "list" | "create" | "edit" | "delete";
    layoutData?: SavedDashboard;
}

async function postLayout(body: LayoutRequest, token: string | null) {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/layouts`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
            `Layout request failed (status ${res.status}): ${errorText}`,
        );
    }

    return res.json();
}

export async function loadLayout(
    token: string | null,
): Promise<SavedDashboard | null> {
    const data = await postLayout({ action: "list" }, token);
    if (
        !data ||
        !Array.isArray(data.layout) ||
        !Array.isArray(data.activeWidgets)
    ) {
        return null;
    }
    return {
        layout: data.layout as Layout[],
        activeWidgets: data.activeWidgets as string[],
    };
}

export async function saveLayouts(
    dashboard: SavedDashboard,
    token: string | null,
) {
    return postLayout({ action: "create", layoutData: dashboard }, token);
}
