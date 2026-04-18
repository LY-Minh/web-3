"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Download, Filter, ChevronLeft, ChevronRight,
  Package, FileCheck2, Users, History, Settings, LogOut,
  Bell, MessageSquare, Search,
} from "lucide-react";
import styles from "./logs.module.css";

type ActionType = "added" | "approved" | "updated" | "submitted" | "deleted" | "printed";

interface LogEntry {
  id: string; timestamp: string;
  user: string; email: string; role: string;
  action: string; actionType: ActionType;
  module: string; details: string;
}

const MOCK_LOGS: LogEntry[] = [
  { id: "1", timestamp: "2025-04-22T15:45:00", user: "Admin User",   email: "admin@school.edu",    role: "admin",   action: "Approved Claim",   actionType: "approved",  module: "Claims",     details: "Approved claim for iPhone (Silver) by Sara Kim"       },
  { id: "2", timestamp: "2025-04-22T15:20:00", user: "Staff User",   email: "staff@school.edu",    role: "staff",   action: "Added Item",        actionType: "added",     module: "Items",      details: "Added new item: Water Bottle (Blue)"                  },
  { id: "3", timestamp: "2025-04-22T14:15:00", user: "Admin User",   email: "admin@school.edu",    role: "admin",   action: "Updated Item",      actionType: "updated",   module: "Items",      details: "Updated details for Backpack (Black)"                 },
  { id: "4", timestamp: "2025-04-22T13:40:00", user: "Student User", email: "john.doe@school.edu", role: "student", action: "Submitted Claim",   actionType: "submitted", module: "Claims",     details: "Submitted claim for Set of Keys"                      },
  { id: "5", timestamp: "2025-04-22T11:30:00", user: "Staff User",   email: "staff@school.edu",    role: "staff",   action: "Deleted Item",      actionType: "deleted",   module: "Items",      details: "Deleted item: Old Umbrella"                           },
  { id: "6", timestamp: "2025-04-22T10:00:00", user: "Admin User",   email: "admin@school.edu",    role: "admin",   action: "Printed Agreement", actionType: "printed",   module: "Agreements", details: "Printed agreement AGR-2025-064"                       },
];

const ACTION_CLASS: Record<ActionType, string> = {
  approved: styles.pillApproved, added: styles.pillAdded, updated: styles.pillUpdated,
  submitted: styles.pillSubmitted, deleted: styles.pillDeleted, printed: styles.pillPrinted,
};

const MODULE_TABS = ["All Modules", "Items", "Claims", "Agreements"];

function fmtDate(iso: string) { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function fmtTime(iso: string) { return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }); }
function initials(name: string) { return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(); }

export default function AdminLogsPage() {
  const [activeModule, setActiveModule] = useState("All Modules");

  const filtered = activeModule === "All Modules"
    ? MOCK_LOGS
    : MOCK_LOGS.filter(l => l.module === activeModule);

  const topActions = [
    { label: "Added Items",      count: MOCK_LOGS.filter(l => l.actionType === "added").length,     dot: styles.dotBlue   },
    { label: "Approved Claims",  count: MOCK_LOGS.filter(l => l.actionType === "approved").length,  dot: styles.dotGreen  },
    { label: "Updated Records",  count: MOCK_LOGS.filter(l => l.actionType === "updated").length,   dot: styles.dotPurple },
    { label: "Printed Documents",count: MOCK_LOGS.filter(l => l.actionType === "printed").length,   dot: styles.dotGrey   },
    { label: "Deleted Records",  count: MOCK_LOGS.filter(l => l.actionType === "deleted").length,   dot: styles.dotRed    },
  ];

  return (
    <div className={styles.adminPage}>

      {/* ── SIDEBAR ── */}
      <aside className={styles.adminSidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.adminBrand}>
            <div className={styles.brandIcon}><Package size={20} /></div>
            <div><h2>Lost &amp; Found</h2><p>Admin Dashboard</p></div>
          </div>
          <p className={styles.menuLabel}>Management</p>
          <nav className={styles.adminNav}>
            <Link href="/admin/items"      className={styles.navItem}><Package    size={18} /> Items</Link>
            <Link href="/admin/claims"     className={styles.navItem}><FileCheck2 size={18} /> Claims</Link>
            <Link href="/admin/agreements" className={styles.navItem}><FileCheck2 size={18} /> Agreements</Link>
          </nav>
          <p className={styles.menuLabel}>System</p>
          <nav className={styles.adminNav}>
            <Link href="/admin/users"    className={styles.navItem}><Users    size={18} /> Users</Link>
            <Link href="/admin/logs"     className={`${styles.navItem} ${styles.active}`}><History size={18} /> Activity Logs</Link>
            <Link href="/admin/settings" className={styles.navItem}><Settings size={18} /> Settings</Link>
          </nav>
        </div>
        <div className={styles.sidebarBottom}>
          <button className={styles.logoutBtn}><LogOut size={18} /> Logout</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className={styles.adminMain}>
        <header className={styles.adminTopbar}>
          <div className={styles.searchBar}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Search items, students, claims..." />
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.iconBtn}><Bell size={20} /><span className={styles.badge}></span></button>
            <button className={styles.iconBtn}><MessageSquare size={20} /></button>
            <div className={styles.userProfile}><div className={styles.userAvatar}></div><span>Admin User</span></div>
          </div>
        </header>

        <div className={styles.pageContent}>
          <div className={styles.pageHeaderRow}>
            <div>
              <h1 className={styles.pageTitle}>Activity Logs</h1>
              <p className={styles.pageSubtitle}>Track all system activities and changes made by users.</p>
            </div>
            <button className={styles.exportBtn}><Download size={16} /> Export</button>
          </div>

          {/* Module tabs + filter */}
          <div className={styles.controlsRow}>
            <div className={styles.tabs}>
              {MODULE_TABS.map(tab => (
                <button key={tab} className={`${styles.tabBtn} ${activeModule === tab ? styles.tabActive : ""}`} onClick={() => setActiveModule(tab)}>
                  {tab}
                </button>
              ))}
            </div>
            <button className={styles.filterBtn}><Filter size={16} /> Filters</button>
          </div>

          {/* Main layout: table + sidebar */}
          <div className={styles.mainLayout}>

            {/* Table */}
            <div className={styles.tableContainer}>
              <table className={styles.adminTable}>
                <thead>
                  <tr><th>Time</th><th>User</th><th>Action</th><th>Module</th><th>Details</th><th>IP Address</th></tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className={styles.emptyRow}>No activity found.</td></tr>
                  ) : filtered.map(log => (
                    <tr key={log.id}>
                      <td>
                        <p className={styles.dateText}>{fmtDate(log.timestamp)}</p>
                        <p className={styles.timeText}>{fmtTime(log.timestamp)}</p>
                      </td>
                      <td>
                        <div className={styles.userCell}>
                          <div className={`${styles.avatar} ${log.role === "admin" ? styles.avatarAdmin : log.role === "staff" ? styles.avatarStaff : styles.avatarStudent}`}>
                            {initials(log.user)}
                          </div>
                          <div>
                            <p className={styles.userName}>{log.user}</p>
                            <p className={styles.userEmail}>{log.email}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className={`${styles.actionPill} ${ACTION_CLASS[log.actionType]}`}>{log.action}</span></td>
                      <td className={styles.cellMuted}>{log.module}</td>
                      <td className={styles.cellMuted}>{log.details}</td>
                      <td className={styles.ipText}>192.168.1.101</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.paginationRow}>
                <p>Showing 1 to {filtered.length} of 248 log entries</p>
                <div className={styles.pageControls}>
                  <button className={styles.pageBtn}><ChevronLeft size={15} /></button>
                  <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
                  <button className={styles.pageBtn}>2</button>
                  <button className={styles.pageBtn}>3</button>
                  <span className={styles.pageDots}>...</span>
                  <button className={styles.pageBtn}>42</button>
                  <button className={styles.pageBtn}><ChevronRight size={15} /></button>
                </div>
              </div>
            </div>

            {/* Summary sidebar */}
            <aside className={styles.logSidebar}>
              <div className={styles.sideCard}>
                <h3>Log Summary</h3>
                <ul className={styles.summaryList}>
                  {[
                    { icon: "🕐", label: "Today",      value: 48,    hi: true },
                    { icon: "📅", label: "This Week",  value: 248   },
                    { icon: "📊", label: "This Month", value: "1,245" },
                    { icon: "📋", label: "Total Logs", value: "5,732" },
                  ].map(s => (
                    <li key={s.label} className={styles.summaryItem}>
                      <span className={styles.summaryLabel}><span>{s.icon}</span> {s.label}</span>
                      <span className={`${styles.summaryValue} ${s.hi ? styles.summaryHi : ""}`}>{s.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.sideCard}>
                <h3>Top Actions</h3>
                <ul className={styles.actionList}>
                  {topActions.map(a => (
                    <li key={a.label} className={styles.actionItem}>
                      <span className={styles.actionLabel}><span className={`${styles.dot} ${a.dot}`}></span>{a.label}</span>
                      <span className={styles.actionCount}>{a.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}