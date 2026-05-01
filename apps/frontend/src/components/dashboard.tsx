import { useMemo, useState, useEffect, useRef } from "react";
import GridLayout, { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useAuth } from "@clerk/react";

import WidgetWrapper from "./widgets/widget.tsx";
import { widgetRegistry } from "./widgets/registry.tsx";
import { defaultLayouts, fallbackLayout } from "./widgets/default-layouts.ts";
import type { SavedDashboard } from "./widgets/widget-def.ts";
import { loadLayout, saveLayouts } from "./widgets/layout-storage.ts";

interface Size {
    width: number;
    height: number;
}

function useResizeObserver<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null);
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            setSize({ width, height });
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return { ref, ...size };
}

interface DashboardProps {
    roles: string[];
    isEditing?: boolean;
}

function pickDefault(roles: string[]): SavedDashboard {
    /*for (const r of roles) {
        if (defaultLayouts[r]) return defaultLayouts[r];
    }*/
    return fallbackLayout;
}

export default function Dashboard({
    roles,
    isEditing = false,
}: DashboardProps) {
    const initial = useMemo(() => pickDefault(roles), [roles]);
    const [layout, setLayout] = useState<Layout[]>(initial.layout as Layout[]);
    const [activeWidgets, setActiveWidgets] = useState<string[]>(
        initial.activeWidgets,
    );
    const [loaded, setLoaded] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);
    const { getToken, isSignedIn } = useAuth();
    const { ref, width } = useResizeObserver();

    useEffect(() => {
        if (!isSignedIn) return;
        let cancelled = false;
        (async () => {
            try {
                const token = await getToken();
                const saved = await loadLayout(token);
                if (cancelled) return;
                if (saved) {
                    setLayout(saved.layout as Layout[]);
                    setActiveWidgets(saved.activeWidgets);
                    setHasSaved(true);
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setLoaded(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!loaded || hasSaved) return;
        setLayout(initial.layout as Layout[]);
        setActiveWidgets(initial.activeWidgets);
    }, [initial, loaded, hasSaved]);

    const wasEditing = useRef(false);
    useEffect(() => {
        if (!loaded || !isSignedIn) return;
        if (wasEditing.current && !isEditing) {
            (async () => {
                try {
                    const token = await getToken();
                    await saveLayouts({ layout, activeWidgets }, token);
                } catch (err) {
                    console.error(err);
                }
            })();
        }
        wasEditing.current = isEditing;
    }, [isEditing, layout, isSignedIn, activeWidgets, loaded, getToken]);

    const handleRemove = (id: string) => {
        setActiveWidgets((w) => w.filter((x) => x !== id));
        setLayout((l) => l.filter((item) => item.i !== id));
    };

    const constrainedLayout = useMemo(() =>
            layout.map((item) => {
                const def = widgetRegistry[item.i];
                if (!def) return item;
                return {
                    ...item,
                    minW: def.minW,
                    minH: def.minH,
                    maxW: def.maxW,
                    maxH: def.maxH,
                    static:!isEditing,
                    isResizable:false,
                };
            }),
        [layout,isEditing],
    );

    return (
        <div ref={ref}>
            {width > 0 && (
                <GridLayout
                    className="layout"
                    layout={constrainedLayout}
                    cols={12}
                    rowHeight={60}
                    autoSize={true}
                    width={width}
                    margin={[12, 12]}
                    isDraggable={true}
                    isResizable={false}
                    onLayoutChange={(l) => setLayout(l)}
                >
                    {activeWidgets.map((id) => {
                        const def = widgetRegistry[id];
                        if (!def) return null;
                        const Inner = def.component;
                        return (
                            <div key={id}>
                                <WidgetWrapper
                                    widgetId={id}
                                    label={def.label}
                                    isEditing={isEditing}
                                    onRemove={handleRemove}
                                >
                                    <Inner isEditing={isEditing} />
                                </WidgetWrapper>
                            </div>
                        );
                    })}
                </GridLayout>
            )}
        </div>
    );
}
