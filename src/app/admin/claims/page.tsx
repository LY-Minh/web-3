import { Separator } from "@/components/ui/separator";
import { FileText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// We put the data and the table right here in the page!
const claims = [
    {
        id: "1",
        item: "Backpack",
        student: "John Doe",
        date: "Apr 23, 2024",
        status: "Pending",
        image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=300&auto=format&fit=crop",
    },
    // ... you can add more here
];

export default function AdminClaimsPage() {
    return (
        <div className="flex-1 p-8 bg-slate-50 min-h-screen">
            <Link href="/admin">
                <Button variant="ghost" className="mb-4 text-slate-500 hover:text-blue-600">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
            </Link>

            <div className="flex items-center gap-2 mb-6">
                <FileText className="h-8 w-8 text-blue-600" />
                <h2 className="text-3xl font-bold tracking-tight">All Claims</h2>
            </div>

            <Separator className="mb-8" />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            <th className="px-6 py-4">Item</th>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {claims.map((claim) => (
                            <tr key={claim.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="h-10 w-10 relative rounded-lg overflow-hidden border">
                                        <Image src={claim.image} alt="" fill sizes="40px" className="object-cover" />
                                    </div>
                                    <span className="font-bold text-sm">{claim.item}</span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">{claim.student}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{claim.date}</td>
                                <td className="px-6 py-4">
                                    <Badge className="bg-orange-50 text-orange-600 border-orange-100">{claim.status}</Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-100">Review</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}