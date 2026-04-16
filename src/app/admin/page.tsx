import {
  Bell,
  Box,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
  Plus,
  Printer,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

// --- Mock Data ---
const stats = [
  {
    title: "Total Items",
    value: "143",
    note: "+12 this month",
    icon: Box,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    noteColor: "text-green-600",
  },
  {
    title: "Pending Claims",
    value: "8",
    note: "Needs Action",
    icon: Clock3,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    noteColor: "text-amber-700",
    noteBadge: true,
  },
  {
    title: "Approved",
    value: "67",
    note: "+8% this month",
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    noteColor: "text-green-600",
  },
  {
    title: "Rejected",
    value: "15",
    note: "Closed cases",
    icon: ShieldCheck,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    noteColor: "text-slate-400",
  },
];

const recentClaims = [
  {
    item: "Backpack",
    desc: "(Black)",
    student: "John Doe",
    studentId: "IT-2021",
    date: "Apr 23, 2024",
    status: "Pending",
    action: "Review",
    image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=300&auto=format&fit=crop",
  },
  {
    item: "USB Drive",
    desc: "(16GB)",
    student: "Sara Kim",
    studentId: "CS-2022",
    date: "Apr 22, 2024",
    status: "Approved",
    action: "View",
    image: "https://images.unsplash.com/photo-1587145820098-23e484e69816?q=80&w=300&auto=format&fit=crop",
  },
  {
    item: "Notebook",
    desc: "(Blue)",
    student: "Ali Hassan",
    studentId: "EE-2023",
    date: "Apr 21, 2024",
    status: "Rejected",
    action: "View",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=300&auto=format&fit=crop",
  },
  {
    item: "Wallet",
    desc: "(Brown)",
    student: "Maria Lopez",
    studentId: "ME-2021",
    date: "Apr 20, 2024",
    status: "Pending",
    action: "Review",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=300&auto=format&fit=crop",
  },
];

const activityLogs = [
  { text: "New claim submitted", time: "10 mins ago", color: "bg-amber-400" },
  { text: "Item approved", time: "1 hour ago", color: "bg-green-500" },
  { text: "Item returned", time: "3 hours ago", color: "bg-blue-500" },
];

// --- Helper Components & Functions ---
function getStatusBadgeClass(status: string) {
  switch (status) {
    case "Pending": return "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-50";
    case "Approved": return "bg-green-50 text-green-600 border-green-200 hover:bg-green-50";
    case "Rejected": return "bg-red-50 text-red-600 border-red-200 hover:bg-red-50";
    default: return "bg-slate-50 text-slate-600 hover:bg-slate-50";
  }
}

function SidebarItem({ icon: Icon, label, active = false, trailing = false }: { icon: any, label: string, active?: boolean, trailing?: boolean }) {
  return (
    <button className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition ${active ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
      <span className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        <span className="text-base font-medium">{label}</span>
      </span>
      {trailing && <ChevronRight className="h-4 w-4 opacity-50" />}
    </button>
  );
}

// --- Main Page Component ---
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="hidden w-[280px] bg-[#0F172A] text-white lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Lost & Found</h1>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 px-4">Menu</p>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
            <div className="pt-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 px-4">Management</p>
              <SidebarItem icon={Box} label="Items" trailing />
              <SidebarItem icon={FileText} label="Claims" trailing />
              <SidebarItem icon={WalletCards} label="Agreements" trailing />
            </div>
            <div className="pt-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2 px-4">System</p>
              <SidebarItem icon={Users} label="Users" trailing />
              <SidebarItem icon={Clock3} label="Logs" />
              <SidebarItem icon={Settings} label="Settings" />
            </div>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 text-slate-400 hover:text-white transition px-4 py-2">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input className="pl-10 bg-slate-50 border-none rounded-lg" placeholder="Search items, claims..." />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">Admin User</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">Administrator</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-slate-100">
                <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 max-w-[1600px] w-full mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
              <p className="text-slate-500">Welcome back, Admin!</p>
            </div>
            <Button variant="outline" className="bg-white gap-2">
              <Clock3 className="h-4 w-4" /> April 24, 2024
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-slate-500 mb-1">{stat.title}</p>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                      <div className="mt-2">
                        {stat.noteBadge ? (
                          <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">● {stat.note}</span>
                        ) : (
                          <span className={`text-xs font-bold ${stat.noteColor}`}>{stat.note}</span>
                        )}
                      </div>
                    </div>
                    <div className={`p-3 rounded-2xl ${stat.iconBg}`}>
                      <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <div className={`absolute bottom-0 left-0 h-1 w-full ${stat.iconColor.replace('text', 'bg')}/20`} />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Claims Table */}
            <div className="lg:col-span-2">
              <Card className="border-none shadow-sm h-full">
                <CardHeader className="flex flex-row items-center justify-between px-8 py-6">
                  <CardTitle className="text-lg font-bold text-slate-900">Recent Claims</CardTitle>
                  <Button variant="link" className="text-blue-600 font-bold p-0 h-auto">View All →</Button>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                          <th className="pb-4">Item</th>
                          <th className="pb-4">Student</th>
                          <th className="pb-4">Date</th>
                          <th className="pb-4">Status</th>
                          <th className="pb-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {recentClaims.map((claim, idx) => (
                          <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-slate-100 relative overflow-hidden shrink-0">
                                  <Image src={claim.image} alt={claim.item} fill className="object-cover" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{claim.item}</p>
                                  <p className="text-[10px] text-slate-400 font-medium tracking-tight">{claim.desc}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <p className="text-sm font-bold text-slate-900">{claim.student}</p>
                              <p className="text-[10px] text-slate-400 font-medium tracking-tight">{claim.studentId}</p>
                            </td>
                            <td className="py-4 text-xs font-semibold text-slate-500">{claim.date}</td>
                            <td className="py-4">
                              <Badge variant="outline" className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-2 ${getStatusBadgeClass(claim.status)}`}>
                                {claim.status}
                              </Badge>
                            </td>
                            <td className="py-4 text-right">
                              <Button variant="outline" size="sm" className="h-8 px-4 font-bold text-[11px] border-blue-100 text-blue-600 hover:bg-blue-50">
                                {claim.action}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Activity */}
            <div className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader className="px-8 py-6">
                  <CardTitle className="text-lg font-bold text-slate-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex flex-col gap-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 justify-start gap-3 rounded-xl shadow-lg shadow-blue-200">
                    <Plus className="h-5 w-5" /> Add New Item
                  </Button>
                  <Button variant="outline" className="w-full h-12 justify-start gap-3 rounded-xl border-green-100 bg-green-50 text-green-700 hover:bg-green-100">
                    <FileText className="h-5 w-5" /> View Claims
                  </Button>
                  <Button variant="outline" className="w-full h-12 justify-start gap-3 rounded-xl border-orange-100 bg-orange-50 text-orange-700 hover:bg-orange-100">
                    <Printer className="h-5 w-5" /> Print Agreements
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader className="px-8 py-6 pb-2">
                  <CardTitle className="text-lg font-bold text-slate-900">System Activity</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-6">
                  {activityLogs.map((log, i) => (
                    <div key={i} className="flex gap-4">
                      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${log.color} ring-4 ${log.color.replace('bg-', 'ring-')}/10`} />
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-none mb-1">{log.text}</p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-tight">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <footer className="mt-12 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <p>© 2026 Lost & Found System • AUPP Admin Panel</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>System Status: Online</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}