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
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

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
    title: "Approved Claims",
    value: "67",
    note: "+8 this month",
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    noteColor: "text-green-600",
  },
  {
    title: "Returned Items",
    value: "95",
    note: "+5 this month",
    icon: ShieldCheck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    noteColor: "text-blue-600",
  },
];

const recentClaims = [
  {
    item: "Backpack (Black)",
    student: "John Doe",
    date: "Apr 22, 2025",
    status: "Pending",
    action: "Review",
    image:
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?q=80&w=300&auto=format&fit=crop",
  },
  {
    item: "USB Drive (16GB)",
    student: "Sara Kim",
    date: "Apr 22, 2025",
    status: "Approved",
    action: "Completed",
    image:
      "https://images.unsplash.com/photo-1587145820098-23e484e69816?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    item: "Notebook (Blue)",
    student: "Ali Hassan",
    date: "Apr 21, 2025",
    status: "Rejected",
    action: "Review",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=300&auto=format&fit=crop",
  },
  {
    item: "Headphones",
    student: "Emma Lee",
    date: "Apr 21, 2025",
    status: "Pending",
    action: "Review",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop",
  },
  {
    item: "Wallet (Brown)",
    student: "Michael Tan",
    date: "Apr 20, 2025",
    status: "Approved",
    action: "Completed",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=300&auto=format&fit=crop",
  },
];
const activityLogs = [
  { text: "New claim submitted", time: "10 mins ago", color: "bg-amber-400" },
  { text: "Item approved", time: "1 hour ago", color: "bg-green-500" },
  { text: "Item returned", time: "3 hours ago", color: "bg-red-500" },
  { text: "New user registered", time: "5 hours ago", color: "bg-slate-400" },
];

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";
    case "Approved":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case "Rejected":
      return "bg-red-100 text-red-700 hover:bg-red-100";
    default:
      return "bg-slate-100 text-slate-700 hover:bg-slate-100";
  }
}

function getActionButtonClass(action: string) {
  if (action === "Review") {
    return "bg-blue-600 text-white hover:bg-blue-700";
  }
  return "bg-slate-100 text-slate-600 hover:bg-slate-200";
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[294px] flex-col bg-[#082a57] text-white lg:flex">
          <div className="px-8 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20">
                <ShieldCheck className="h-6 w-6 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-[22px] font-bold leading-none">
                  Lost & Found
                </h1>
                <p className="mt-1 text-sm text-slate-300">Admin Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="mt-8 px-5">
            <div className="space-y-2">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
            </div>

            <div className="mt-8">
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Management
              </p>
              <div className="mt-3 space-y-2">
                <SidebarItem icon={Box} label="Items" />
                <SidebarItem icon={FileText} label="Claims" trailing />
                <SidebarItem icon={WalletCards} label="Agreements" />
              </div>
            </div>

            <Separator className="my-7 bg-white/10" />

            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                System
              </p>
              <div className="mt-3 space-y-2">
                <SidebarItem icon={Users} label="Users" trailing />
                <SidebarItem icon={Clock3} label="Activity Logs" trailing />
                <SidebarItem icon={Settings} label="Settings" trailing />
              </div>
            </div>
          </nav>

          <div className="mt-auto px-5 pb-8">
            <Separator className="mb-6 bg-white/10" />
            <Link
              href="/"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-200 transition hover:bg-white/10"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-lg">Logout</span>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          {/* Topbar */}
          <header className="flex h-24 items-center justify-between border-b border-slate-200 bg-white px-6 md:px-9">
            <div className="relative w-full max-w-[460px]">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search items, students, claims..."
                className="h-12 rounded-xl border-slate-200 bg-[#f8fafc] pl-12 text-base shadow-none placeholder:text-slate-400"
              />
            </div>

            <div className="ml-6 flex items-center gap-5">
              <button className="relative text-slate-700">
                <Bell className="h-6 w-6" />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  3
                </span>
              </button>

              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage
                    src="https://i.pravatar.cc/100?img=12"
                    alt="Admin"
                  />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-base font-semibold text-slate-900">
                    Admin User
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="px-6 py-8 md:px-9">
            <div>
              <h2 className="text-5xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h2>
              <p className="mt-3 text-2xl text-slate-600">
                Welcome back,{" "}
                <span className="font-semibold text-slate-900">Admin!</span>{" "}
                Here&apos;s what&apos;s happening today.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-8 grid gap-5 xl:grid-cols-4 md:grid-cols-2">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={stat.title}
                    className="rounded-2xl border-slate-200 shadow-sm"
                  >
                    <CardContent className="flex items-start justify-between p-6">
                      <div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                          >
                            <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                          </div>
                          <p className="text-xl font-medium text-slate-700">
                            {stat.title}
                          </p>
                        </div>

                        <p className="mt-4 text-5xl font-bold text-slate-900">
                          {stat.value}
                        </p>

                        <div className="mt-4">
                          {stat.noteBadge ? (
                            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                              {stat.note}
                            </span>
                          ) : (
                            <span
                              className={`text-lg font-medium ${stat.noteColor}`}
                            >
                              {stat.note}
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="mt-1 h-5 w-5 text-slate-400" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Content */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
              {/* Recent claims */}
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-2xl font-bold">
                    Recent Claims
                  </CardTitle>
                  <Button
                    variant="link"
                    className="p-0 text-lg font-semibold text-blue-600 no-underline"
                  >
                    View All <ChevronRight className="ml-1 h-5 w-5" />
                  </Button>
                </CardHeader>

                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-3">
                      <thead>
                        <tr className="rounded-xl bg-slate-50 text-left text-sm text-slate-500">
                          <th className="rounded-l-xl px-4 py-4 font-medium">
                            Item
                          </th>
                          <th className="px-4 py-4 font-medium">Student</th>
                          <th className="px-4 py-4 font-medium">Date</th>
                          <th className="px-4 py-4 font-medium">Status</th>
                          <th className="rounded-r-xl px-4 py-4 font-medium">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentClaims.map((claim) => (
                          <tr
                            key={`${claim.item}-${claim.student}`}
                            className="border-b border-slate-100 last:border-b-0"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
                                  <Image
                                    src={claim.image}
                                    alt={claim.item}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                  />
                                </div>
                                <span className="text-sm font-medium text-slate-900 md:text-[15px]">
                                  {claim.item}
                                </span>
                              </div>
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-800 md:text-[15px] whitespace-nowrap">
                              {claim.student}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-500 md:text-[15px] whitespace-nowrap">
                              {claim.date}
                            </td>

                            <td className="px-4 py-4">
                              <Badge
                                className={`rounded-full px-3 py-1 text-xs font-medium md:text-sm ${getStatusBadgeClass(
                                  claim.status
                                )}`}
                              >
                                {claim.status}
                              </Badge>
                            </td>

                            <td className="px-4 py-4">
                              <Button
                                className={`h-9 rounded-xl px-4 text-sm font-semibold ${getActionButtonClass(
                                  claim.action
                                )}`}
                              >
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

              {/* Right side */}
              <div className="space-y-6">
                <Card className="rounded-2xl border-slate-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-xl font-bold">
                      Recent Claims
                    </CardTitle>
                    <Button
                      variant="link"
                      className="p-0 text-sm font-semibold text-blue-600 no-underline"
                    >
                      View All <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardHeader>

                  <CardContent>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50">
                          <tr className="text-sm text-slate-500">
                            <th className="px-4 py-3 font-medium">Item</th>
                            <th className="px-4 py-3 font-medium">Student</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Action</th>
                          </tr>
                        </thead>

                        <tbody>{/* put the tbody code here */}</tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                      System Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {activityLogs.map((log) => (
                      <div
                        key={log.text}
                        className="flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-2 h-2.5 w-2.5 rounded-full ${log.color}`}
                          />
                          <p className="text-lg text-slate-800">{log.text}</p>
                        </div>
                        <span className="shrink-0 text-base text-slate-500">
                          {log.time}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-base text-slate-500 md:flex-row md:items-center md:justify-between">
              <p>© 2025 Lost & Found System · Admin Panel</p>
              <p>Last updated: Apr 22, 2025, 3:45 PM</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  trailing?: boolean;
};

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  trailing = false,
}: SidebarItemProps) {
  return (
    <button
      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition ${
        active
          ? "bg-white/10 text-white"
          : "text-slate-200 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon className="h-5 w-5" />
        <span className="text-lg">{label}</span>
      </span>
      {trailing ? <ChevronRight className="h-4 w-4 opacity-70" /> : null}
    </button>
  );
}
