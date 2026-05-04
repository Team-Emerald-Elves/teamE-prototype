import type { Layout } from "react-grid-layout";

export interface WidgetProps {
    isEditing: boolean;
}
export interface WidgetDefinition {
    component: React.ComponentType<WidgetProps>;
    label: string;
    description: string;
    defaultW: number;
    defaultH: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    isResizable?: boolean;
    icon?: React.ComponentType<{ size?: number }>;
    allowedRoles?: string[];
}

export type WidgetRegistry = Record<string, WidgetDefinition>;

export interface SavedDashboard {
    layout: Layout[];
    activeWidgets: string[];
}
