"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, Bell, MessageSquare, Package, FileCheck2, 
  Users, History, Settings, LogOut 
} from "lucide-react";
import styles from "./admin-layout.module.css";

export default function AdminWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.adminPage}>
      {/* SIDEBAR */}
      <aside className={styles.adminSidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.adminBrand}>
            <div className={styles.brandIcon}>
              <Package size={20} />
            </div>
            <div>
              <h2>Lost & Found</h2>
              <p>Admin Dashboard</p>
            </div>
          </div>

          <div className={styles.menuLabel}>Management</div>
          <nav className={styles.adminNav}>
            <Link 
              href="/admin/items" 
              className={`${styles.navItem} ${pathname === '/admin/items' ? styles.active : ''}`}
            >
              <Package size={18} /> Items
            </Link>
            <Link 
              href="/admin/claims" 
              className={`${styles.navItem} ${pathname === '/admin/claims' ? styles.active : ''}`}
            >
              <FileCheck2 size={18} /> Claims
            </Link>
            <Link 
              href="/admin/agreements" 
              className={`${styles.navItem} ${pathname === '/admin/agreements' ? styles.active : ''}`}
            >
              <FileCheck2 size={18} /> Agreements
            </Link>
          </nav>

          <div className={styles.menuLabel}>System</div>
          <nav className={styles.adminNav}>
            <Link href="/admin/users" className={styles.navItem}>
              <Users size={18} /> Users
            </Link>
            <Link 
              href="/admin/logs" 
              className={`${styles.navItem} ${pathname === '/admin/logs' ? styles.active : ''}`}
            >
              <History size={18} /> Activity Logs
            </Link>
            <Link href="/admin/settings" className={styles.navItem}>
              <Settings size={18} /> Settings
            </Link>
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <button className={styles.logoutBtn}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className={styles.adminMain}>
        {/* TOPBAR */}
        <header className={styles.adminTopbar}>
          <div className={styles.searchBar}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Search across the system..." />
          </div>

          <div className={styles.topbarRight}>
            <button className={styles.iconBtn}>
              <Bell size={20} />
              <span className={styles.badge}></span>
            </button>
            <button className={styles.iconBtn}>
              <MessageSquare size={20} />
            </button>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}></div>
              Admin User
            </div>
          </div>
        </header>

        {/* This injects your specific page content (like the Items page) right here */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}