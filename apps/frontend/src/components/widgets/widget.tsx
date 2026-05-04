import { GripHorizontal, X } from "lucide-react";

interface Props {
    widgetId: string;
    label: string;
    isEditing: boolean;
    onRemove: (id: string) => void;
    children: React.ReactNode;
    isDragging: boolean;
}

export default function WidgetWrapper({
    widgetId,
    label,
    isEditing,
    onRemove,
    children,
    isDragging,
}: Props) {
    return (
        //AI GENERATED STYLING
        <div className="h-full flex flex-col bg-card border rounded-lg shadow-sm">
            <div
                className={`
          flex items-center justify-between px-3 py-2 border-0 text-sm font-medium
          overflow-hidden transition-all duration-200 ease-in-out
          ${
              isEditing
                  ? `max-h-16 widget-drag-handle ${isDragging ? "cursor-grabbing" : "cursor-grab"} opacity-100`
                  : "max-h-0 opacity-0 pointer-events-none"
          }`}
            >
                <div className="flex items-center gap-2 ">
                    {isEditing && (
                        <GripHorizontal
                            size={14}
                            className="var(--border-strong)"
                        />
                    )}
                </div>
                {isEditing && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(widgetId);
                        }}
                        className="text-(--border-strong) hover:text-destructive"
                        title="Remove widget"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-auto px-5 pb-1">{children}</div>
        </div>
    );
}
