import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const recentData = [
    { item: "Backpack", desc: "(Black)", student: "John Doe", id: "IT-2021", date: "Apr 23, 2024", status: "Pending" },
    { item: "USB Drive", desc: "(16GB)", student: "Sara Kim", id: "CS-2022", date: "Apr 22, 2024", status: "Approved" },
    { item: "Notebook", desc: "", student: "Ali Hassan", id: "EE-2023", date: "Apr 21, 2024", status: "Rejected" },
    { item: "Wallet", desc: "(Brown)", student: "Maria Lopez", id: "ME-2021", date: "Apr 20, 2024", status: "Pending" },
];

export function RecentClaimsTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-slate-50/50">
                    <TableHead>Item</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {recentData.map((row, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <div className="font-medium">{row.item}</div>
                            <div className="text-xs text-muted-foreground">{row.desc}</div>
                        </TableCell>
                        <TableCell>
                            <div className="font-medium">{row.student}</div>
                            <div className="text-xs text-muted-foreground">{row.id}</div>
                        </TableCell>
                        <TableCell className="text-sm">{row.date}</TableCell>
                        <TableCell>
                            <Badge variant={row.status === "Pending" ? "outline" : row.status === "Approved" ? "default" : "destructive"} className={row.status === "Pending" ? "bg-orange-50 text-orange-600 border-orange-200" : ""}>
                                {row.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button size="sm" variant="outline" className={row.status === "Pending" ? "text-blue-600 border-blue-200" : ""}>
                                {row.status === "Pending" ? "Review" : "View"}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}