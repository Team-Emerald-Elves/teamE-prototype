import { GripHorizontal, X } from "lucide-react";

interface Props {
    widgetId: string;
    label: string;
    isEditing: boolean;
    onRemove: (id: string) => void;
    children: React.ReactNode;
}

export default function WidgetWrapper({widgetId, label, isEditing, onRemove, children,}: Props) {
    return (
        //AI GENERATED STYLING
        <div className="h-full flex flex-col bg-card border rounded-lg shadow-sm overflow-hidden">
            <div
                className={`
          flex items-center justify-between px-3 py-2 border-b text-sm font-medium
          ${isEditing ? "widget-drag-handle cursor-grab bg-muted/50" : ""}`}>
                <div className="flex items-center gap-2">
                    {isEditing && <GripHorizontal size={14} className="text-muted-foreground" />}
                    <span>{label}</span>
                </div>
                {isEditing && (
                    <button
                        onClick={(e) => {e.stopPropagation();onRemove(widgetId);
                        }}
                        className="text-muted-foreground hover:text-destructive"
                        title="Remove widget">
                        <X size={14} />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-auto p-3">
                {children}
            </div>
        </div>
    );
}