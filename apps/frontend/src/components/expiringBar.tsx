import { useEffect, useState } from "react";

type ExpiringTimelineProps = {
    createdAt: string | Date;
    expiresAt: string | Date;
};

export default function ExpiringTimeline({
                                             createdAt,
                                             expiresAt,
                                         }: ExpiringTimelineProps) {
    const [percent, setPercent] = useState(0);
    const [nowLabel, setNowLabel] = useState("");
    const [isExpired, setIsExpired] = useState(false);

    const format = (d: Date) =>
        `${d.getMonth() + 1}/${d.getDate()}`;

    useEffect(() => {
        const start = new Date(createdAt).getTime();
        const end = new Date(expiresAt).getTime();

        const interval = setInterval(() => {
            const now = Date.now();

            const total = end - start;
            const elapsed = now - start;

            let p = total > 0 ? (elapsed / total) * 100 : 100;

            if (now >= end) {
                setPercent(100);
                setIsExpired(true);
                setNowLabel("Expired");
                clearInterval(interval);
                return;
            }

            p = Math.min(Math.max(p, 0), 100);

            setPercent(p);
            setNowLabel(format(new Date(now)));
        }, 1000);

        return () => clearInterval(interval);
    }, [createdAt, expiresAt]);

    const createdLabel = format(new Date(createdAt));
    const expiresLabel = format(new Date(expiresAt));



    const urgency =
        percent < 35
            ? "bg-green-400"
            : percent < 70
                ? "bg-yellow-400"
                : "bg-red-500";

    return (
        <div className="w-full pt-8 pl-5 pr-5">

            {/* TRACK */}
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-visible">

                {/* fill */}
                <div
                    className={`
                        absolute inset-0 rounded-full transition-colors duration-500
                        ${isExpired ? "bg-red-700" : urgency}
                    `}
                />

                {/* slider */}
                <div
                    className={`
                        absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                        w-3 h-3 bg-white border-2 rounded-full shadow z-10
                        ${isExpired ? "border-red-700 animate-pulse" : "border-gray-700"}
                    `}
                    style={{ left: `${percent}%` }}
                />


                <div
                    className="absolute -top-10 z-20 flex flex-col items-center pointer-events-none"
                    style={{
                        left: `${percent}%`,
                        transform: "translateX(-50%)",
                    }}
                >
                    {/* bubble */}
                    <div className="bg-white text-xs px-2 py-1 rounded shadow border text-gray-700 whitespace-nowrap">
                        {isExpired ? "EXPIRED" : nowLabel}
                    </div>

                    {/* arrow */}
                    <div
                        className="
                            w-0 h-0
                            border-l-4 border-r-4 border-t-4
                            border-transparent
                            border-t-white
                        "
                    />
                </div>

            </div>

            {/* AXIS LABELS */}
            <div className="flex justify-between text-xs mt-2">

                <span className="flex flex-col items-start leading-tight">
                    <span className={`font-medium ${isExpired ? "text-red-600" : ""}`}>
                        {createdLabel}
                    </span>
                    <span className="text-gray-500">Created</span>
                </span>

                <span className="flex flex-col items-end leading-tight">
                    <span className={`font-medium ${isExpired ? "text-red-600" : ""}`}>
                        {expiresLabel}
                    </span>
                    <span className="text-gray-500">Expires</span>
                </span>

            </div>
        </div>
    );
}