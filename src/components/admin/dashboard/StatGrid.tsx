import { Card, CardContent } from "@/components/ui/card";
import { Box, Clock, CheckCircle, XCircle } from "lucide-react";

const stats = [
    { label: "Total Items", value: "143", icon: Box, color: "text-blue-500", bg: "bg-blue-50", border: "border-b-blue-500" },
    { label: "Pending Claims", value: "8", icon: Clock, color: "text-orange-500", bg: "bg-orange-50", border: "border-b-orange-500", tag: "Needs Review" },
    { label: "Approved", value: "67", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", border: "border-b-green-500", trend: "+12% this month" },
    { label: "Rejected", value: "15", icon: XCircle, color: "text-red-500", bg: "bg-red-50", border: "border-b-red-500" },
];

export function StatGrid() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
                <Card key={i} className={`border-b-4 ${s.border} shadow-sm`}>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                                <h3 className="text-3xl font-bold mt-1">{s.value}</h3>
                                {s.tag && <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">● {s.tag}</span>}
                                {s.trend && <span className="text-xs text-green-600 font-medium">↑ {s.trend}</span>}
                            </div>
                            <div className={`p-3 rounded-xl ${s.bg}`}>
                                <s.icon className={`h-6 w-6 ${s.color}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}