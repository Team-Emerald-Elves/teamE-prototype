import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
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
        <div className="relative">
            {/* Info popover - top right of card */}
            <div className="absolute top-2 right-2 z-10">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-5 w-5 text-muted-foreground hover:text-foreground"
                        >
                            <Info className="h-3 w-3" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent side="bottom" align="end" className="w-72">
                        <p className="font-medium text-sm mb-2">Calendar</p>
                        <p className="text-xs text-muted-foreground mb-3">
                            Keep track of important events and deadlines.
                        </p>
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-foreground">
                                Features
                            </p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>Click any date to create a new event</li>
                                <li>
                                    Click an existing event to view or edit it
                                </li>
                                <li>Delete events you no longer need</li>
                                <li>Events are color coded by role</li>
                                <li>Navigate months with the arrows</li>
                            </ul>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <Card className="w-full max-w-sm shadow-sm pb-2">
                {/* everything below is unchanged */}
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
        </div>
    );
}
