import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type RoleLegendProps = {
    roleColors?: Record<string, string>;
};
const DEFAULT_ROLE_COLORS: Record<string, string> = {
    "#6D28D9": "Administrator",
    "#93C5FD": "BusinessAnalyst",
    "#F9A8D4": "UnderWriter",
    "#2DD4BF": "ExcelOperator",
    "#C4B5FD": "BusinessOperator",
    "#F0ABFC": "ActuarialAnalyst",
};

export default function RoleLegend({
                                       roleColors = DEFAULT_ROLE_COLORS,
                                   }: RoleLegendProps) {
    return (
        <Card className="w-full max-w-sm shadow-sm pb-2">
            <CardHeader>
                <CardTitle className="text-xs font-semibold">
                    Role Legend
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-3 gap-x-2 gap-y-1">
                    {Object.entries(roleColors).map(([color, role]) => (
                        <div
                            key={role}
                            className="flex items-center gap-1.5"
                        >
                            <span
                                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-[11px] text-muted-foreground truncate">
                                {role}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}