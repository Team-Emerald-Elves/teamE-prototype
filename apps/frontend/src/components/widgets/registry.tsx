import type { WidgetRegistry, WidgetProps } from "./widget-def";
import {
    Star,
    Activity,
    BarChart3,
    PieChart,
    Calendar,
    TrendingUp,
} from "lucide-react";
import Favorites from "@/components/favorites.tsx";
import { HitCounts } from "@/components/hit-counts.tsx";
import { UserLogs } from "@/components/user-logs.tsx";
import { NumericalStats } from "@/components/numerical-stats.tsx";
import { ChartPieSeparatorNone } from "@/components/piechartroles.tsx";
import { ChartPieStacked } from "@/components/piechartdocuments.tsx";
import CalendarWeek from "@/components/calendarWeekComponent.tsx";

const wrap = (Component: React.ComponentType): React.FC<WidgetProps> => {
    const Wrapped: React.FC<WidgetProps> = () => <Component />;
    Wrapped.displayName = `WidgetWrapper(${Component.displayName || Component.name || "Component"})`;
    return Wrapped;
};

//if ur trying to remove the error plz make defaultW and defaultH optional im too lazy to do that rn
export const widgetRegistry: WidgetRegistry = {
    //AI GENERATED!!!
    favorites: {
        component: wrap(Favorites),
        label: "Favorites",
        description: "Your favorited documents and links",
        // defaultW: 6,
        // defaultH: 10,
        minW: 2,
        minH: 4,
        icon: Star,
    },
    userLogs: {
        component: wrap(UserLogs),
        label: "User Logs",
        description: "Recent user activity logs",
        // defaultW: 6,
        // defaultH: 8,
        minW: 5,
        maxW: 5, //can't change width
        minH: 4,
        icon: Activity,
    },
    hitCounts: {
        component: wrap(HitCounts),
        label: "Hit Counts",
        description: "Document and link hit counts",
        // defaultW: 6,
        // defaultH: 8,
        minW: 4,
        minH: 4,
        icon: BarChart3,
    },
    numStats: {
        component: wrap(NumericalStats),
        label: "Numerical Stats",
        description: "Key numerical statistics",
        // defaultW: 5,
        // defaultH: 4,
        minW: 3,
        minH: 4,
        icon: TrendingUp,
    },
    pieRoles: {
        component: wrap(ChartPieSeparatorNone),
        label: "Roles Chart",
        description: "Pie chart of users by role",
        // defaultW: 4,
        // defaultH: 4,
        minW: 3,
        minH: 4,
        icon: PieChart,
    },
    pieDocs: {
        component: wrap(ChartPieStacked),
        label: "Documents Chart",
        description: "Pie chart of documents by status",
        // defaultW: 4,
        // defaultH: 4,
        minW: 3,
        minH: 3,
        icon: PieChart,
    },
    calendar: {
        component: wrap(CalendarWeek),
        label: "Calendar",
        description: "Weekly calendar view",
        // defaultW: 12,
        // defaultH: 8,
        minW: 6,
        minH: 6,
        maxH: 12,
        icon: Calendar,
    },
};
