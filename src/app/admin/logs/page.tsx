"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileCheck2, History, Package } from "lucide-react";
import styles from "./logs.module.css";
import AdminLogoutButton from "@/components/admin-logout-button";

type LogEntry = {
  id: string;
  createdAt: string;
  action: string;
  details: string | null;
  userName: string | null;
  userEmail: string | null;
  userRole: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadLogs = async () => {
      setIsLoading(true);
      try {
        setError(null);
        const response = await fetch("/api/admin/logs", { cache: "no-store" });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "Failed to fetch logs");
        }

        const payload = (await response.json()) as LogEntry[];
        if (!isCancelled) {
          setLogs(payload);
        }
      } catch (fetchError) {
        if (!isCancelled) {
          const message = fetchError instanceof Error ? fetchError.message : "Failed to fetch logs";
          setError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadLogs();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className={styles.adminPage}>
      <aside className={styles.adminSidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.adminBrand}>
            <div className={styles.brandIcon}>
              <Package size={20} />
            </div>
            <div>
              <h2>Lost &amp; Found</h2>
              <p>Admin Panel</p>
            </div>
          </div>
          <p className={styles.menuLabel}>Navigation</p>
          <nav className={styles.adminNav}>
            <Link href="/admin/items" className={styles.navItem}>
              <Package size={18} /> Items
            </Link>
            <Link href="/admin/claims" className={styles.navItem}>
              <FileCheck2 size={18} /> Claims
            </Link>
            <Link href="/admin/agreements" className={styles.navItem}>
              <FileCheck2 size={18} /> Agreements
            </Link>
            <Link href="/admin/logs" className={`${styles.navItem} ${styles.active}`}>
              <History size={18} /> Activity Logs
            </Link>
          </nav>
        </div>
        <div className={styles.sidebarBottom}>
          <AdminLogoutButton className={styles.logoutBtn} />
        </div>
      </aside>

      <main className={styles.adminMain}>
        <header className={styles.adminTopbar}>
          <div>
            <p className={styles.pageSubtitle}>Plain audit table from backend logs API.</p>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.userProfile}>
              <span>Admin User</span>
            </div>
          </div>
        </header>

        <div className={styles.pageContent}>
          <div className={styles.pageHeaderRow}>
            <div>
              <h1 className={styles.pageTitle}>Activity Logs</h1>
              <p className={styles.pageSubtitle}>No filtering. No search. Just raw log records.</p>
            </div>
          </div>

          {error && (
            <div className={styles.tableContainer} style={{ marginBottom: 16 }}>
              <div className={styles.emptyRow} style={{ padding: 20 }}>
                {error}
              </div>
            </div>
          )}

          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyRow}>
                      Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyRow}>
                      No activity found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <p className={styles.dateText}>{formatDate(log.createdAt)}</p>
                        <p className={styles.timeText}>{formatTime(log.createdAt)}</p>
                      </td>
                      <td>
                        <p className={styles.userName}>{log.userName ?? "System"}</p>
                        <p className={styles.userEmail}>{log.userEmail ?? "-"}</p>
                      </td>
                      <td className={styles.cellMuted}>{log.userRole ?? "system"}</td>
                      <td className={styles.cellMuted}>{log.action}</td>
                      <td className={styles.cellMuted}>{log.details ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
